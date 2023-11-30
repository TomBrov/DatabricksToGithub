import * as cdk from 'aws-cdk-lib';
import {EndpointType, RestApi} from 'aws-cdk-lib/aws-apigateway';
import {Construct} from 'constructs';
import * as lambda from "aws-cdk-lib/aws-lambda";
import {handler} from "aws-cdk-lib/triggers/lib/lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";


interface Context {
    owner: string;
    repository: string;
    workflow_id: string;
    default_branch: string;
}

export interface ApiStackProps extends cdk.StackProps {
    Modulatorfn: lambda.IFunction;
}

export class Api_Stack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: ApiStackProps) {
        super(scope, id, props);

        const context: Context = this.node.tryGetContext("account_setings")
        const secretValueFromEnv = process.env.GH_PAT_TOKEN

        cdk.Tags.of(this).add("Stack", "DatabricksToGithub")
        cdk.Tags.of(this).add("Owner", context.owner)
        cdk.Tags.of(this).add("Repository", context.repository)

        if (!secretValueFromEnv) {
            throw new Error(
                "Environment variable GH_PAT_TOKEN is not set, please set it with the GitHub PAT token for runner registration"
            );
        }


        const api = new RestApi(this, 'MyApiGateway', {
            deployOptions: {
                stageName: 'prod',
            },
            endpointTypes: [EndpointType.EDGE],
        });

        // Create a resource and method for the /deploy path
        const root = api.root.addResource('api').addResource('v1')
        const deployResource = root.addResource("deploy")
        deployResource.addMethod('POST', new apigateway.LambdaIntegration(props.Modulatorfn));

    }
}

import * as cdk from 'aws-cdk-lib';
import {EndpointType, LambdaIntegration, RestApi} from 'aws-cdk-lib/aws-apigateway';
import {Construct} from 'constructs';
import * as pylambda from "@aws-cdk/aws-lambda-python-alpha";

export class Api_Stack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const context: Context = this.node.tryGetContext("account_setings")
        const secretValueFromEnv = process.env.GH_PAT_TOKEN

        cdk.Tags.of(this).add("Stack", "DatabricksToGithub")
        cdk.Tags.of(this).add("Owner", context.owner)
        cdk.Tags.of(this).add("Repository", context.repository)

        const lambdaFunctionArn = cdk.Fn.importValue('ModulatorFnExport');

        if (!secretValueFromEnv) {
            throw new Error(
                "Environment variable GH_PAT_TOKEN is not set, please set it with the GitHub PAT token for runner registration"
            );
        }

        const integration = new LambdaIntegration(
            pylambda.Function.fromFunctionArn(this, 'ModulatorFn', lambdaFunctionArn)
        );

        const api = new RestApi(this, 'MyApiGateway', {
            deployOptions: {
                stageName: 'prod',
            },
            endpointTypes: [EndpointType.EDGE],
        });

        // Create a resource and method for the /deploy path
        const root = api.root.addResource('api').addResource('v1')
        const deployResource = root.addResource("deploy")
        deployResource.addMethod('POST', integration);

    }
}

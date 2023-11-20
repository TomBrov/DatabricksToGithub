import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as pylambda from "@aws-cdk/aws-lambda-python-alpha";
import { Context } from "../lib/Context";
import * as secrets from "aws-cdk-lib/aws-secretsmanager";


export class Lambda_Stack extends cdk.Stack {
  public readonly ModulatorFn: lambda.IFunction;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
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

    const secret = new secrets.Secret(this, "RunnerConfigSecret", {
      description: "GH PAT token for github runner registration",
      secretStringValue: cdk.SecretValue.unsafePlainText(secretValueFromEnv),
    });

    this.ModulatorFn = new pylambda.PythonFunction(this, "ModulatorFn",{
      entry: "src/lambda",
      index: "functions/lambda.py",
      runtime: lambda.Runtime.PYTHON_3_10,
      timeout: cdk.Duration.seconds(30),
      environment: {
        SECRET_NAME: secret.secretName,
        OWNER: context.owner,
        REPOSITORY: context.repository,
        WORKFLOW_ID: context.workflow_id,
        DEFAULT_BRANCH: context.default_branch
      },
    });

  }
}

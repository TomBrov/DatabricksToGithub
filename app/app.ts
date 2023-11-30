#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Lambda_Stack } from './stacks/lambda_stack';
import { Api_Stack } from './stacks/api_stack';


const app = new cdk.App();
const lambda_stack= new Lambda_Stack(app, 'DatabricksToGithubStack', {});

const api = new Api_Stack(app, "apiStack", {
    Modulatorfn: lambda_stack.ModulatorFn,
})


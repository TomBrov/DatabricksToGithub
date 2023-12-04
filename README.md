![AWS](https://img.shields.io/badge/Amazon_AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![js](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
[![Poetry](https://img.shields.io/endpoint?url=https://python-poetry.org/badge/v0.json)](https://python-poetry.org/)
![maintanance](https://img.shields.io/badge/Maintained%3F-no-red.svg)
# Databricks to GitHub Integration
This project integrates Databricks with GitHub Actions, aiming to streamline machine learning workflows. The integration simplifies the version control process and enhances collaboration among data science teams by leveraging Databricks' robustness and GitHub Actions' automation capabilities

## GitHub Integration Rationale
The integration with GitHub is crucial for maintaining well-structured ML workflows, which ensures up-to-date model status and correct versioning. Databricks’ Webhooks feature is a key component in this integration, facilitating the automated transfer of model information to GitHub

### Payload Transformation
Transforming the JSON Payload from Databricks to match GitHub’s expected format is essential in ensuring the correct data is sent to GitHub

JSON payload from Databricks
```json
{
"event": "MODEL_VERSION_TRANSITIONED_STAGE",
"webhook_id": "c5596721253c4b429368cf6f4341b88a",
"event_timestamp": 1589859029343,
"model_name": "Airline_Delay_SparkML",
"version": "8",
"to_stage": "Production",
"from_stage": "None",
"text": "Registered model 'someModel' version 8 transitioned from None to Production."
}
```

JSON payload to send into Github
```json
{
  "ref": "OUR_MAIN_BRANCH", 
  "inputs": {
    "model_name": "OUR_MODEL_NAME"
    "model_version": "OUR_MODEL_VERSION"
  }
}
```

## CDK Application Overview

For this stack we use a context which holds all the values which will be sent down to our lambda and changes how the lambda is working accordingly.
```json
{
  "account_setings": {
    "owner": "OUR_GITHUB_USERNAME",
    "repository": "OUR_GITHUB_REPOSITORY_NAME",
    "workflow_id": "OUR_WORKFLOW_ID",
    "default_branch": "OUR_DEFAULT_BRANCH (Mostly main)"
  }
}

```

### How to get Workflow ID?
We can use Postman to find the ID of the wokflow that we want to trigger by running a GET request.

We will use the following path:
```
/repos/{owner}/{repo}/actions/workflows
```
to run this request we also need to get a PAT token which has permissions to bring information from the workflows by going to:

user settings -> developers settings -> generate token (classic)

said PAT token is to bs used under autharization tab.

## How To Deploy?
Follow these steps in order to deploy the stack onto your account with all the needed configurations.

* `npm install`     Installs all the needed packages for the integration.
*  Edit your `cdk.context.json` so that you would have all your needed configurations. (See CDK Application Overview to track what you need to change)
* `npm run deploy`  Deploy this stack to your default AWS account/region


## Useful commands

* `npm run deploy`  deploy this stack to your default AWS account/region
* `npm run destroy` destroy this stack from your default AWS account/region
* `npm run test`    perform the jest unit tests

## Disclaimer
If you are inside an organizational network with white labeling IP addresses then add the VPC to your lambda.
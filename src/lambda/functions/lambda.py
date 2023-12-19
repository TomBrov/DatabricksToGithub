import json
import requests
import boto3
import os

secrets_client = boto3.client('secretsmanager')
secret_name = os.environ["SECRET_NAME"]
owner = os.environ["OWNER"]
repository = os.environ["REPOSITORY"]
workflow_id = os.environ["WORKFLOW_ID"]
default_branch = os.environ["DEFAULT_BRANCH"]


def get_secret_PAT():
    # Retrieve the secret
    response = secrets_client.get_secret_value(
        SecretId=secret_name
    )

    # Extract the secret value from the response
    secret_value = response['SecretString']
    return secret_value


def lambda_handler(event, context):
    databricks_payload = event
    secret_token = get_secret_PAT()

    github_payload = {
        "ref": default_branch,
        "inputs": {
            "model_name": databricks_payload["model_name"],
            "model_version": databricks_payload["version"]
        }
    }

    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {secret_token}",
        "X-GitHub-Api-Version": "2022-11-28"
    }

    response = requests.post(
        f'https://api.github.com/repos/{owner}/{repository}/actions/workflows/{workflow_id}/dispatches',
        headers=headers,
        data=json.dumps(github_payload)
    )

    return {
        'statusCode': response.status_code,
        "response": response.text
    }

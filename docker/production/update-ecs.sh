#!/bin/bash

# Set variables
AWS_REGION="us-west-2"  # Change to your AWS region
ECR_REPO_NAME="documenso"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)
GIT_COMMIT_HASH=$(git rev-parse --short HEAD)  # Get the Git commit hash
IMAGE_TAG=$GIT_COMMIT_HASH
ECR_URL="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}"

CLUSTER_NAME="documenso-cluster"
TASK_DEFINITION_NAME="documenso-task-definition"
SERVICE_NAME="documenso-service"
VPC_ID="vpc-ce0e52b6"  # Your VPC ID
SUBNETS="subnet-980a3ab3,subnet-c69a229b,subnet-ae07a9d6,subnet-e809c2a2"  # Comma-separated list of subnet IDs
SECURITY_GROUP="sg-09e3a335a51b7ab14"  # Security group ID
TASK_ROLE_ARN="arn:aws:iam::${AWS_ACCOUNT_ID}:role/ecsTaskExecutionRole"  # Assuming ECS execution role exists

# Create ECS Cluster
# echo "Creating ECS Cluster..."
# aws ecs create-cluster --cluster-name $CLUSTER_NAME --region $AWS_REGION

# Create ECS Task Definition (Fargate)
echo "Creating ECS Task Definition..."
TASK_DEFINITION=$(cat <<EOF
{
  "family": "$TASK_DEFINITION_NAME",
  "executionRoleArn": "$TASK_ROLE_ARN",
  "networkMode": "awsvpc",
  "containerDefinitions": [
    {
      "name": "documenso-container",
      "image": "$ECR_URL:$IMAGE_TAG",
      "memory": 512,
      "cpu": 256,
      "essential": true,
      "portMappings": [
        {
          "containerPort": 433,
          "hostPort": 433,
          "protocol": "tcp"
        }
      ]
    }
  ],
  "requiresCompatibilities": [
    "FARGATE"
  ],
  "cpu": "256",
  "memory": "512"
}
EOF
)

# Register the task definition
echo "$TASK_DEFINITION" > task-definition.json
aws ecs register-task-definition --cli-input-json file://task-definition.json --region $AWS_REGION

# Create ECS Service
echo "Creating ECS Service..."
aws ecs create-service \
  --cluster $CLUSTER_NAME \
  --service-name $SERVICE_NAME \
  --task-definition $TASK_DEFINITION_NAME \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[$SUBNETS],securityGroups=[$SECURITY_GROUP],assignPublicIp=ENABLED}" \
  --region $AWS_REGION

echo "ECS Cluster, Task Definition, and Service have been created successfully!"



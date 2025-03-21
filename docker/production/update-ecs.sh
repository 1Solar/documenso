#!/bin/bash

# Configuration Variables
AWS_REGION="us-west-2"
CLUSTER_NAME="documenso-cluster"  # Your ECS Cluster Name
SERVICE_NAME="documenso-service"  # Your ECS Service Name
TASK_DEFINITION_NAME="documenso-task"  # Task Definition Name
CONTAINER_NAME="documenso-container"  # Container Name in Task Definition
IMAGE_URI="954974238236.dkr.ecr.us-west-2.amazonaws.com/documenso:latest"  # ECR Docker Image URI
DESIRED_COUNT=1  # Number of desired containers in the ECS service

# Ensure AWS CLI is configured
aws configure set region $AWS_REGION

# Authenticate Docker to AWS ECR (if the image is in ECR)
echo "Authenticating Docker to ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $IMAGE_URI

# Step 1: Register a new ECS Task Definition (updated task definition)
echo "Registering a new ECS task definition..."
cat > ecs-task-definition.json <<EOF
{
  "family": "$TASK_DEFINITION_NAME",
  "networkMode": "awsvpc",
  "containerDefinitions": [
    {
      "name": "$CONTAINER_NAME",
      "image": "$IMAGE_URI",
      "memory": 512,
      "cpu": 256,
      "essential": true,
      "portMappings": [
        {
          "containerPort": 3000,
          "hostPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        { "name": "NEXTAUTH_SECRET", "value": "\${NEXTAUTH_SECRET}" },
        { "name": "NEXT_PRIVATE_ENCRYPTION_KEY", "value": "\${NEXT_PRIVATE_ENCRYPTION_KEY}" },
        { "name": "NEXT_PUBLIC_WEBAPP_URL", "value": "\${NEXT_PUBLIC_WEBAPP_URL}" }
      ]
    }
  ],
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::954974238236:role/ecsTaskExecutionRole",  # Change this to your execution role ARN
  "taskRoleArn": "arn:aws:iam::954974238236:role/ecsTaskRole"  # Change this to your task role ARN
}
EOF

# Register the new task definition
aws ecs register-task-definition --cli-input-json file://ecs-task-definition.json

# Step 2: Update the ECS service with the new task definition
echo "Updating ECS service with the new task definition..."
aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_NAME --task-definition $TASK_DEFINITION_NAME --desired-count $DESIRED_COUNT

# Step 3: Verify ECS service status after update
echo "Verifying ECS service status..."
aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME

echo "ECS Update Completed!"


#!/bin/bash

# Set variables
AWS_REGION="us-west-2"  # Change to your AWS region
ECR_REPO_NAME="documenso"
GIT_COMMIT_HASH=$(git rev-parse --short HEAD)  # Get the short Git commit hash
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)

# ECR URL (Repository URL)
ECR_URL="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}"

# Log into AWS ECR
echo "Logging in to AWS ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URL

# Check if the ECR repository exists, if not, create it
if ! aws ecr describe-repositories --repository-names $ECR_REPO_NAME --region $AWS_REGION >/dev/null 2>&1; then
    echo "ECR repository does not exist. Creating repository..."
    aws ecr create-repository --repository-name $ECR_REPO_NAME --region $AWS_REGION
else
    echo "ECR repository exists."
fi

# Build the Docker image
echo "Building Docker image..."
docker-compose build

# Tag the Docker image with the ECR repository URL using the Git commit hash
IMAGE_TAG=$GIT_COMMIT_HASH
echo "Tagging Docker image with ECR URL and commit hash: $IMAGE_TAG"
docker tag documenso/documenso:latest $ECR_URL:$IMAGE_TAG

# Push the Docker image to ECR
echo "Pushing Docker image to ECR..."
docker push $ECR_URL:$IMAGE_TAG

# Update the .env file with the new image URL
echo "Updating .env with new image URL..."
sed -i "s|IMAGE_NAME=.*|IMAGE_NAME=$ECR_URL:$IMAGE_TAG|" .env

# Deploy with docker-compose
echo "Deploying application using docker-compose..."
docker-compose --env-file ./.env up -d

echo "Deployment complete!"

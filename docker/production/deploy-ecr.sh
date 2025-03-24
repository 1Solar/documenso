#!/bin/bash

# Set variables
AWS_REGION="us-west-2"
ECR_REPO_NAME="documenso"
GIT_COMMIT_HASH=$(git rev-parse --short HEAD)
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)
ECR_URL="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}"

# Log into AWS ECR
echo "Logging in to AWS ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URL

# Check if the ECR repository exists, if not, create it
if ! aws ecr describe-repositories --repository-names $ECR_REPO_NAME --region $AWS_REGION >/dev/null 2>&1; then
    echo "Creating ECR repository..."
    aws ecr create-repository --repository-name $ECR_REPO_NAME --region $AWS_REGION
else
    echo "ECR repository exists."
fi

# Build the Docker image (forcing no-cache)
echo "Building Docker image..."
docker-compose build --no-cache

# Verify the image was built
if [[ -z "$(docker images -q documenso/documenso:latest)" ]]; then
  echo "Error: Image was not built correctly!"
  exit 1
fi

# Tag the image
IMAGE_TAG=$GIT_COMMIT_HASH
echo "Tagging Docker image: $IMAGE_TAG"
docker tag documenso/documenso:latest $ECR_URL:$IMAGE_TAG

# Push the image
echo "Pushing Docker image to ECR..."
docker push $ECR_URL:$IMAGE_TAG

# Verify the push was successful
if [[ $? -ne 0 ]]; then
  echo "Error: Docker push failed!"
  exit 1
fi

# Update the .env file
echo "Updating .env with new image URL..."
sed -i "s|IMAGE_NAME=.*|IMAGE_NAME=$ECR_URL:$IMAGE_TAG|" .env || sed -i '' "s|IMAGE_NAME=.*|IMAGE_NAME=$ECR_URL:$IMAGE_TAG|" .env

# Verify the update
cat .env | grep IMAGE_NAME

# Deploy the app
echo "Deploying application using docker-compose..."
docker-compose --env-file ./.env up -d --force-recreate

echo "Deployment complete!"


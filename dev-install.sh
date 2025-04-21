#!/bin/bash

set -e

# Load .env file
if [ ! -f ".env" ]; then
  echo ".env file not found. Exiting."
  exit 1
fi

helm repo add jetstack https://charts.jetstack.io
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
if [ -f "./chart/Chart.lock" ]; then
  yq --indent 0 '.dependencies | map(["helm", "repo", "add", .name, .repository] | join(" ")) | .[]' "./chart/Chart.lock"  | sh --;
fi

helm repo update


# Check if ingress-nginx namespace exists
if ! kubectl get namespace ingress-nginx >/dev/null 2>&1; then
  echo "Namespace 'ingress-nginx' not found. Installing ingress-nginx..."
  helm install ingress-nginx ingress-nginx/ingress-nginx \
    --namespace ingress-nginx \
    --create-namespace
else
  echo "Namespace 'ingress-nginx' already exists. Skipping installation."
fi


telepresence helm install || true

export $(grep -v '^#' .env | xargs)

# Replace ${VAR_NAME} with values from environment
envsubst < chart/values-local.yaml > values-temp.yaml

echo "Generated values-temp.yaml with substituted environment variables."

helm upgrade --install -n agenticxp-local --create-namespace --atomic --values ./values-temp.yaml agenticxp ./chart


rm -rf ./values-temp.yaml
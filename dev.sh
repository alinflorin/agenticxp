#!/bin/bash
set -e
if [ ! -f ".env" ]; then
  echo ".env file not found. Exiting."
  exit 1
fi
export $(grep -v '^#' .env | xargs)
envsubst < chart/values-local.yaml > values-temp.yaml
echo "Generated values-temp.yaml with substituted environment variables."
echo "Building chart..."
if [ -f "./chart/Chart.lock" ]; then
  yq --indent 0 '.dependencies | map(["helm", "repo", "add", .name, .repository] | join(" ")) | .[]' "./chart/Chart.lock"  | sh --;
fi
echo "Installing Helm chart..."
helm upgrade --install agenticxp-local ./chart -f values-temp.yaml -n agenticxp-local --create-namespace --dry-run --debug
rm -rf ./values-temp.yaml
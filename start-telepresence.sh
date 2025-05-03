#!/bin/bash

set -e

telepresence connect --namespace agenticxp-stg || true
telepresence replace agenticxp --container agenticxp --port 5173:http --env-file .env.local --to-pod 8181 || true
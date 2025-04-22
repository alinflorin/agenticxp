#!/bin/bash

set -e

telepresence connect --namespace agenticxp-local || true
telepresence replace agenticxp --port 5173:http --env-file .env.local || true
#!/bin/bash

set -e

telepresence connect --namespace agenticxp-local || true
telepresence intercept agenticxp --port 5173:http --env-file .env.local || true
npm run dev
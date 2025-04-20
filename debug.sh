#!/bin/bash

set -e

telepresence connect --namespace agenticxp-local
telepresence intercept agenticxp --port 5173:http --env-file .env.telepresence
npm run dev
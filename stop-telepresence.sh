#!/bin/bash

set -e
telepresence leave agenticxp || true
telepresence quit -s
rm -rf .env.local
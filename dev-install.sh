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

# Check if cert-manager namespace exists
if ! kubectl get namespace cert-manager >/dev/null 2>&1; then
  echo "Namespace 'cert-manager' not found. Installing cert-manager..."
  helm install cert-manager jetstack/cert-manager \
    --namespace cert-manager \
    --create-namespace \
    --set crds.enabled=true


else
  echo "Namespace 'cert-manager' already exists. Skipping installation."
fi

kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: self-signed-issuer
spec:
  selfSigned: {}
EOF

kubectl apply -n cert-manager -f - <<EOF
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: my-root-ca
  namespace: cert-manager
spec:
  isCA: true
  commonName: my-root-ca
  secretName: my-root-ca
  privateKey:
    algorithm: ECDSA
    size: 256
  issuerRef:
    name: self-signed-issuer
    kind: ClusterIssuer
    group: cert-manager.io
EOF

kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: my-root-ca-issuer
spec:
  ca:
    secretName: my-root-ca
EOF


telepresence helm install || true

export $(grep -v '^#' .env | xargs)

# Replace ${VAR_NAME} with values from environment
envsubst < chart/values-local.yaml > values-temp.yaml

echo "Generated values-temp.yaml with substituted environment variables."

helm upgrade --install -n agenticxp-local --create-namespace --atomic --values ./values-temp.yaml agenticxp ./chart


rm -rf ./values-temp.yaml
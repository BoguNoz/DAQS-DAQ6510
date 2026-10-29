#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env"
K8S_DIR="$ROOT_DIR/k8s"

for command in docker minikube kubectl python3; do
    if ! command -v "$command" >/dev/null 2>&1; then
        printf 'Required command not found: %s\n' "$command" >&2
        exit 1
    fi
done

if [[ ! -f "$ENV_FILE" ]]; then
    printf 'Missing %s. Create it from .env.example and set database credentials.\n' "$ENV_FILE" >&2
    exit 1
fi

docker info >/dev/null

minikube start --driver=docker
minikube addons enable ingress
kubectl rollout status deployment/ingress-nginx-controller \
    --namespace ingress-nginx \
    --timeout=180s

kubectl apply -f "$K8S_DIR/namespace.yaml"
python3 - "$ENV_FILE" <<'PY' | kubectl apply -f -
import base64
import sys
from pathlib import Path

required = {"DB_ROOT_PASSWORD", "DB_NAME", "DB_USER", "DB_PASSWORD"}
values = {}
for line in Path(sys.argv[1]).read_text().splitlines():
    line = line.strip()
    if not line or line.startswith("#") or "=" not in line:
        continue
    key, value = line.split("=", 1)
    values[key.strip()] = value.strip().strip("\"'")

missing = sorted(key for key in required if not values.get(key))
placeholders = sorted(
    key for key in required if values.get(key, "").lower() in {"zmien_mnie", "change_me", "changeme"}
)
if missing or placeholders:
    if missing:
        print(f"Missing required .env keys: {', '.join(missing)}", file=sys.stderr)
    if placeholders:
        print(f"Replace placeholder values for: {', '.join(placeholders)}", file=sys.stderr)
    sys.exit(1)

print("apiVersion: v1")
print("kind: Secret")
print("metadata:")
print("  name: daqs-db-secret")
print("  namespace: daqs")
print("type: Opaque")
print("data:")
for key in sorted(required):
    encoded = base64.b64encode(values[key].encode()).decode()
    print(f"  {key}: {encoded}")
PY

kubectl apply -f "$K8S_DIR/mysql.yaml"
kubectl rollout status statefulset/mysql --namespace daqs --timeout=300s

kubectl apply -f "$K8S_DIR/backend.yaml"
kubectl apply -f "$K8S_DIR/frontend.yaml"
kubectl apply -f "$K8S_DIR/ingress.yaml"

# Restart even when the image tag is unchanged so :latest is pulled after a GHCR update.
kubectl rollout restart deployment/backend deployment/frontend --namespace daqs
kubectl rollout status deployment/backend --namespace daqs --timeout=300s
kubectl rollout status deployment/frontend --namespace daqs --timeout=300s

kubectl get pods,services,ingress --namespace daqs -o wide

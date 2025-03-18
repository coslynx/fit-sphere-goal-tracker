#!/bin/bash
set -euo pipefail
log_info() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') - INFO: $1"
}
log_error() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') - ERROR: $1" >&2
}
cleanup() {
  log_info "Performing cleanup..."
  rm -f "$PID_FILE"
  exit "$1"
}
trap 'log_error "Script failed at line $LINENO"; cleanup 1' ERR
trap 'cleanup 0' EXIT SIGINT SIGTERM
NODE_VERSION_REQUIRED="16.0.0"
PROJECT_ROOT=$(pwd)
PID_FILE="$PROJECT_ROOT/app.pid"
if [ ! -x "$(command -v node)" ]; then
  log_error "Node.js is not installed."
  exit 1
fi
NODE_VERSION=$($(command -v node) -v | sed 's/[v]//g')
if [[ $(printf '%s\n' "$NODE_VERSION_REQUIRED" "$NODE_VERSION" | sort -V | head -n1) != "$NODE_VERSION_REQUIRED" ]]; then
  log_error "Node.js version >= $NODE_VERSION_REQUIRED is required. Found $NODE_VERSION"
  exit 1
fi
log_info "Checking for .env file..."
if [ -f "$PROJECT_ROOT/.env" ]; then
  log_info "Sourcing .env file..."
  while IFS='' read -r line || [[ -n "$line" ]]; do
    if [[ "$line" =~ ^[a-zA-Z_]+[a-zA-Z0-9_]*= ]]; then
      key="${line%=*}"
      value="${line#*=}"
      export "$key=$(echo "$value" | sed 's/[^a-zA-Z0-9_]/ /g')"
    fi
  done < "$PROJECT_ROOT/.env"
else
  log_info ".env file not found, using default configurations."
fi
if [ ! -x "$(command -v npm)" ]; then
  log_error "npm is not installed. Please install it to proceed."
  exit 1
fi
log_info "Installing dependencies..."
cd "$PROJECT_ROOT"
npm install
log_info "Starting the application..."
npm start
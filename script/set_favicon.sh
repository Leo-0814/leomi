#!/bin/bash

# Get the directory where the script is located
# Use a more compatible method for getting script directory
if [ -n "${BASH_SOURCE[0]}" ]; then
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
else
  SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
fi
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# 檢查 .env 文件是否存在
ENV_FILE="$PROJECT_ROOT/.env"
if [ ! -f "$ENV_FILE" ]; then
  echo "Error: .env file not found at $ENV_FILE"
  echo "Current directory: $(pwd)"
  echo "Project root: $PROJECT_ROOT"
  exit 1
fi

# 只讀取 VITE_APP_PRODUCTION_NAME_DEV 這一行，去除空格和雙引號
VITE_APP_PRODUCTION_NAME_DEV=$(grep '^VITE_APP_PRODUCTION_NAME_DEV' "$ENV_FILE" | sed -E 's/VITE_APP_PRODUCTION_NAME_DEV[[:space:]]*=[[:space:]]*"?([^"]*)"?/\1/')

# 檢查變量是否有值
if [ -z "$VITE_APP_PRODUCTION_NAME_DEV" ]; then
  echo "Error: VITE_APP_PRODUCTION_NAME_DEV is not set in .env"
  echo "Contents of .env file:"
  cat "$ENV_FILE" || echo "Could not read .env file"
  exit 1
fi

# Define source and destination
SRC_DIR="$PROJECT_ROOT/public/images/$VITE_APP_PRODUCTION_NAME_DEV/logo"
DEST_DIR="$PROJECT_ROOT/public"
SRC_FILE="$SRC_DIR/favicon.ico"
DEST_FILE="$DEST_DIR/favicon.ico"

echo "Using VITE_APP_PRODUCTION_NAME_DEV: $VITE_APP_PRODUCTION_NAME_DEV"
echo "Project root: $PROJECT_ROOT"
echo "Source directory: $SRC_DIR"
echo "Destination directory: $DEST_DIR"
echo "Current working directory: $(pwd)"

# Debug: List public/images directory
if [ -d "$PROJECT_ROOT/public/images" ]; then
  echo "Contents of public/images:"
  ls -la "$PROJECT_ROOT/public/images" || true
  if [ -d "$PROJECT_ROOT/public/images/$VITE_APP_PRODUCTION_NAME_DEV" ]; then
    echo "Contents of public/images/$VITE_APP_PRODUCTION_NAME_DEV:"
    ls -la "$PROJECT_ROOT/public/images/$VITE_APP_PRODUCTION_NAME_DEV" || true
  else
    echo "Warning: public/images/$VITE_APP_PRODUCTION_NAME_DEV does not exist"
    echo "Available directories in public/images:"
    ls -d "$PROJECT_ROOT/public/images"/*/ 2>/dev/null | xargs -n1 basename || true
  fi
else
  echo "Error: public/images directory does not exist at $PROJECT_ROOT/public/images"
  exit 1
fi

# Check if source directory exists
if [ ! -d "$SRC_DIR" ]; then
  echo "Error: Source directory does not exist: $SRC_DIR"
  echo "Please ensure the directory structure is correct:"
  echo "  public/images/$VITE_APP_PRODUCTION_NAME_DEV/logo/favicon.ico"
  exit 1
fi

# Check if source favicon.ico exists
if [ ! -f "$SRC_FILE" ]; then
  echo "Error: favicon.ico not found at: $SRC_FILE"
  exit 1
fi

# Copy favicon.ico to destination
echo "Copying favicon.ico from $SRC_FILE to $DEST_FILE..."
if cp "$SRC_FILE" "$DEST_FILE"; then
  echo "Success: favicon.ico has been copied to $DEST_FILE"
else
  echo "Error: Failed to copy favicon.ico"
  exit 1
fi
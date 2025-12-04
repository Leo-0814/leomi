#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# 只讀取 VITE_APP_PRODUCTION_NAME_DEV 這一行，去除空格和雙引號
VITE_APP_PRODUCTION_NAME_DEV=$(grep '^VITE_APP_PRODUCTION_NAME_DEV' "$PROJECT_ROOT/.env" | sed -E 's/VITE_APP_PRODUCTION_NAME_DEV[[:space:]]*=[[:space:]]*"?([^"]*)"?/\1/')

# 檢查變量是否有值
if [ -z "$VITE_APP_PRODUCTION_NAME_DEV" ]; then
  echo "VITE_APP_PRODUCTION_NAME_DEV is not set in .env"
  exit 1
fi

# Define source and destination
SRC_DIR="$PROJECT_ROOT/public/images/$VITE_APP_PRODUCTION_NAME_DEV/logo"
DEST_DIR="$PROJECT_ROOT/public"
SRC_FILE="$SRC_DIR/favicon.ico"
DEST_FILE="$DEST_DIR/favicon.ico"

echo "Using VITE_APP_PRODUCTION_NAME_DEV: $VITE_APP_PRODUCTION_NAME_DEV"
echo "Source directory: $SRC_DIR"
echo "Destination directory: $DEST_DIR"

# Check if source directory exists
if [ ! -d "$SRC_DIR" ]; then
  echo "Error: Source directory does not exist: $SRC_DIR"
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
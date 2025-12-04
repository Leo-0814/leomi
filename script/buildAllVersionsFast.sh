#!/bin/bash

# 快速構建所有版本
VERSIONS=("vincetrust")
ENV=${1:-"prod"}

echo "🚀 快速構建所有版本 (環境: $ENV)"

# 創建 builds 主目錄
mkdir -p builds

# 更新版本配置
node fetchConfig.js all

for version in "${VERSIONS[@]}"; do
    echo "🔨 $version..."
    
    # 為每個版本創建對應的資料夾
    VERSION_DIR="builds/$version"
    mkdir -p $VERSION_DIR
    
    node setVersion.js $version $ENV
    sh ./script/set_favicon.sh
    yarn build $version $ENV && cp -r build/* $VERSION_DIR/ && echo "✅ $version 完成" || echo "❌ $version 失敗"
done

echo "🎉 完成! 文件在 builds/ 目錄" 
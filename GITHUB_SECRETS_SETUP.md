# GitHub Secrets 设置指南

为了在 GitHub Actions 中使用 Google Sheets API，需要设置 GitHub Secrets。

## 📋 步骤 1: 获取 Google Sheets 凭证文件

1. **找到你的凭证文件**
   - 本地路径通常是：`~/.google-sheets/credentials.json`
   - 或者在你的项目目录中查找

2. **打开凭证文件**
   - 这是一个 JSON 格式的文件
   - 包含 Google Service Account 的认证信息

## 🔐 步骤 2: 在 GitHub 仓库中设置 Secret

1. **进入仓库设置**
   - 打开你的 GitHub 仓库
   - 点击 **Settings**（设置）

2. **找到 Secrets 设置**
   - 在左侧菜单中找到 **Secrets and variables** → **Actions**
   - 或者直接访问：`https://github.com/<用户名>/<仓库名>/settings/secrets/actions`

3. **添加新的 Secret**
   - 点击 **New repository secret**（新建仓库密钥）
   - **Name**（名称）输入：`GOOGLE_SHEETS_CREDENTIALS`
   - **Secret**（密钥）输入：你的 `credentials.json` 文件的**完整内容**（复制整个 JSON）

4. **保存**
   - 点击 **Add secret**（添加密钥）

## 📝 示例

### Secret 名称
```
GOOGLE_SHEETS_CREDENTIALS
```

### Secret 内容（示例格式）
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

## ⚠️ 重要提示

1. **完整复制 JSON**
   - 必须复制整个 JSON 文件的内容
   - 包括所有的大括号、引号、换行符等
   - 不要修改任何内容

2. **安全性**
   - GitHub Secrets 是加密存储的
   - 只有仓库管理员可以查看和修改
   - 不要在代码中硬编码凭证信息

3. **验证设置**
   - 设置完成后，推送代码触发 GitHub Actions
   - 检查构建日志中的 "Setup Google Sheets credentials" 步骤
   - 应该显示 "✅ Google Sheets credentials file created"

## 🔍 如何验证凭证文件格式

在本地运行以下命令检查凭证文件：

```bash
# 检查文件是否存在
ls -la ~/.google-sheets/credentials.json

# 查看文件内容（注意：不要分享给他人）
cat ~/.google-sheets/credentials.json

# 验证 JSON 格式
cat ~/.google-sheets/credentials.json | jq .
```

## 🐛 故障排除

### 问题：构建时仍然报错找不到凭证文件

**解决方案：**
1. 确认 Secret 名称是 `GOOGLE_SHEETS_CREDENTIALS`（完全一致，区分大小写）
2. 确认 JSON 内容完整且格式正确
3. 检查构建日志中的 "Setup Google Sheets credentials" 步骤是否有错误

### 问题：凭证文件格式错误

**解决方案：**
1. 确保复制的是完整的 JSON 内容
2. 使用 JSON 验证工具检查格式
3. 确保没有额外的空格或换行符

### 问题：权限不足

**解决方案：**
1. 确认 Google Service Account 有访问 Google Sheets 的权限
2. 确认 Service Account 的邮箱已添加到 Google Sheets 的共享列表中

## 📚 相关资源

- [GitHub Secrets 文档](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Google Service Account 文档](https://cloud.google.com/iam/docs/service-accounts)


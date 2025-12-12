# 🚀 GitHub Pages 部署检查清单

## ✅ 部署前检查

- [ ] 代码已推送到 GitHub 仓库
- [ ] 仓库是公开的（Public）或使用付费账户
- [ ] 已创建 `.github/workflows/deploy.yml` 文件
- [ ] `package.json` 中有 `build` 脚本

## 🔧 GitHub 设置

### 1. 启用 GitHub Pages
- [ ] 进入仓库 Settings → Pages
- [ ] Source 选择 **"GitHub Actions"**（不是 "Deploy from a branch"）
- [ ] 保存设置

### 2. 验证 Workflow 文件
- [ ] 确认 `.github/workflows/deploy.yml` 存在
- [ ] 文件内容正确（可以参考项目中的文件）

## 🎯 触发部署

### 方式 1: 自动触发（推荐）
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 方式 2: 手动触发
1. 进入仓库的 **Actions** 标签页
2. 选择 "Deploy to GitHub Pages" workflow
3. 点击 **"Run workflow"** 按钮

## 📊 监控部署

- [ ] 在 **Actions** 标签页查看部署进度
- [ ] 等待所有步骤显示 ✅（通常 2-5 分钟）
- [ ] 检查是否有错误（红色 ❌）

## 🌐 验证部署

- [ ] 访问 `https://<用户名>.github.io/<仓库名>/`
- [ ] 确认首页可以正常加载
- [ ] 测试路由是否正常工作（如 `/charge-list`）
- [ ] 检查所有页面功能是否正常

## 🔄 后续更新

每次推送代码到 `main` 或 `master` 分支时，会自动触发新的部署：

```bash
git add .
git commit -m "Update features"
git push origin main
```

## ❓ 常见问题

### Q: 部署失败怎么办？
A: 检查 Actions 日志，常见原因：
- 构建错误（检查代码）
- 依赖安装失败（检查 package.json）
- 权限问题（检查仓库设置）

### Q: 网站无法访问？
A: 可能原因：
- GitHub Pages 未启用（检查 Settings → Pages）
- 等待 DNS 生效（首次部署需要几分钟）
- URL 错误（检查大小写）

### Q: 如何查看部署历史？
A: 在 **Actions** 标签页可以看到所有部署记录

## 📝 部署 URL 格式

- **项目仓库**: `https://<用户名>.github.io/<仓库名>/`
- **用户主页**: `https://<用户名>.github.io/`（需要仓库名为 `用户名.github.io`）

---

💡 **提示**: 首次部署后，GitHub 会发送邮件通知部署状态。



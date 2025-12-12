# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## GitHub Pages 部署与 CI/CD 设置

项目已配置好 GitHub Pages 自动部署和 CI/CD 流程。以下是完整的设置步骤：

### 📋 前置要求

- 已创建 GitHub 仓库
- 代码已推送到 GitHub
- 仓库有 `main` 或 `master` 分支

### 🚀 步骤 1: 启用 GitHub Pages

1. **打开仓库设置**
   - 进入你的 GitHub 仓库
   - 点击右上角的 **Settings**（设置）

2. **配置 Pages**
   - 在左侧菜单中找到 **Pages**（页面）
   - 在 **Source**（源）部分，选择 **GitHub Actions**
   - 不要选择 "Deploy from a branch"
   - 保存设置（如果看到提示，点击确认）

3. **验证配置**
   - 设置完成后，你会看到 "Your site is ready to be published" 或类似的提示
   - 此时 CI/CD 已经启用

### 🔄 步骤 2: 推送代码触发 CI/CD

将代码推送到 `main` 或 `master` 分支，GitHub Actions 会自动触发构建和部署：

```bash
# 添加所有更改
git add .

# 提交更改
git commit -m "Configure GitHub Pages deployment"

# 推送到 GitHub（会自动触发 CI/CD）
git push origin main
```

### 👀 步骤 3: 查看 CI/CD 状态

1. **查看 Actions**
   - 在仓库顶部点击 **Actions** 标签页
   - 你会看到 "Deploy to GitHub Pages" workflow 正在运行
   - 点击进入可以查看详细的构建日志

2. **部署流程**
   - ✅ **Checkout**: 检出代码
   - ✅ **Setup Node.js**: 设置 Node.js 环境
   - ✅ **Install dependencies**: 安装依赖
   - ✅ **Build**: 构建项目
   - ✅ **Setup Pages**: 配置 Pages
   - ✅ **Upload artifact**: 上传构建产物
   - ✅ **Deploy**: 部署到 GitHub Pages

3. **等待部署完成**
   - 通常需要 2-5 分钟
   - 部署完成后会显示绿色 ✅ 标记

### 🌐 步骤 4: 访问网站

部署完成后，你的网站可以通过以下 URL 访问：

- **项目仓库**: `https://<你的用户名>.github.io/<仓库名>/`
- **示例**: 如果仓库名是 `leomi`，URL 是 `https://username.github.io/leomi/`

> 💡 **提示**: 首次部署可能需要几分钟才能生效，如果无法访问请稍等片刻。

### 🔧 CI/CD 配置说明

#### 自动触发条件

CI/CD 会在以下情况自动触发：

- ✅ 推送到 `main` 分支
- ✅ 推送到 `master` 分支
- ✅ 手动触发（在 Actions 页面点击 "Run workflow"）

#### Workflow 文件位置

配置文件位于：`.github/workflows/deploy.yml`

#### 自定义配置

如果需要修改构建配置，可以编辑 `.github/workflows/deploy.yml`：

```yaml
# 修改 Node.js 版本
node-version: "20"  # 改为你需要的版本

# 修改构建命令
run: yarn build  # 改为你的构建命令

# 添加环境变量
env:
  VITE_APP_ENV: production
  VITE_BASE_PATH: /  # 自定义 base 路径
```

### 🎯 自定义域名（可选）

如果使用自定义域名：

1. **在 GitHub 设置域名**
   - Settings → Pages → Custom domain
   - 输入你的域名

2. **设置环境变量**
   - 在 workflow 文件中添加：
   ```yaml
   env:
     VITE_BASE_PATH: /
   ```

3. **配置 DNS**
   - 按照 GitHub 的提示配置 DNS 记录

### ⚠️ 注意事项

- ✅ 确保仓库是 **公开的**（Public），或者使用 GitHub Pro/Team 账户
- ✅ 首次部署后，GitHub Pages URL 可能需要几分钟才能访问
- ✅ 如果仓库名是 `username.github.io`，base 路径会自动设置为 `/`
- ✅ 否则 base 路径会自动设置为 `/repository-name/`
- ✅ 所有路由都会正常工作，包括直接访问 `/charge-list`、`/settings` 等

### 🐛 故障排除

**问题**: Actions 显示失败
- 检查构建日志中的错误信息
- 确保 `package.json` 中的脚本正确
- 检查 Node.js 版本是否兼容

**问题**: 网站无法访问
- 确认 GitHub Pages 已启用（Settings → Pages）
- 等待几分钟让 DNS 生效
- 检查 URL 是否正确（注意大小写）

**问题**: 路由不工作
- 确认 `404.html` 文件已创建（workflow 会自动处理）
- 检查 `vite.config.ts` 中的 base 路径配置

### 📚 相关资源

- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

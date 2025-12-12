# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## GitHub Pages 部署

项目已配置好 GitHub Pages 自动部署。部署步骤如下：

### 1. 启用 GitHub Pages

1. 前往 GitHub 仓库的 Settings
2. 在左侧菜单找到 "Pages"
3. 在 "Source" 部分，选择 "GitHub Actions"
4. 保存设置

### 2. 推送代码

将代码推送到 `main` 或 `master` 分支，GitHub Actions 会自动构建并部署：

```bash
git push origin main
```

### 3. 查看部署状态

- 在仓库的 "Actions" 标签页查看部署进度
- 部署完成后，访问 `https://<username>.github.io/<repository-name>/`
- 首页会自动重定向到 `/charge-list`

### 4. 自定义域名（可选）

如果使用自定义域名，需要在 `vite.config.ts` 中设置 `VITE_BASE_PATH` 环境变量为 `/`，或在构建时设置：

```bash
VITE_BASE_PATH=/ yarn build
```

### 注意事项

- 确保仓库名称与 GitHub Pages URL 匹配
- 如果仓库名是 `username.github.io`，base 路径会自动设置为 `/`
- 否则 base 路径会自动设置为 `/repository-name/`

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
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
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
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

/**
 * Vite 配置文件
 *
 * 文件優先級解析功能：
 * 根據 VITE_APP_BASE_PROJECT 環境變數，實現文件優先級解析。
 *
 * 例如：如果 BASE_PROJECT 包含 "vincetrust"，則：
 * - import App from './App' 會優先查找 App.vincetrust.tsx
 * - 如果不存在，則回退到默認的 App.tsx
 *
 * 文件名格式：{filename}.{project}.{extension}
 * 例如：App.vincetrust.tsx, index.vincetrust.ts 等
 */

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig, type Plugin } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 讀取環境變數並解析 BASE_PROJECT
function getBaseProjects(): string[] {
  const envPath = path.join(__dirname, ".env");

  if (!fs.existsSync(envPath)) {
    return [];
  }

  const envContent = fs.readFileSync(envPath, "utf-8");
  const baseProjectMatch = envContent.match(
    /^VITE_APP_BASE_PROJECT\s*=\s*"(.+)"\s*$/m
  );

  if (!baseProjectMatch) {
    return [];
  }

  // BASE_PROJECT 格式類似: ".vincetrust.tsx,.vincetrust.ts,.vincetrust.jsx,..."
  // 提取項目名稱（第一個點後到第一個點的內容）
  const extensions = baseProjectMatch[1].split(",");
  const projects = new Set<string>();

  extensions.forEach((ext) => {
    // 匹配格式: .{projectName}.{extension}
    // 例如: .vincetrust.tsx
    const match = ext.match(/^\.([^.]+)\./);
    if (match && match[1]) {
      projects.add(match[1]);
    }
  });

  return Array.from(projects);
}

// 創建文件優先級解析插件
function createFilePriorityPlugin(): Plugin {
  return {
    name: "file-priority-resolver",
    enforce: "pre",

    async resolveId(source, importer) {
      // 只處理相對路徑導入
      if (!source.startsWith(".") || !importer) {
        return null;
      }

      const baseProjects = getBaseProjects();
      if (baseProjects.length === 0) {
        return null;
      }

      const importerDir = path.dirname(importer);
      const sourcePath = path.resolve(importerDir, source);

      // 支持的擴展名（按優先級排序）
      const extensions = [
        ".tsx",
        ".ts",
        ".jsx",
        ".js",
        ".json",
        ".css",
        ".scss",
        ".module.scss",
      ];

      // 檢查是否為目錄，如果是則按照優先級順序查找 index 文件
      try {
        const stat = fs.statSync(sourcePath);
        if (stat.isDirectory()) {
          // 目錄導入：按照優先級順序查找 index 文件
          // 優先級順序：
          // 1. 帶項目前綴的 index 文件（index.{project}.{ext}），按擴展名優先級
          // 2. 普通的 index 文件（index.{ext}），按擴展名優先級

          // 1. 先查找帶項目前綴的 index 文件
          for (const project of baseProjects) {
            for (const ext of extensions) {
              const indexFile = path.join(sourcePath, `index.${project}${ext}`);
              if (fs.existsSync(indexFile)) {
                return indexFile;
              }
            }
          }

          // 2. 再查找普通的 index 文件
          for (const ext of extensions) {
            const indexFile = path.join(sourcePath, `index${ext}`);
            if (fs.existsSync(indexFile)) {
              return indexFile;
            }
          }

          // 如果都沒找到，返回 null 讓 Vite 使用默認解析
          return null;
        }
      } catch {
        // 如果路徑不存在，繼續後續邏輯
      }

      // 檢查是否已經包含擴展名
      const hasExtension = extensions.some((ext) => sourcePath.endsWith(ext));

      if (hasExtension) {
        // 如果已經有擴展名，提取基礎路徑和擴展名
        // 例如: ./App.tsx -> ./App 和 .tsx
        let basePath = sourcePath;
        let originalExt = "";
        for (const ext of extensions) {
          if (sourcePath.endsWith(ext)) {
            basePath = sourcePath.slice(0, -ext.length);
            originalExt = ext;
            break;
          }
        }

        // 嘗試查找帶項目前綴的文件
        // 例如: App.tsx -> App.vincetrust.tsx
        for (const project of baseProjects) {
          const projectFile = basePath + `.${project}${originalExt}`;
          if (fs.existsSync(projectFile)) {
            return projectFile;
          }
        }
      } else {
        // 如果沒有擴展名，檢查是否為 index 文件（目錄索引）
        // 例如: ./pages/App/index -> ./pages/App/index.test.tsx
        const isIndexFile =
          sourcePath.endsWith("/index") ||
          sourcePath.endsWith(path.sep + "index");

        if (isIndexFile) {
          // 移除 /index 後綴，提取目錄路徑
          const dirPath = sourcePath.replace(/[/\\]index$/, "");
          for (const project of baseProjects) {
            for (const ext of extensions) {
              const indexFile = path.join(dirPath, `index.${project}${ext}`);
              if (fs.existsSync(indexFile)) {
                return indexFile;
              }
            }
          }
        }

        // 對於每個項目和擴展名組合嘗試解析
        // 例如: ./App -> ./App.vincetrust.tsx, ./App.vincetrust.ts, ...
        for (const project of baseProjects) {
          for (const ext of extensions) {
            const projectFile = sourcePath + `.${project}${ext}`;
            if (fs.existsSync(projectFile)) {
              return projectFile;
            }
          }
        }
      }

      // 如果沒有找到帶項目前綴的文件，返回 null 讓 Vite 使用默認解析
      return null;
    },
  };
}

// https://vite.dev/config/
// 如果是 GitHub Pages 部署，且仓库名不是 username.github.io，则需要设置 base 路径
// 例如：如果仓库是 username/leomi，则 base 为 "/leomi/"
// 如果仓库是 username/username.github.io，则 base 为 "/"
const getBasePath = () => {
  // 优先级 1: 环境变量 VITE_BASE_PATH
  if (process.env.VITE_BASE_PATH) {
    return process.env.VITE_BASE_PATH;
  }
  
  // 优先级 2: 从 package.json 的 homepage 字段读取
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"), "utf-8"));
    if (packageJson.homepage) {
      // 确保 homepage 以 / 结尾（Vite base 路径要求）
      const homepage = packageJson.homepage.startsWith("/") 
        ? packageJson.homepage 
        : `/${packageJson.homepage}`;
      return homepage.endsWith("/") ? homepage : `${homepage}/`;
    }
  } catch (error) {
    // 如果读取失败，继续使用其他方法
  }
  
  // 优先级 3: 环境变量 VITE_APP_HOMEPAGE
  if (process.env.VITE_APP_HOMEPAGE) {
    const homepage = process.env.VITE_APP_HOMEPAGE.startsWith("/") 
      ? process.env.VITE_APP_HOMEPAGE 
      : `/${process.env.VITE_APP_HOMEPAGE}`;
    return homepage.endsWith("/") ? homepage : `${homepage}/`;
  }
  
  // 优先级 4: 在 GitHub Actions 中，GITHUB_REPOSITORY 格式为 "username/repo-name"
  if (process.env.GITHUB_REPOSITORY) {
    const repoName = process.env.GITHUB_REPOSITORY.split("/")[1];
    // 如果仓库名是 username.github.io，说明是用户主页，base 为 "/"
    if (repoName.endsWith(".github.io")) {
      return "/";
    }
    // 否则，base 为 "/repo-name/"
    return `/${repoName}/`;
  }
  
  // 默认值：本地开发使用 "/"
  return "/";
};

export default defineConfig({
  base: getBasePath(),
  plugins: [
    react({
      babel: {
        plugins: [
          ["babel-plugin-react-compiler"],
          // ...(process.env.VITE_APP_ENV === "production"
          //   ? [["transform-remove-console", { include: ["error", "warn"] }]]
          //   : []),
        ],
      },
    }),
    createFilePriorityPlugin(),
    tailwindcss(),
  ],
  server: {
    allowedHosts: [""],
  },
});

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

      // 首先檢查是否是目錄或可能是目錄（提前查找 index.{project}.{ext}）
      // 這樣可以處理 Vite 在解析目錄導入時的情況
      for (const project of baseProjects) {
        for (const ext of extensions) {
          // 嘗試查找目錄下的 index.{project}.{ext} 文件
          // 例如: ./pages/App -> ./pages/App/index.test.tsx
          const indexFile = path.join(sourcePath, `index.${project}${ext}`);
          if (fs.existsSync(indexFile)) {
            return indexFile;
          }
        }
      }

      // 檢查是否為目錄
      try {
        const stat = fs.statSync(sourcePath);
        if (stat.isDirectory()) {
          // 如果確實是目錄但沒找到帶項目前綴的文件，返回 null 讓 Vite 使用默認解析
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
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    createFilePriorityPlugin(),
  ],
});

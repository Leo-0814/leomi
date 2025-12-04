declare module "*.scss";
declare module "*.css";
declare module "*.png";
declare module "*.svg";
declare module "*.jpeg";
declare module "*.jpg";

// 允許目錄 import
declare module "*/styleModule" {
  const styles: { [key: string]: string };
  export default styles;
}

// 允許目錄 import (自動解析到 index 文件，按優先級順序)
// 優先級：index.{project}.tsx > index.{project}.ts > index.{project}.jsx > index.{project}.js > index.{project}.css > index.{project}.scss
//         > index.tsx > index.ts > index.jsx > index.js > index.css > index.scss
//
// 注意：TypeScript 需要具體的路徑聲明，實際的目錄解析由 Vite 插件處理
// 這裡提供一個通用的類型聲明，適用於目錄導入
declare module "*/style" {
  const content: string;
  export default content;
}

// 如果需要導入其他目錄，可以添加類似的聲明，例如：
// declare module "*/components" { ... }
// 或者使用相對路徑的具體聲明

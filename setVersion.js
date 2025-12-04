import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 取得命令列參數
const platformName = process.argv[2] || "vincetrust";
const environment = process.argv[3] || "prod";

if (!platformName || !environment) {
  console.error("Usage: node setVersion.js <platform_name> <environment>");
  process.exit(1);
}

// 讀取 versionConfig.json
const configPath = path.join(__dirname, "versionConfig.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

// 檢查平台是否存在
if (!config[platformName]) {
  console.error(`Platform "${platformName}" not found in versionConfig.json`);
  process.exit(1);
}

const platformConfig = config[platformName];
const envVars = [];
const env = {
  dev: "development",
  stag: "staging",
  prod: "production",
};
// 添加 ENV 變數
envVars.push(`VITE_APP_ENV = "${env[environment]}"`);

// 處理每個配置項
for (const [key, value] of Object.entries(platformConfig)) {
  let finalValue;

  // 如果是物件，根據環境取得對應的值
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    if (value[environment] === undefined) {
      console.warn(
        `Warning: Environment "${environment}" not found for key "${key}", skipping...`
      );
      continue;
    }
    finalValue = value[environment];
  } else {
    // 如果不是物件，直接使用
    finalValue = value;
  }

  // 轉換為字串格式
  let stringValue;
  if (Array.isArray(finalValue)) {
    // 特殊處理 BASE_PROJECT
    if (key === "BASE_PROJECT") {
      const baseExtensions = [
        ".js",
        ".jsx",
        ".ts",
        ".tsx",
        ".css",
        ".json",
        ".scss",
        ".module.scss",
      ];

      if (finalValue.length === 0) {
        // 如果陣列為空，只返回基礎擴展名
        stringValue = baseExtensions.join(",");
      } else {
        // 生成每個項目名稱的前綴擴展名 + 基礎擴展名
        const extensions = [];
        finalValue.forEach((projectName) => {
          baseExtensions.forEach((ext) => {
            extensions.push(`.${projectName}${ext}`);
          });
        });
        extensions.push(...baseExtensions);
        stringValue = extensions.join(",");
      }
    } else {
      // 其他陣列轉換為逗號分隔的字串，每個項目前加上 ".."
      stringValue = finalValue.map((item) => `..${item}`).join(",");
    }
  } else if (typeof finalValue === "boolean") {
    stringValue = String(finalValue);
  } else if (typeof finalValue === "number") {
    stringValue = String(finalValue);
  } else {
    stringValue = finalValue;
  }

  // 添加到環境變數列表
  envVars.push(`VITE_APP_${key} = "${stringValue}"`);
}

// 寫入 .env 檔案
const envPath = path.join(__dirname, ".env");
const envContent = envVars.join("\n") + "\n";
fs.writeFileSync(envPath, envContent, "utf-8");

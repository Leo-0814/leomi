import "dotenv/config";
import fs from "fs";
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SPREADSHEET_ID = "1oQIoocwSilenVo9nulBt52S_hMZz4Yb_ob0Y5NRxqMY";
const CREDENTIALS_PATH = path.join(
  __dirname,
  "./tailwind-css-480106-0a2a43bb5b85.json"
);

if (!SPREADSHEET_ID || !CREDENTIALS_PATH) {
  console.error("錯誤：請檢查您的設定。");
  process.exit(1);
}
// 載入憑證 JSON
const creds = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf-8"));

const CONFIG_SHEET_NAME = "config-pc";
const LOCALE_SHEET_NAME = "i18n";
const CONFIG_OUTPUT_FILE = path.join(__dirname, "versionConfig.json");

/**
 * 解析值並轉換為適當的類型
 */
function parseValue(value) {
  if (value === null || value === undefined || value === "") return "";

  const trimmed = String(value).trim();

  // 處理空數組
  if (trimmed === "[]") {
    return [];
  }

  // 處理 JSON 數組
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      return JSON.parse(trimmed);
    } catch (e) {
      return trimmed;
    }
  }

  // 處理 JSON 對象
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      return JSON.parse(trimmed);
    } catch (e) {
      return trimmed;
    }
  }

  // 處理布爾值
  if (trimmed.toLowerCase() === "true") {
    return true;
  }
  if (trimmed.toLowerCase() === "false") {
    return false;
  }

  // 處理數字
  if (!isNaN(trimmed) && trimmed !== "") {
    const num = Number(trimmed);
    if (!isNaN(num)) {
      return num;
    }
  }

  // 返回字符串
  return trimmed;
}

async function fetchConfig() {
  try {
    // 創建 JWT 客戶端進行認證
    const serviceAccountAuth = new JWT({
      email: creds.client_email,
      key: creds.private_key.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    // 使用 JWT 客戶端初始化 GoogleSpreadsheet
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);

    await doc.loadInfo();
    console.log(`✅ 成功連線到試算表："${doc.title}"`);

    // 根據名稱查找工作表
    let sheet = doc.sheetsByTitle[CONFIG_SHEET_NAME];
    if (!sheet) {
      console.error(`❌ 找不到工作表："${CONFIG_SHEET_NAME}"`);
      console.log(`可用的工作表：${Object.keys(doc.sheetsByTitle).join(", ")}`);
      process.exit(1);
    }

    console.log(`📄 讀取工作表："${sheet.title}"`);

    // 獲取工作表的實際行數和列數（動態獲取，無需硬編碼）
    const rowCount = sheet.rowCount || 1000;
    const columnCount = sheet.columnCount || 100;

    // 將列數轉換為 A1 表示法（例如：26 -> Z, 27 -> AA）
    function numberToColumnLetter(num) {
      let result = "";
      while (num > 0) {
        num--;
        result = String.fromCharCode(65 + (num % 26)) + result;
        num = Math.floor(num / 26);
      }
      return result || "A";
    }

    const lastColumn = numberToColumnLetter(columnCount);
    const range = `A1:${lastColumn}${rowCount}`;

    console.log(`📐 工作表範圍：${rowCount} 行 × ${columnCount} 列 (${range})`);

    // 使用 loadCells 方法直接讀取所有單元格數據
    // 動態加載實際範圍，確保獲取所有行和列，包括第一行
    await sheet.loadCells(range);

    // 手動讀取所有行數據
    const allRows = [];

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      const row = [];
      let rowHasData = false;

      for (let colIndex = 0; colIndex < columnCount; colIndex++) {
        try {
          const cell = sheet.getCell(rowIndex, colIndex);
          const value = cell.value;

          if (value !== null && value !== undefined && value !== "") {
            rowHasData = true;
            row.push(value);
          } else {
            // 如果前面的列有數據，繼續添加空字符串以保持列對齊
            if (row.length > 0 || colIndex === 0) {
              row.push("");
            } else {
              // 如果第一列就是空的，且前面沒有數據，停止讀取這一列
              break;
            }
          }
        } catch (e) {
          // 超出範圍，停止讀取
          break;
        }
      }

      if (rowHasData) {
        allRows.push(row);
      } else if (allRows.length > 0) {
        // 如果已經有數據，但這一行是空的，停止讀取（避免讀取大量空行）
        break;
      }
    }

    console.log(`📊 共讀取 ${allRows.length} 筆資料（包含第一行）`);

    if (allRows.length === 0) {
      console.error("❌ 工作表為空");
      process.exit(1);
    }

    // 讀取第一行作為平台標題
    // 第一行格式：參數名稱 | vincetrust | vincetruse2
    // 第一列是標題（如"參數名稱"），從第二列開始是平台名稱
    const firstRow = allRows[0] || [];
    console.log("第一行完整數據:", JSON.stringify(firstRow));
    const firstColumnTitle = String(firstRow[0] || "").trim() || "參數名稱";
    console.log(`📋 第一列標題：${firstColumnTitle}`);

    const platforms = firstRow
      .slice(1) // 從第二列開始是平台名稱
      .map((p) => String(p || "").trim())
      .filter((p) => p && p !== ""); // 過濾空值

    if (platforms.length === 0) {
      console.error(
        "❌ 未檢測到平台名稱，請確認第一行從第二列開始包含平台名稱"
      );
      console.error(`第一行數據：${JSON.stringify(firstRow)}`);
      process.exit(1);
    }

    console.log(
      `📱 檢測到 ${platforms.length} 個平台：${platforms.join(", ")}`
    );

    // 初始化每個平台的配置對象
    const config = {};
    platforms.forEach((platform) => {
      config[platform] = {};
    });

    // 從第二行開始讀取數據（第一行是標題行）
    // 每行格式：BASE_PROJECT | [] | []
    // 第一列是配置項名稱，後續列是各平台對應的值
    let processedRows = 0;
    for (let i = 1; i < allRows.length; i++) {
      const rawData = allRows[i] || [];
      const configKey = String(rawData[0] || "").trim(); // 第一列是配置項名稱

      if (!configKey) {
        console.log(`⚠️  跳過第 ${i + 1} 行（配置項名稱為空）`);
        continue;
      }

      // 從第二列開始，對應各個平台的值
      for (let j = 0; j < platforms.length; j++) {
        const platform = platforms[j];
        const value = rawData[j + 1]; // j+1 因為第一列是配置項名稱

        if (config[platform]) {
          config[platform][configKey] = parseValue(value);
        }
      }
      processedRows++;
    }

    console.log(`✅ 成功處理 ${processedRows} 行配置數據`);

    // 將資料儲存為 JSON 檔案
    fs.writeFileSync(
      CONFIG_OUTPUT_FILE,
      JSON.stringify(config, null, 2),
      "utf-8"
    );
    console.log(`✅ 配置已寫入: ${CONFIG_OUTPUT_FILE}`);

    // 統計信息
    let totalConfigItems = 0;
    Object.values(config).forEach((platformConfig) => {
      totalConfigItems += Object.keys(platformConfig).length;
    });
    console.log(
      `📊 共解析 ${platforms.length} 個平台，${totalConfigItems} 個配置項`
    );

    // 打印配置預覽
    console.log("\n配置預覽:");
    Object.entries(config).forEach(([platform, platformConfig]) => {
      console.log(`\n${platform}:`);
      Object.entries(platformConfig)
        .slice(0, 5)
        .forEach(([key, value]) => {
          console.log(`  ${key}: ${JSON.stringify(value)}`);
        });
      if (Object.keys(platformConfig).length > 5) {
        console.log(
          `  ... 還有 ${Object.keys(platformConfig).length - 5} 個配置項`
        );
      }
    });
  } catch (error) {
    console.error("❌ 抓取 Google Sheets 資料時發生錯誤：", error.message);
    if (error.response) {
      console.error("Google API 回應狀態碼:", error.response.status);
      console.error("Google API 回應資料:", error.response.data);
    }
    console.error(error.stack);
    process.exit(1);
  }
}

async function fetchLocale() {
  try {
    // 創建 JWT 客戶端進行認證
    const serviceAccountAuth = new JWT({
      email: creds.client_email,
      key: creds.private_key.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    // 使用 JWT 客戶端初始化 GoogleSpreadsheet
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);

    await doc.loadInfo();
    console.log(`✅ 成功連線到試算表："${doc.title}"`);

    // 根據名稱查找工作表
    let sheet = doc.sheetsByTitle[LOCALE_SHEET_NAME];
    if (!sheet) {
      console.error(`❌ 找不到工作表："${LOCALE_SHEET_NAME}"`);
      console.log(`可用的工作表：${Object.keys(doc.sheetsByTitle).join(", ")}`);
      process.exit(1);
    }

    console.log(`📄 讀取工作表："${sheet.title}"`);

    // 獲取工作表的實際行數和列數（動態獲取，無需硬編碼）
    const rowCount = sheet.rowCount || 1000;
    const columnCount = sheet.columnCount || 100;

    // 將列數轉換為 A1 表示法（例如：26 -> Z, 27 -> AA）
    function numberToColumnLetter(num) {
      let result = "";
      while (num > 0) {
        num--;
        result = String.fromCharCode(65 + (num % 26)) + result;
        num = Math.floor(num / 26);
      }
      return result || "A";
    }

    const lastColumn = numberToColumnLetter(columnCount);
    const range = `A1:${lastColumn}${rowCount}`;

    console.log(`📐 工作表範圍：${rowCount} 行 × ${columnCount} 列 (${range})`);

    // 使用 loadCells 方法直接讀取所有單元格數據
    // 動態加載實際範圍，確保獲取所有行和列，包括第一行
    await sheet.loadCells(range);

    // 手動讀取所有行數據
    const allRows = [];

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      const row = [];
      let rowHasData = false;

      for (let colIndex = 0; colIndex < columnCount; colIndex++) {
        try {
          const cell = sheet.getCell(rowIndex, colIndex);
          const value = cell.value;

          if (value !== null && value !== undefined && value !== "") {
            rowHasData = true;
            row.push(value);
          } else {
            // 如果前面的列有數據，繼續添加空字符串以保持列對齊
            if (row.length > 0 || colIndex === 0) {
              row.push("");
            } else {
              // 如果第一列就是空的，且前面沒有數據，停止讀取這一列
              break;
            }
          }
        } catch (e) {
          // 超出範圍，停止讀取
          break;
        }
      }

      if (rowHasData) {
        allRows.push(row);
      } else if (allRows.length > 0) {
        // 如果已經有數據，但這一行是空的，停止讀取（避免讀取大量空行）
        break;
      }
    }

    console.log(`📊 共讀取 ${allRows.length} 筆資料（包含第一行）`);

    if (allRows.length === 0) {
      console.error("❌ 工作表為空");
      process.exit(1);
    }

    // 解析 i18n 數據結構
    // 第一行：Key | EN | ZH | ... (語系標題)
    // 第一列從第二行開始：翻譯鍵（key）
    // 從第二列開始：各語系對應的翻譯值

    const firstRow = allRows[0] || [];
    // 從第二列開始是語系名稱（跳過第一列的 "Key" 標題）
    const locales = firstRow
      .slice(1)
      .map((l) => String(l || "").trim())
      .filter((l) => l && l !== "");

    if (locales.length === 0) {
      console.error("❌ 未檢測到語系，請確認第一行從第二列開始包含語系名稱");
      console.error(`第一行數據：${JSON.stringify(firstRow)}`);
      process.exit(1);
    }

    console.log(`🌍 檢測到 ${locales.length} 個語系：${locales.join(", ")}`);

    // 初始化每個語系的翻譯對象
    const localeData = {};
    locales.forEach((locale) => {
      localeData[locale.toLowerCase()] = {};
    });

    // 從第二行開始讀取數據（第一行是標題行）
    // 每行格式：key | en_value | zh_value | ...
    let processedRows = 0;
    for (let i = 1; i < allRows.length; i++) {
      const rawData = allRows[i] || [];
      const translationKey = String(rawData[0] || "").trim(); // 第一列是翻譯鍵

      if (!translationKey) {
        console.log(`⚠️  跳過第 ${i + 1} 行（翻譯鍵為空）`);
        continue;
      }

      // 從第二列開始，對應各個語系的翻譯值
      for (let j = 0; j < locales.length; j++) {
        const locale = locales[j].toLowerCase();
        const value = rawData[j + 1]; // j+1 因為第一列是翻譯鍵

        if (localeData[locale]) {
          localeData[locale][translationKey] = value || "";
        }
      }
      processedRows++;
    }

    console.log(`✅ 成功處理 ${processedRows} 行翻譯數據`);

    // 創建 locales 目錄
    const localesDir = path.join(__dirname, "src", "locales");
    if (!fs.existsSync(localesDir)) {
      fs.mkdirSync(localesDir, { recursive: true });
      console.log(`📁 創建目錄: ${localesDir}`);
    }

    // 為每個語系創建 JSON 文件
    let createdFiles = 0;
    for (const [locale, translations] of Object.entries(localeData)) {
      const fileName = `${locale}.json`;
      const filePath = path.join(localesDir, fileName);
      fs.writeFileSync(
        filePath,
        JSON.stringify(translations, null, 2),
        "utf-8"
      );
      console.log(
        `✅ 已創建: ${filePath} (${Object.keys(translations).length} 個翻譯鍵)`
      );
      createdFiles++;
    }

    console.log(`\n🎉 成功創建 ${createdFiles} 個語系文件`);
  } catch (error) {
    console.error("❌ 抓取 Google Sheets 資料時發生錯誤：", error.message);
    if (error.response) {
      console.error("Google API 回應狀態碼:", error.response.status);
      console.error("Google API 回應資料:", error.response.data);
    }
    console.error(error.stack);
    process.exit(1);
  }
}

// 根據命令行參數決定執行哪個函數
const command = process.argv[2] || "config";

async function main() {
  try {
    if (command === "locales" || command === "lang") {
      await fetchLocale();
    } else if (command === "all") {
      console.log("🔄 開始獲取所有配置...\n");
      await fetchConfig();
      console.log("\n");
      await fetchLocale();
    } else {
      await fetchConfig();
    }
  } catch (error) {
    console.error("❌ 執行錯誤：", error.message);
    process.exit(1);
  }
}

main();

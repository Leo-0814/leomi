import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf8"));
packageJson.homepage = process.env.VITE_APP_HOMEPAGE;
fs.writeFileSync("./package.json", JSON.stringify(packageJson, null, 2));

import { setVersion } from "google-sheets-fetcher";

const productionName = process.argv[2] ?? "leomi";
const environment = process.argv[3] ?? "stag";

setVersion("VITE", productionName, environment);

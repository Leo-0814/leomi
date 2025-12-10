import { setVersion } from "google-sheets-fetcher";

const productionName = process.argv[2] ?? "vincetrust";
const environment = process.argv[3] ?? "prod";

setVersion("VITE", productionName, environment);

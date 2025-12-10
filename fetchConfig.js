import GoogleSheetsFetcher from "google-sheets-fetcher";

const formatAs = process.argv[2] ?? "all";

// https://docs.google.com/spreadsheets/d/11NxABKEHbZIE1ei_90hf_1i6ld0fkDQwwyn_QkHAHtA/edit?gid=2040508904#gid=2040508904

const { fetchConfig, fetchLocale, fetchAll } = new GoogleSheetsFetcher({
  spreadsheetId: "11NxABKEHbZIE1ei_90hf_1i6ld0fkDQwwyn_QkHAHtA",
  configSheetName: "config",
  localeSheetName: "i18n",
});

switch (formatAs) {
  case "lang":
    fetchLocale();
    break;
  case "config":
    fetchConfig();
    break;
  default:
    fetchAll();
}

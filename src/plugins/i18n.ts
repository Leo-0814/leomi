import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import localStorageKey from "../enumerations/localStorageKey";
import en from "../locales/en.json";
import zh from "../locales/zh.json";
import { envChangeType } from "./utils";
// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: { translation: en },
  // cn: { translation: cn },
  zh: { translation: zh },
};
const nowLangProcess = () => {
  const lang =
    window?.localStorage?.getItem(localStorageKey.LANGUAGE) ||
    (envChangeType("VITE_APP_DEFAULT_LANG") as string);
  return lang.toString().replace(/"/gm, "").toLowerCase();
};
const nowLang = nowLangProcess();
console.debug("nowLang", nowLang);
const hasTranslation = Boolean(Object.keys(resources).includes(nowLang));
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: hasTranslation
      ? nowLang
      : (envChangeType("VITE_APP_DEFAULT_LANG") as string),
    fallbackLng: nowLang,
    keySeparator: false,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;

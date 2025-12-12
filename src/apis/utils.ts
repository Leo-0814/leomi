//跳轉、錯誤處理、提示等方法放在這裡

import { CustomMessage } from "../components";
import localStorageKey from "../enumerations/localStorageKey";

export const tip = (msg: string) => {
  CustomMessage({
    alertMessage: msg,
    alertType: "error",
  });
};

export const logout = () => {
  window.localStorage.removeItem(localStorageKey.TOKEN);
  window.localStorage.removeItem(localStorageKey.USER_INFO);
  // Sentry.setUser(null);
  if (window.location.pathname !== "/") {
    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  } else {
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }
};

export const toLogin = () => {
  window.location.href = "/";
};

export const to403Page = () => {
  // window.location.pathname = "/accessDenied";
};

export const toMaintenancePage = () => {
  window.location.pathname = "/in-maintenance";
};

export const toInternetErrorPage = () => {
  // window.location.pathname = "/connectionFailed";
};

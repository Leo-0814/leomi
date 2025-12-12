import axios from "axios";
// import router from '../router/index'
import localStorageKey from "../enumerations/localStorageKey";
// import { logout, noNeedLoginPage } from "../plugins/utils";
import { logout, tip } from "./utils";

declare module "axios" {
  export interface AxiosInstance {
    translateFn?: (string: string) => string;
  }
}

//axios的實例
export const httpClient = axios.create({
  baseURL: "/",
});

httpClient.translateFn = (string) => string;

interface ErrorHandleParams {
  status: number;
  msg: string;
  code?: string | undefined;
}

const errorHandle = ({ status, msg, code }: ErrorHandleParams): void => {
  switch (status) {
    //400: 登入失敗，可能是帳號或是密碼錯誤
    case 400:
    case 455:
      // if (code === apiErrorCode.PASSWORD_ERROR) break;
      // tip(msg, code);
      break;
    //401: backend session過期
    case 401:
      switch (code) {
        default:
          logout();
          break;
      }
      break;
    //403: 權限不足
    case 403:
      if (!msg && !code) {
        // console.debug("It is robot 403,msg,code", msg, code);
        window.location.reload();
      } else {
        tip(msg);
      }
      break;
    //404: 請求失敗
    case 404:
      // tip(msg, code);
      break;

    //其他錯誤，直接拋出提示錯誤
    default:
      console.log("resp沒有攔截到的錯誤:" + msg);
  }
};

//request攔截器
httpClient.interceptors.request.use(
  (config) => {
    if (
      (config.params && config.params.needAuth) ||
      (config.data !== undefined && config.data.needAuth)
    ) {
      let token = "";

      if (window.localStorage.getItem(localStorageKey.TOKEN)) {
        token = window.localStorage.getItem(localStorageKey.TOKEN) || "";
        token = token.replace(/"/gm, "");
      }
      if (token) {
        config.headers.Authorization = "Bearer " + token;
      }
      return config;
    } else {
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    if (response) {
      let str: string = "",
        obj: Record<string, { message: string }[]> | undefined = undefined;
      if (response.data.result === undefined) {
        errorHandle({
          status: response.status,
          msg: response.data.message,
          code: response.data?.result?.code,
        });
        // obj = undefined;
      } else {
        errorHandle({
          status: response.status,
          msg: response.data.result.message,
          code: response.data?.result?.code,
        });
        obj =
          response.data.result.validationErrors === undefined
            ? undefined
            : response.data.result.validationErrors;
      }
      if (obj !== undefined) {
        Object.keys(obj).forEach((key: string) => {
          str = str + (obj![key][0].message || "") + "\n";
        });
        // return Promise.reject(str);
        return Promise.reject(response);
      } else {
        str =
          response.data.result === undefined
            ? response.data.message
            : response.data.result.message;
        // return Promise.reject(str);
        return Promise.reject(response);
      }
    } else {
      if (!window.navigator.onLine) {
        //FIXME:無網路連線method
        console.error("no network");
        // tip("Network issue, please reconnect and refresh the webpage.");
        // toInternetErrorPage();
      } else {
        return Promise.reject(error);
      }
    }
  }
);
const langSetting = window.localStorage.getItem(localStorageKey.DEFAULT_LANG);
const langParam = langSetting
  ? langSetting
  : import.meta.env.VITE_APP_DEFAULT_LANG;

interface ReqParams {
  method: string;
  url: string;
  data?: Record<string, unknown> | FormData | null;
  needAuth?: boolean;
  needCompanyId?: boolean;
  needLang?: boolean;
  removeAuth?: boolean;
}

export default function req({
  method,
  url,
  data = null,
  needAuth = false,
  needCompanyId = true,
  needLang = true,
  removeAuth = false,
}: ReqParams): Promise<unknown> {
  const companyId = import.meta.env.VITE_APP_COMPANY_CODE;
  method = method.toLowerCase();

  let processData: Record<string, unknown> | FormData;

  if (data instanceof FormData) {
    processData = data;
    // For FormData, append additional fields if needed
    if (needLang) {
      processData.append("lang", langParam);
    }
    if (needCompanyId) {
      processData.append("company_code", companyId);
    }
    if (!removeAuth) {
      processData.append("needAuth", String(needAuth));
    }
  } else {
    processData = needCompanyId
      ? {
          lang: langParam,
          company_code: companyId,
          ...data,
        }
      : {
          lang: langParam,
          ...data,
        };
    if (!needLang) delete processData.lang;
    if (!needCompanyId) delete processData.company_code;
    if (!removeAuth) {
      processData.needAuth = needAuth;
    }
  }
  if (method === "post") {
    return httpClient.post(url, processData);
  } else if (method === "get") {
    return httpClient.get(url, { params: processData });
  } else if (method === "delete") {
    return httpClient.delete(url, { params: processData });
  } else if (method === "put") {
    return httpClient.put(url, processData);
  } else {
    console.error("未知的method" + method);
    return Promise.reject();
  }
}

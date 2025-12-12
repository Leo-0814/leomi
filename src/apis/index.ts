// import { isAllowedWithoutCurrency, toLogin } from "./utils";

import type { FirebaseRequestOptions } from "./data";
import req from "./https";

type RequestMethod = "get" | "post" | "put" | "delete" | "patch";

export const request = (
  method: RequestMethod,
  path: string,
  data: Record<string, unknown> | FormData | null = null,
  needAuth: boolean = false,
  needCompanyId: boolean = true
): Promise<unknown> =>
  req({
    method: method,
    url: `${import.meta.env.VITE_APP_API_MAIN_URL}${path}`,
    data,
    needAuth,
    needCompanyId,
  });

export const requestCDN = (method: RequestMethod, path: string) =>
  req({
    method: method,
    url: `${import.meta.env.VITE_APP_CDN_URL}${path}`,
    data: {},
    needAuth: false,
    needCompanyId: false,
  });

export const firebaseRequest = async ({
  action,
  options,
}: {
  action: () => Promise<unknown>;
  options: FirebaseRequestOptions;
}) => {
  return Promise.resolve(await action())
    .then((success) => {
      options.onSuccess?.(success);
    })
    .catch((error) => {
      console.debug(error);
      options.onError?.(error);
    });
};

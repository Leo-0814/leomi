// import { Toast } from "../components";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import parseUrl from "parse-url";
import { Toast } from "../components";
import localStorageKey from "../enumerations/localStorageKey";

dayjs.extend(utc);
dayjs.extend(timezone);

export const copyText = (text: string, successMessageContent: string) => {
  if (!text) return;
  // navigator.clipboard.writeText(text);
  console.debug("copyText", text);
  const selectGroup = document.getElementById("copy-group");
  const tempArea = document.createElement("textarea");
  selectGroup?.appendChild(tempArea);
  tempArea.innerText = text;
  tempArea.select();
  document.execCommand("Copy");
  selectGroup?.removeChild(tempArea);

  Toast({ content: successMessageContent, type: "success" });
};

export const envType = {
  NUMBER: "number",
  BOOLEAN: "boolean",
  ARRAY: "array",
  STRING: "string",
};

export const envChangeType = (
  target: string,
  type = envType.STRING
): string | number | boolean | string[] => {
  switch (type) {
    case envType.NUMBER:
    case envType.BOOLEAN:
      return JSON.parse(import.meta.env[target]);
    case envType.ARRAY:
      return import.meta.env[target]?.split(",");
    default:
      return import.meta.env[target];
  }
};

export const getCurrency = () => {
  const storageCurrency = localStorage.getItem(localStorageKey.CURRENCY);
  const queryStringObject = parseUrl(window.location.href).query;
  const queryCurrency = queryStringObject.currency;
  return (
    storageCurrency ||
    queryCurrency ||
    envChangeType("VITE_APP_DEFAULT_CURRENCY")
  );
};

export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getNowLang = () => {
  const storageLang = localStorage.getItem(
    localStorageKey[
      envChangeType("VITE_APP_DEFAULT_LANG") as keyof typeof localStorageKey
    ]
  );
  const queryStringObject = parseUrl(window.location.href).query;
  const queryLang = queryStringObject.lang;
  return storageLang || queryLang || envChangeType("VITE_APP_DEFAULT_LANG");
};

export const middleEllipsis = ({
  inputString,
  minStringLength = 35,
  firstLetterLength = 3,
  secondLetterLength = 3,
  symbol = "...",
}: {
  inputString: string;
  minStringLength?: number;
  firstLetterLength?: number;
  secondLetterLength?: number;
  symbol?: string;
}) => {
  if (inputString?.length > minStringLength) {
    return (
      inputString.substr(0, firstLetterLength) +
      symbol +
      inputString.substr(
        inputString?.length - secondLetterLength,
        inputString.length
      )
    );
  }
  return inputString;
};

interface SwiperRef {
  swiper: {
    slidePrev: () => void;
    slideNext: () => void;
  };
}

interface FormRef {
  resetFields: () => void;
  getFieldsValue: () => Record<string, unknown>;
}

export const handlePrevSwiper = (ref: React.RefObject<SwiperRef>) => {
  if (!ref.current) return;
  ref.current.swiper.slidePrev();
};

export const handleNextSwiper = (ref: React.RefObject<SwiperRef>) => {
  if (!ref.current) return;
  ref.current.swiper.slideNext();
};

export const reset = (ref: React.RefObject<FormRef>) => {
  ref?.current.resetFields();
};

export const checkInputHasNull = (
  ref: React.RefObject<FormRef>,
  setState: (state: boolean) => void
) => {
  const currentParams = ref.current.getFieldsValue();
  const objectKeys = Object.keys(currentParams);
  let hasNull: boolean = false;
  objectKeys.map((key) => {
    if (
      currentParams[key] === undefined ||
      currentParams[key] === null ||
      currentParams[key] === ""
    ) {
      hasNull = true;
    }
    return key;
  });
  setState(hasNull);
};

export const handleClickApp = (
  type: string,
  refetch: () => Promise<
    { data: { apk: string } } | { data: { google: string; appstore: string } }
  >,
  onClickIOS: () => void
) => {
  const ua = navigator.userAgent;
  const android = ua.indexOf("Android") > -1 || ua.indexOf("Adr") > -1; // android
  // const iOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios
  switch (type) {
    case "url":
      if (android) {
        return "/app-download/android";
      } else {
        return "/app-download/ios";
      }
    case "navigate":
      if (android) {
        window.location.href = "/app-download/android";
      } else {
        window.location.href = "/app-download/ios";
      }
      break;
    case "download":
      if (android) {
        refetch().then((res) => {
          if ("apk" in res.data) {
            window.location.href = res.data.apk;
          }
        });
      } else {
        onClickIOS();
      }
      break;
    case "app-download":
      refetch().then((res) => {
        if ("google" in res.data && "appstore" in res.data) {
          if (android) {
            window.location.href = res.data.google;
          } else {
            window.location.href = res.data.appstore;
          }
        }
      });
      break;
    default:
      break;
  }
};

export const getNextPageParam = (
  lastPage: { last_page: number },
  pages: { length: number }[]
) => {
  if (pages.length < lastPage.last_page) {
    return pages.length + 1;
  } else {
    return undefined;
  }
};

export const loadMore = <T>(
  isFetchingNextPage: boolean,
  localData: T[],
  fetchNextPage: () => void
) => {
  if (isFetchingNextPage === false && localData.length > 0) {
    fetchNextPage();
  }
};

export const infiniteDataProcess = <T>(
  data: { pages: { data: T[] }[] },
  setLocalData: (data: T[] | ((prevState: T[]) => T[])) => void
) => {
  const page_length = data?.pages.length;
  if (page_length <= 1) {
    setLocalData([...(data.pages[0]?.data ?? [])]);
  } else {
    setLocalData((prevState: T[]) => {
      return [...prevState, ...(data.pages[page_length - 1]?.data ?? [])];
    });
  }
};

export const formatDate = (date: number, format = "YYYY-MM-DD HH:mm:ss") => {
  return dayjs.unix(date).tz(dayjs.tz.guess()).format(format);
};

export const USER_FIRST_TAB_PATH = "/user/my-project?tab=my-project";

import { useEffect } from "react";
import Context from "./context";
import "./plugins/i18n";
import ProcessRouter from "./router/index";
import FontSetting from "./styles/FontSetting";

const currentTheme = import(
  `./theme/${import.meta.env.VITE_APP_PROD_NAME_DEV}/theme.json`
);
const defaultTheme = import(`./theme/defaultTheme.json`);
const finalTheme = { ...defaultTheme, ...currentTheme };

/**
 * SCROLL TESTING PURPOSE
 * DO NOT DELETE, OPEN WHEN DEBUG SCROLL ISSUE ONLY
 */

function isScrollable(el: HTMLElement) {
  return el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight;
}
window.addEventListener(
  "scroll",
  function (e: Event) {
    let el: HTMLElement | null =
      e.target instanceof HTMLElement ? e.target : null;
    while (el && el !== document.documentElement && !isScrollable(el)) {
      el = el?.parentElement;
    }
    console.debug("Scrolled element: " + (el?.className || "document"));
  },
  true
);

function App() {
  const setTheme = () => {
    const r: HTMLElement | null = document.querySelector(":root");
    const final = Object.entries(finalTheme);
    final.map((color) => {
      r?.style?.setProperty(
        color[0] as unknown as string,
        color[1] as unknown as string
      );
    });
  };
  const initStyle = () => {
    const _vh = window.innerHeight * 0.01;
    window.document.documentElement.style.setProperty("--vh", `${_vh}px`);
  };

  useEffect(() => {
    initStyle();
    setTheme();

    // 设置 robots meta 标签
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.setAttribute("name", "robots");
      document.head.appendChild(robotsMeta);
    }

    if (import.meta.env.VITE_APP_ENV !== "production") {
      console.debug(import.meta.env.VITE_APP_ENV);
      robotsMeta.setAttribute("content", "noindex");
    } else {
      robotsMeta.setAttribute("content", "index, follow");
    }
  }, []);

  return (
    <div>
      <Context>
        <FontSetting>
          <ProcessRouter />
        </FontSetting>
      </Context>
    </div>
  );
}

export default App;

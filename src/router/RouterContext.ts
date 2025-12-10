import React from "react";

export interface NavType {
  backgroundColor?: string;
  hideHeader?: boolean;
  hideFooter?: boolean;
  hideSider?: boolean;
  loginLayout?: boolean;
  authBackgroundColor?: string;
  type?: string;
  fullWidth?: boolean;
  [key: string]: unknown;
}

interface RouterContextType {
  changeLayout: (layout: string) => void;
  changeNavType: (navType: NavType) => void;
}

const RouterContext = React.createContext<RouterContextType>({
  changeLayout: () => {},
  changeNavType: () => {},
});

export default RouterContext;

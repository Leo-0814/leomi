import { type ReactNode } from "react";
import type { NavType } from "../router/RouterContext";

interface DefaultLayoutProps {
  props: {
    children: ReactNode;
    navType: NavType;
  };
}

function DefaultLayout({ props }: DefaultLayoutProps) {
  return (
    <div className="min-h-screen w-screen bg-gray-100">{props.children}</div>
  );
}

export default DefaultLayout;

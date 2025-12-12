import { HomeOutlined, SettingOutlined } from "@ant-design/icons";
import { TabBar } from "antd-mobile";
import { type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import type { NavType } from "../router/RouterContext";
interface DefaultLayoutProps {
  props: {
    children: ReactNode;
    navType: NavType;
  };
}

function DefaultLayout({ props }: DefaultLayoutProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const activeKey = location.pathname.split("/").pop() || "";
  const tabs = [
    {
      key: "charge-list",
      title: t("normal.home"),
      icon: <HomeOutlined />,
      badge: null,
      path: "/charge-list",
    },
    // {
    //   key: "todo",
    //   title: "待办",
    //   icon: <UnorderedListOutlined />,
    //   badge: null,
    //   path: "/todo",
    // },
    // {
    //   key: "message",
    //   title: "消息",
    //   icon: (active: boolean) =>
    //     active ? <MessageFilled /> : <MessageOutlined />,
    //   badge: null,
    //   path: "/message",
    // },
    {
      key: "settings",
      title: t("normal.settings"),
      icon: <SettingOutlined />,
      path: "/settings",
    },
  ];

  return (
    <div className="min-h-screen w-screen bg-gray-100 overflow-y-auto pb-[65px]">
      <div className="w-[90%] mx-auto py-8 min-h-screen flex flex-col gap-4">
        {props.children}
        <TabBar
          className="fixed bottom-0 left-0 right-0 py-2 bg-cyan-50"
          activeKey={activeKey}
        >
          {tabs.map((item) => (
            <TabBar.Item
              key={item.key}
              icon={item.icon}
              title={item.title}
              onClick={() => navigate(item.path)}
            />
          ))}
        </TabBar>
      </div>
    </div>
  );
}

export default DefaultLayout;

import { useContext, useEffect, useState } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  type NavigateFunction,
  type Params,
  type Location as RouterLocation,
} from "react-router-dom";
import layouts from "./layouts";
import RouterList from "./router";
import RouterContext, { type NavType } from "./RouterContext";

type RouteConfig = (typeof RouterList)[number] | null;

const findRouteConfig = (currentPath = ""): RouteConfig => {
  // Get the base path from Vite (e.g., "/leomi/")
  const basePath = import.meta.env.BASE_URL || "/";
  // Remove base path from current path for matching
  const pathToMatch = currentPath || window.location.pathname;
  const normalizedPath = pathToMatch.replace(new RegExp(`^${basePath}`), "/") || "/";
  
  const target = RouterList.find((route) => {
    if (route.path === "/") {
      return normalizedPath === "/" || normalizedPath === "";
    }
    const regex = new RegExp(`^${route.path.replace(/:[^/]*/g, ".*")}$`);
    return regex.test(normalizedPath);
  });
  
  if (!target) {
    return null;
  }

  return target; //background
};

function withRouter(
  Component: React.ComponentType<{
    router: {
      location: RouterLocation;
      navigate: NavigateFunction;
      params: Params;
    };
  }>
) {
  function ComponentWithRouterProp() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    return <Component router={{ location, navigate, params }} />;
  }

  return ComponentWithRouterProp;
}

const RouterRender = ({
  router,
}: {
  router: {
    location: RouterLocation;
    navigate: NavigateFunction;
    params: Params;
  };
}) => {
  const { location } = router;
  const { changeLayout, changeNavType } = useContext(RouterContext);

  useEffect(() => {
    const routeConfig = findRouteConfig(location.pathname);
    if (routeConfig) {
      const routeLayout =
        (routeConfig as { layout?: string }).layout ?? "default";
      changeLayout(routeLayout);
      changeNavType((routeConfig as { navType?: NavType }).navType ?? {});
    } else {
      changeLayout("default");
      changeNavType({});
    }
  }, [location.pathname, changeLayout, changeNavType]);

  return (
    <Routes>
      {RouterList.map((route, index) => {
        return (
          <Route key={index} path={route.path} element={<route.component />} />
        );
      })}
    </Routes>
  );
};

const RouterRenderWithRouter = withRouter(RouterRender);

const ProcessRouter = () => {
  const routeConfig = findRouteConfig();
  const routeLayout = routeConfig
    ? (routeConfig as { layout?: string }).layout ?? "default"
    : "default";
  const [layout, setLayout] = useState(routeLayout);
  const [navType, setNavType] = useState<NavType>(
    routeConfig ? (routeConfig as { navType?: NavType }).navType ?? {} : {}
  );
  const actions = {
    changeLayout: (layout = "default") => {
      setLayout(layout ?? "default");
    },
    changeNavType: (navType: NavType = {}) => {
      setNavType(navType ?? {});
    },
  };

  const LayoutComponent = layouts[layout as keyof typeof layouts];

  return (
    <RouterContext.Provider value={actions}>
      <Router>
        <LayoutComponent
          props={{
            navType: navType ? navType : { type: "default" },
            children: <RouterRenderWithRouter />,
          }}
        />
      </Router>
    </RouterContext.Provider>
  );
};

export default ProcessRouter;

import ChargeDetail from "../pages/ChargeDetail";
import ChargeList from "../pages/ChargeList";
import ChessGame from "../pages/ChessGame";
import Home from "../pages/Home";
import Settings from "../pages/Settings";
const RouterList = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/chess-game",
    name: "ChessGame",
    component: ChessGame,
  },
  {
    path: "/charge-list",
    name: "Charge",
    component: ChargeList,
  },
  {
    path: "/charge-list/:id",
    name: "ChargeDetail",
    component: ChargeDetail,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
];
export default RouterList;

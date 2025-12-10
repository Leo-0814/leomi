import ChargeDetail from "../pages/ChargeDetail";
import ChargeList from "../pages/ChargeList";
import ChessGame from "../pages/ChessGame";

const RouterList = [
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
];
export default RouterList;

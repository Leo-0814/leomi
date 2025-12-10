import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Board, Chess } from "./components";
import "./style";
import styles from "./styleModule";

const ChessGame = () => {
  useEffect(() => {
    const chessEnum = {
      車: {
        name: "車",
        mode: "black" as const,
        position: "board-point-0",
      },
      車2: {
        name: "車",
        mode: "black" as const,
        position: "board-point-8",
      },
      馬: {
        name: "馬",
        mode: "black" as const,
        position: "board-point-1",
      },
      馬2: {
        name: "馬",
        mode: "black" as const,
        position: "board-point-7",
      },
      象: {
        name: "象",
        mode: "black" as const,
        position: "board-point-2",
      },
      象2: {
        name: "象",
        mode: "black" as const,
        position: "board-point-6",
      },
      士: {
        name: "士",
        mode: "black" as const,
        position: "board-point-3",
      },
      士2: {
        name: "士",
        mode: "black" as const,
        position: "board-point-5",
      },
      將: {
        name: "將",
        mode: "black" as const,
        position: "board-point-4",
      },
      卒: {
        name: "卒",
        mode: "black" as const,
        position: "board-point-27",
      },
      卒2: {
        name: "卒",
        mode: "black" as const,
        position: "board-point-29",
      },
      卒3: {
        name: "卒",
        mode: "black" as const,
        position: "board-point-31",
      },
      卒4: {
        name: "卒",
        mode: "black" as const,
        position: "board-point-33",
      },
      卒5: {
        name: "卒",
        mode: "black" as const,
        position: "board-point-35",
      },
      包: {
        name: "包",
        mode: "black" as const,
        position: "board-point-19",
      },
      包2: {
        name: "包",
        mode: "black" as const,
        position: "board-point-25",
      },
    };

    Object.values(chessEnum).forEach((chess) => {
      const boardPoint = document.getElementById(chess.position);
      if (boardPoint) {
        const root = createRoot(boardPoint);
        root.render(<Chess name={chess.name} mode={chess.mode} />);
      }
    });
  }, []);

  return (
    <div className={`${styles.container} home-container`}>
      <Board />
    </div>
  );
};

export default ChessGame;

import styles from "./style.module.scss";
import "./style.scss";

const Board = () => {
  // 生成网格点：宽度9个点（0-800），高度10个点（0-900）
  const gridPoints = [];
  for (let y = 0; y <= 9; y++) {
    for (let x = 0; x <= 8; x++) {
      gridPoints.push({ x: x * 100 - 32, y: y * 100 - 32 });
    }
  }

  return (
    <div className={`${styles.board} board`}>
      {/* 网格点 */}
      {gridPoints.map((point, index) => (
        <div
          key={index}
          id={`board-point-${index}`}
          style={{
            left: `${point.x}px`,
            top: `${point.y}px`,
            position: "absolute",
          }}
        />
      ))}
      <div className={styles.top}>
        {Array.from({ length: 32 }).map((_, index) => (
          <div key={index} className={`${styles.item} item-${index}`}></div>
        ))}
      </div>
      <div className={styles.bottom}>
        {Array.from({ length: 32 }).map((_, index) => (
          <div
            key={index}
            className={`${styles.item} item-${32 + index}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Board;

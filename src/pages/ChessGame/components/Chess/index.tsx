import styles from "./style.module.scss";

const Chess = ({
  name = "車",
  mode = "black",
}: {
  name: string;
  mode: "black" | "red";
}) => {
  return (
    <div className={`${styles.chess} ${mode === "red" ? styles.red : ""}`}>
      <div className={styles.inner}>{name}</div>
    </div>
  );
};

export default Chess;

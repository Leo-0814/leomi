declare module "*.scss";
declare module "*.css";
declare module "*.png";
declare module "*.svg";
declare module "*.jpeg";
declare module "*.jpg";

// 允許目錄 import
declare module "*/styleModule" {
  const styles: { [key: string]: string };
  export default styles;
}

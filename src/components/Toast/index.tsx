import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { message } from "antd";

const Toast = ({
  content = "",
  type = "success",
}: {
  content?: string;
  type?: "success" | "error" | "warning";
}) => {
  const renderIcon = (type: "success" | "error" | "warning") => {
    switch (type) {
      case "success":
        return (
          <CheckCircleOutlined
            style={{
              color: "var(--adm-color-success)",
              marginRight: "0",
              fontSize: "50px",
            }}
          />
        );
      case "error":
        return (
          <CloseCircleOutlined
            style={{
              color: "var(--adm-color-error)",
              marginRight: "0",
              fontSize: "50px",
            }}
          />
        );
      case "warning":
        return (
          <ExclamationCircleOutlined
            style={{
              color: "var(--adm-color-warning)",
              marginRight: "0",
              fontSize: "50px",
            }}
          />
        );
      default:
        return (
          <CheckCircleOutlined
            style={{
              color: "var(--adm-color-success)",
              marginRight: "0",
              fontSize: "50px",
            }}
          />
        );
    }
  };

  const customContent = (
    type: "success" | "error" | "warning",
    content: string
  ) => {
    return (
      <div className="custom-content">
        <div className="icon">{renderIcon(type)}</div>
        {content && <div className="content">{content}</div>}
      </div>
    );
  };

  message.open({
    content: customContent(type, content),
    className: "custom-message",
  });
};

export default Toast;

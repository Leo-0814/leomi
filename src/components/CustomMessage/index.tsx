import { Alert, message } from "antd";
import React from "react";
import "./style.scss";

type AlertType = "success" | "info" | "warning" | "error";

interface ShowAlertOptions {
  alertMessage: string;
  alertType?: AlertType;
  duration?: number;
  action?: React.ReactNode;
}

const CustomMessage = ({
  alertMessage,
  alertType = "info",
  duration = 3,
  action = undefined,
}: ShowAlertOptions): void => {
  message.open({
    content: (
      <Alert
        action={action}
        rootClassName="custom-alert"
        message={alertMessage}
        type={alertType}
        banner
        showIcon={false}
      />
    ),
    duration: duration,
  });
};

export default CustomMessage;

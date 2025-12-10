import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Flex, Modal, Table } from "antd";
import type { ColumnType } from "antd/es/table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AddModal } from "./components";
import type { ChargeListDataType } from "./data";
import styles from "./style.module.scss";

const ChargeList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { confirm } = Modal;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleDelete = () => {
    confirm({
      title: t("chargeList.delete.title"),
      icon: <ExclamationCircleFilled />,
      content: t("chargeList.delete.content"),
      okText: t("normal.yes"),
      okType: "danger",
      cancelText: t("normal.no"),
      onOk() {
        console.log("OK");
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const columns: ColumnType<ChargeListDataType>[] = [
    {
      title: t("normal.name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("normal.action"),
      dataIndex: "action",
      key: "action",
      width: 100,
      render: (_, record) => {
        return (
          <Flex align="center" gap={8}>
            <Button
              type="primary"
              onClick={() => {
                navigate(`/charge-list/${record.id}`);
              }}
            >
              <EditOutlined />
            </Button>
            <Button type="primary" danger onClick={handleDelete}>
              <DeleteOutlined />
            </Button>
          </Flex>
        );
      },
    },
  ];

  const dataSource: ChargeListDataType[] = [
    {
      id: 1,
      name: "12月開銷",
    },
    {
      id: 2,
      name: "11月開銷",
    },
  ];

  return (
    <div className={styles.container}>
      <Flex justify="space-between" align="center">
        <h1 className={styles.title}>{t("chargeList.title")}</h1>
        <Button type="primary" onClick={() => setIsAddModalOpen(true)}>
          <PlusOutlined />
          {t("normal.add")}
        </Button>
      </Flex>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        scroll={{ x: "max-content" }}
      />
      <AddModal
        isOpen={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export default ChargeList;

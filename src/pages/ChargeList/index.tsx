import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  FileSearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Flex, message, Modal, Table } from "antd";
import type { ColumnType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ACTION_MODE } from "../../enumerations/utils";
import { deleteChargeItem, getChargeList } from "../../hooks/chargeList.hooks";
import type { ChargeListDataType } from "../../interfaces/chargeList";
import { ActionModal } from "./components";
import styles from "./style.module.scss";

const ChargeList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { confirm } = Modal;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [lists, setLists] = useState<ChargeListDataType[]>([]);
  const [actionMode, setActionMode] = useState<string>(ACTION_MODE.EDIT);
  const [selectedItem, setSelectedItem] = useState<
    ChargeListDataType | undefined
  >(undefined);

  const getChargeListData = async () => {
    getChargeList((querySnapshot) => {
      const newLists: ChargeListDataType[] = [];
      querySnapshot.forEach((doc) => {
        newLists.push({ id: doc.id, name: doc.data()?.name || "" });
      });
      console.debug("charge list", newLists);
      setLists(newLists);
    });
  };

  const handleDelete = (item: ChargeListDataType) => {
    confirm({
      title: t("chargeList.delete.title"),
      icon: <ExclamationCircleFilled />,
      content: t("chargeList.delete.content"),
      okText: t("normal.yes"),
      okType: "danger",
      cancelText: t("normal.no"),
      onOk() {
        deleteChargeItem({
          params: { id: item.id },
          options: {
            onSuccess: () => {
              message.success(t("normal.success"));
              getChargeListData();
            },
          },
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleEdit = (item: ChargeListDataType) => {
    setActionMode(ACTION_MODE.EDIT);
    setIsAddModalOpen(true);
    setSelectedItem(item);
  };

  const handleAdd = () => {
    setActionMode(ACTION_MODE.ADD);
    setIsAddModalOpen(true);
  };

  const columns: ColumnType<ChargeListDataType>[] = [
    {
      title: t("normal.name"),
      dataIndex: "name",
      key: "name",
      render: (text, record) => {
        return (
          <Flex align="center" gap={4}>
            <div>{text}</div>
            <Button
              type="link"
              style={{ padding: 0 }}
              onClick={() => handleEdit(record)}
            >
              <EditOutlined />
            </Button>
          </Flex>
        );
      },
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
              <FileSearchOutlined />
            </Button>
            <Button type="primary" danger onClick={() => handleDelete(record)}>
              <DeleteOutlined />
            </Button>
          </Flex>
        );
      },
    },
  ];

  useEffect(() => {
    getChargeListData();
  }, []);

  return (
    <div className={styles.container}>
      <Flex justify="space-between" align="center">
        <h1 className={styles.title}>{t("chargeList.title")}</h1>
        <Button type="primary" onClick={() => handleAdd()}>
          <PlusOutlined />
          {t("normal.add")}
        </Button>
      </Flex>
      <Table
        dataSource={lists}
        columns={columns}
        pagination={false}
        scroll={{ x: "max-content", y: "80vh" }}
      />
      <ActionModal
        isOpen={isAddModalOpen}
        setIsOpen={setIsAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        mode={actionMode}
        item={selectedItem}
        getChargeListData={getChargeListData}
      />
    </div>
  );
};

export default ChargeList;

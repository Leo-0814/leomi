import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Collapse,
  Flex,
  message,
  Modal,
  Table,
  type CollapseProps,
} from "antd";
import type { ColumnType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { TYPE_OPTIONS } from "../../enumerations/chargeDetail";
import { ACTION_MODE } from "../../enumerations/utils";
import { deleteSettingsItem, getSettings } from "../../hooks/settings.hooks";
import type {
  SettingsDataType,
  SettingsItemType,
} from "../../interfaces/settings";
import { moneyFormat } from "../../plugins/numberFormat";
import { ActionModal } from "./components";

const Settings = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { confirm } = Modal;
  const [settings, setSettings] = useState<SettingsDataType>();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [actionMode, setActionMode] = useState<string>(ACTION_MODE.ADD);
  const [selectedItem, setSelectedItem] = useState<
    SettingsItemType | undefined
  >(undefined);
  const [activeKey, setActiveKey] = useState<string>("");

  const handleDelete = (item: SettingsItemType) => {
    console.debug("delete item", item);
    confirm({
      title: t("chargeList.delete.title"),
      icon: <ExclamationCircleFilled />,
      content: t("chargeList.delete.content"),
      okText: t("normal.yes"),
      okType: "danger",
      cancelText: t("normal.no"),
      onOk() {
        deleteSettingsItem({
          params: {
            type: activeKey,
            id: item.id,
            value: item.value,
          },
          options: {
            onSuccess: () => {
              message.success(t("normal.success"));
              getSettingsData();
            },
          },
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleEdit = (item: SettingsItemType) => {
    setActionMode(ACTION_MODE.EDIT);
    setIsAddModalOpen(true);
    setSelectedItem({ ...item, type: activeKey });
  };

  const columns: ColumnType<SettingsItemType>[] = [
    {
      title: t("normal.item"),
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
      title: t("normal.amount"),
      dataIndex: "value",
      key: "value",
      render: (value: number) => {
        return moneyFormat(value);
      },
    },
    {
      title: t("normal.action"),
      dataIndex: "action",
      key: "action",
      width: 60,
      render: (_, record) => {
        return (
          <div className="flex justify-center">
            <Button
              type="link"
              danger
              onClick={() => handleDelete(record)}
              style={{ padding: 0 }}
            >
              <DeleteOutlined />
            </Button>
          </div>
        );
      },
    },
  ];

  const getTable = (data: SettingsItemType[] | undefined) => {
    return (
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        scroll={{ x: "max-content", y: "40vh" }}
      />
    );
  };

  const items: CollapseProps["items"] = [
    {
      key: TYPE_OPTIONS.FIXED_INCOME,
      label: t("chargeDetail.fixed.income"),
      children: getTable(settings?.fixed_income),
      extra: moneyFormat(settings?.fixed_income_value || 0),
    },
    {
      key: TYPE_OPTIONS.FIXED_EXPENSES,
      label: t("chargeDetail.fixed.expenses"),
      children: getTable(settings?.fixed_expenses),
      extra: moneyFormat(settings?.fixed_expenses_value || 0),
    },
  ];

  const handleAdd = () => {
    setActionMode(ACTION_MODE.ADD);
    setIsAddModalOpen(true);
  };

  const getSettingsData = async () => {
    const data = await getSettings();
    if (!data) return;
    console.debug("settings", data);
    const needTranData = [
      TYPE_OPTIONS.FIXED_INCOME,
      TYPE_OPTIONS.FIXED_EXPENSES,
    ];
    needTranData.forEach((type: string) => {
      const newItem: SettingsItemType[] = [];
      if (Object.keys(data[type]).length > 0) {
        Object.keys(data[type]).map((key: string) => {
          const item = data[type][key];
          newItem.push({
            id: key,
            name: item?.name || "",
            value: item?.value || 0,
          });
        });
      }
      data[type] = newItem;
    });
    setSettings(data as SettingsDataType);
  };

  useEffect(() => {
    const fetchData = async () => {
      getSettingsData();
    };
    fetchData();
  }, [id]);

  return (
    <>
      <div className="flex flex-row items-center gap-2">
        {/* <LeftOutlined onClick={() => navigate(-1)} /> */}
        <div className="text-2xl">{t("normal.settings")}</div>
      </div>
      <div className="flex gap-4 text-2xl">
        <div>{t("settings.fixed.remainder")} :</div>
        <div
          className={`text-2xl flex-1 ${
            (settings?.total_value || 0) < 0 ? "text-red-500" : "text-green-600"
          }`}
        >
          {moneyFormat(settings?.total_value || 0)}
        </div>
        <Button type="primary" onClick={() => handleAdd()}>
          <PlusOutlined />
          {t("chargeDetail.add")}
        </Button>
      </div>
      {settings && (
        <Collapse
          accordion
          expandIconPlacement="end"
          items={items}
          styles={{ body: { padding: 0 } }}
          onChange={(key) => {
            setActiveKey(key[0] || "");
          }}
        />
      )}
      <ActionModal
        isOpen={isAddModalOpen}
        setIsOpen={setIsAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        mode={actionMode}
        item={selectedItem}
        getSettingsData={getSettingsData}
      />
    </>
  );
};

export default Settings;

import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  LeftOutlined,
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
import { useNavigate, useParams } from "react-router-dom";
import { TYPE_OPTIONS } from "../../enumerations/chargeDetail";
import { ACTION_MODE } from "../../enumerations/utils";
import {
  deleteChargeDetailItem,
  getChargeDetail,
} from "../../hooks/chargeDetail.hooks";
import type {
  ChargeDetailDataType,
  ChargeDetailItemType,
} from "../../interfaces/chargeDetail";
import { moneyFormat } from "../../plugins/numberFormat";
import { ActionModal } from "./components";

const ChargeDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { confirm } = Modal;
  const [chargeDetail, setChargeDetail] = useState<ChargeDetailDataType>();
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [actionMode, setActionMode] = useState<string>(ACTION_MODE.ADD);
  const [selectedItem, setSelectedItem] = useState<
    ChargeDetailItemType | undefined
  >(undefined);
  const [activeKey, setActiveKey] = useState<string>("");

  const handleDelete = (item: ChargeDetailItemType) => {
    console.debug("delete item", item);
    confirm({
      title: t("chargeList.delete.title"),
      icon: <ExclamationCircleFilled />,
      content: t("chargeList.delete.content"),
      okText: t("normal.yes"),
      okType: "danger",
      cancelText: t("normal.no"),
      onOk() {
        deleteChargeDetailItem({
          params: {
            parentId: id,
            type: activeKey,
            id: item.id,
            value: item.value,
          },
          options: {
            onSuccess: () => {
              message.success(t("normal.success"));
              getChargeDetailData();
            },
          },
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleEdit = (item: ChargeDetailItemType) => {
    setActionMode(ACTION_MODE.EDIT);
    setIsAddModalOpen(true);
    setSelectedItem({ ...item, type: activeKey });
  };

  const columns: ColumnType<ChargeDetailItemType>[] = [
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
      title: t("normal.date"),
      dataIndex: "date",
      key: "date",
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

  const getTable = (data: Record<string, ChargeDetailItemType> | undefined) => {
    return (
      <Table
        dataSource={Object.keys(data || {}).map((key: string) => {
          const item = data?.[key];
          return {
            id: key,
            name: item?.name || "",
            value: item?.value || 0,
            date: item?.date || "",
          };
        })}
        columns={columns}
        pagination={false}
        scroll={{ x: "max-content", y: "30vh" }}
      />
    );
  };

  const items: CollapseProps["items"] = [
    {
      key: TYPE_OPTIONS.FIXED_INCOME,
      label: t("chargeDetail.fixed.income"),
      children: getTable(
        chargeDetail?.fixed_income as
          | Record<string, ChargeDetailItemType>
          | undefined
      ),
      extra: moneyFormat(chargeDetail?.fixed_income_value || 0),
    },
    {
      key: TYPE_OPTIONS.FIXED_EXPENSES,
      label: t("chargeDetail.fixed.expenses"),
      children: getTable(
        chargeDetail?.fixed_expenses as
          | Record<string, ChargeDetailItemType>
          | undefined
      ),
      extra: moneyFormat(chargeDetail?.fixed_expenses_value || 0),
    },
    {
      key: TYPE_OPTIONS.DRIVER,
      label: t("chargeDetail.driver"),
      children: getTable(
        chargeDetail?.driver as Record<string, ChargeDetailItemType> | undefined
      ),
      extra: moneyFormat(chargeDetail?.driver_value || 0),
    },
    {
      key: TYPE_OPTIONS.FOOD,
      label: t("chargeDetail.food"),
      children: getTable(
        chargeDetail?.food as Record<string, ChargeDetailItemType> | undefined
      ),
      extra: moneyFormat(chargeDetail?.food_value || 0),
    },
    {
      key: TYPE_OPTIONS.OTHER,
      label: t("chargeDetail.other"),
      children: getTable(
        chargeDetail?.other as Record<string, ChargeDetailItemType> | undefined
      ),
      extra: moneyFormat(chargeDetail?.other_value || 0),
    },
  ];

  const handleAdd = () => {
    setActionMode(ACTION_MODE.ADD);
    setIsAddModalOpen(true);
  };

  const getChargeDetailData = async () => {
    const data = await getChargeDetail({ params: { id } });
    console.debug("charge detail", data);
    setChargeDetail(data as ChargeDetailDataType);
  };

  useEffect(() => {
    const fetchData = async () => {
      getChargeDetailData();
    };
    fetchData();
  }, [id]);

  return (
    <div className="w-[90%] mx-auto py-8 min-h-screen flex flex-col gap-4">
      <div className="flex flex-row items-center gap-2">
        <LeftOutlined onClick={() => navigate(-1)} />
        <div className="text-2xl">{chargeDetail?.name}</div>
      </div>
      <div className="flex gap-4 text-2xl">
        <div>{t("chargeDetail.summary")} :</div>
        <div
          className={`text-2xl flex-1 ${
            (chargeDetail?.total_value || 0) < 0
              ? "text-red-500"
              : "text-green-600"
          }`}
        >
          {moneyFormat(chargeDetail?.total_value || 0)}
        </div>
        <Button type="primary" onClick={() => handleAdd()}>
          <PlusOutlined />
          {t("chargeDetail.add")}
        </Button>
      </div>
      {chargeDetail && (
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
        getChargeDetailData={getChargeDetailData}
      />
    </div>
  );
};

export default ChargeDetail;

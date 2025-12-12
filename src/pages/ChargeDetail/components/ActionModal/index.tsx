import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
} from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { TYPE_OPTIONS } from "../../../../enumerations/chargeDetail";
import { ACTION_MODE } from "../../../../enumerations/utils";
import {
  addChargeDetailItem,
  editChargeDetailItem,
} from "../../../../hooks/chargeDetail.hooks";
import type {
  ChargeDetailItemParamsType,
  ChargeDetailItemType,
} from "../../../../interfaces/chargeDetail";

const ActionModal = ({
  isOpen,
  setIsOpen,
  onCancel,
  mode,
  item,
  getChargeDetailData,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onCancel: () => void;
  mode: string;
  item: ChargeDetailItemType | undefined;
  getChargeDetailData: () => void;
}) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [form] = Form.useForm();

  const modeEnum = {
    [ACTION_MODE.ADD]: {
      title: t("chargeList.add.title"),
      onFinish: addChargeDetailItem,
    },
    [ACTION_MODE.EDIT]: {
      title: t("chargeList.edit.title"),
      onFinish: editChargeDetailItem,
    },
  };

  const options = [
    { label: t("chargeDetail.driver"), value: TYPE_OPTIONS.DRIVER },
    { label: t("chargeDetail.food"), value: TYPE_OPTIONS.FOOD },
    { label: t("chargeDetail.other"), value: TYPE_OPTIONS.OTHER },
    { label: t("chargeDetail.fixed.income"), value: TYPE_OPTIONS.FIXED_INCOME },
    {
      label: t("chargeDetail.fixed.expenses"),
      value: TYPE_OPTIONS.FIXED_EXPENSES,
    },
  ];

  const handleFinish = (values: ChargeDetailItemParamsType) => {
    const finalParams = {
      id: item?.id,
      parentId: id,
      name: values.name,
      type: values.type,
      date: dayjs(values.date).format("YYYY-MM-DD"),
      value: values.value,
    };
    console.debug(finalParams);
    modeEnum[mode].onFinish({
      params: finalParams,
      options: {
        onSuccess: () => {
          message.success(t("normal.success"));
          setIsOpen(false);
          form.resetFields();
          getChargeDetailData();
        },
        onError: () => {
          message.error(t("normal.error"));
        },
      },
    });
  };

  useEffect(() => {
    if (!isOpen) {
      form.resetFields();
      return;
    }
    console.debug("item", item);
    if (item && mode === ACTION_MODE.EDIT) {
      form.setFieldsValue({
        ...item,
        date: dayjs(item.date || ""),
      });
    }
  }, [item, isOpen, mode, form]);

  return (
    <Modal
      open={isOpen}
      onCancel={onCancel}
      onOk={() => form.submit()}
      destroyOnHidden
      okText={t("normal.confirm")}
      cancelText={t("normal.cancel")}
      okButtonProps={{
        type: "primary",
      }}
      cancelButtonProps={{
        type: "default",
      }}
    >
      <h2 className="text-xl mb-4">{modeEnum[mode].title}</h2>
      <Form form={form} onFinish={handleFinish}>
        <Form.Item
          name="type"
          label={t("normal.type")}
          initialValue={TYPE_OPTIONS.FOOD}
          rules={[{ required: true, message: t("normal.input.required") }]}
        >
          <Select
            placeholder={t("normal.select.placeholder", {
              name: t("normal.type"),
            })}
            options={options}
            disabled={mode === ACTION_MODE.EDIT}
          />
        </Form.Item>
        <Form.Item
          name="name"
          label={t("normal.item")}
          rules={[{ required: true, message: t("normal.input.required") }]}
        >
          <Input
            placeholder={t("normal.input.placeholder", {
              name: t("normal.item"),
            })}
          />
        </Form.Item>
        <Form.Item
          name="date"
          label={t("normal.date")}
          initialValue={dayjs()}
          rules={[{ required: true, message: t("normal.input.required") }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            placeholder={t("normal.select.placeholder", {
              name: t("normal.date"),
            })}
          />
        </Form.Item>
        <Form.Item
          name="value"
          label={t("normal.amount")}
          rules={[{ required: true, message: t("normal.input.required") }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder={t("normal.input.placeholder", {
              name: t("normal.amount"),
            })}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ActionModal;

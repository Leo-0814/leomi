import { Form, Input, InputNumber, message, Modal, Select } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { TYPE_OPTIONS } from "../../../../enumerations/chargeDetail";
import { ACTION_MODE } from "../../../../enumerations/utils";
import {
  addSettingsItem,
  editSettingsItem,
} from "../../../../hooks/settings.hooks";
import type {
  SettingsItemParamsType,
  SettingsItemType,
} from "../../../../interfaces/settings";

const ActionModal = ({
  isOpen,
  setIsOpen,
  onCancel,
  mode,
  item,
  getSettingsData,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onCancel: () => void;
  mode: string;
  item: SettingsItemType | undefined;
  getSettingsData: () => void;
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const modeEnum = {
    [ACTION_MODE.ADD]: {
      title: t("chargeList.add.title"),
      onFinish: addSettingsItem,
    },
    [ACTION_MODE.EDIT]: {
      title: t("chargeList.edit.title"),
      onFinish: editSettingsItem,
    },
  };

  const options = [
    { label: t("chargeDetail.fixed.income"), value: TYPE_OPTIONS.FIXED_INCOME },
    {
      label: t("chargeDetail.fixed.expenses"),
      value: TYPE_OPTIONS.FIXED_EXPENSES,
    },
  ];

  const handleFinish = (values: SettingsItemParamsType) => {
    const finalParams = {
      id: item?.id,
      name: values.name,
      type: values.type,
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
          getSettingsData();
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
          initialValue={TYPE_OPTIONS.FIXED_EXPENSES}
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
            autoFocus
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

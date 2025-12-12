import { Form, Input, message, Modal } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ACTION_MODE } from "../../../../enumerations/utils";
import {
  addChargeItem,
  editChargeItem,
} from "../../../../hooks/chargeList.hooks";
import type { ChargeListDataType } from "../../../../interfaces/chargeList";

const ActionModal = ({
  isOpen,
  setIsOpen,
  onCancel,
  mode,
  item,
  getChargeListData,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onCancel: () => void;
  mode: string;
  item: ChargeListDataType | undefined;
  getChargeListData: () => void;
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const modeEnum = {
    [ACTION_MODE.ADD]: {
      title: t("chargeList.add.title"),
      onFinish: addChargeItem,
    },
    [ACTION_MODE.EDIT]: {
      title: t("chargeList.edit.title"),
      onFinish: editChargeItem,
    },
  };

  const handleFinish = (values: { name: string }) => {
    modeEnum[mode].onFinish({
      params: { id: item?.id, name: values.name },
      options: {
        onSuccess: () => {
          message.success(t("normal.success"));
          setIsOpen(false);
          form.resetFields();
          getChargeListData();
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
    if (item && mode === ACTION_MODE.EDIT) {
      form.setFieldsValue({ name: item.name });
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
          name="name"
          label={t("normal.name")}
          rules={[{ required: true, message: t("normal.input.required") }]}
        >
          <Input
            placeholder={t("normal.input.placeholder", {
              name: t("normal.name"),
            })}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ActionModal;

import { Form, Input, Modal } from "antd";
import { useTranslation } from "react-i18next";

const AddModal = ({
  isOpen,
  onCancel,
}: {
  isOpen: boolean;
  onCancel: () => void;
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
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
      <h2 className="text-xl mb-4">{t("chargeList.add.title")}</h2>
      <Form form={form}>
        <Form.Item
          name="name"
          label={t("normal.name")}
          rules={[{ required: true, message: t("normal.input.required") }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddModal;

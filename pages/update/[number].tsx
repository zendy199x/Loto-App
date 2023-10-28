import { ILoto } from "@/interfaces/loto.interface";
import { customFormValidator } from "@/utils";
import { Button, Form, Input, Layout, Typography, message } from "antd";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const CKEditorComponent = dynamic(() => import("@/components/ck-editor"), {
  ssr: false,
});

const { Content } = Layout;
const { Title } = Typography;

export default function Update() {
  const router = useRouter();
  const [form] = Form.useForm();
  const { number } = router.query;

  const [lotos, setLotos] = useState<ILoto[]>([]);

  const lotoData = lotos.find((loto: ILoto) => loto.number === number);

  useEffect(() => {
    fetchLotoList();
  }, []);

  const fetchLotoList = async () => {
    try {
      const response = await axios.get("/api/get");

      if (response.status === 200) {
        const { lotos } = response.data;
        setLotos(lotos);
      } else {
        console.error("An error occurred while fetching data.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveLotoNumber = async () => {
    try {
      const values = await form.validateFields();

      const newValues = {
        ...values,
        number: parseInt(values.number).toString(),
      };

      const checkExist = lotos.some((loto) => loto.number === newValues.number);

      if (!checkExist) {
        message.warning("This loto number was not found.");
        return;
      }

      const response = await fetch(`/api/update?number=${number}`, {
        method: "PUT",
        body: JSON.stringify(newValues),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        message.success("Update loto number successfully.");
        router.push("/");
      } else {
        message.error("An error occurred while updating loto.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  form.setFieldsValue(lotoData);

  return (
    <Content>
      <div className="p-6">
        <Title
          level={2}
          className="text-center cursor-pointer text-primary-orange"
          onClick={() => router.push("/")}
        >
          Edit Loto Number
        </Title>
        <Form form={form} onFinish={handleSaveLotoNumber}>
          <Form.Item
            name="number"
            label="Number"
            rules={[
              { required: true, message: "Please enter a number" },
              {
                type: "number",
                transform: (value: string) => Number(value),
                message: "Please enter a valid number!",
              },
              {
                validator: customFormValidator(
                  (value: number) => Number(value) >= 1 && Number(value) <= 100,
                  "Loto numbers must be from 1 to 99"
                ),
              },
            ]}
          >
            <Input disabled={true} placeholder="Number" />
          </Form.Item>
          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: "Please enter content" }]}
          >
            <CKEditorComponent
              data={lotoData?.content ?? ""}
              onChange={() => {}}
            />
          </Form.Item>
          <Form.Item className="text-center">
            <Button type="primary" htmlType="submit">
              Update Loto Number
            </Button>
          </Form.Item>
        </Form>
        <div className="text-center">
          <Button onClick={() => router.push("/")}>Back To Home</Button>
        </div>
      </div>
    </Content>
  );
}

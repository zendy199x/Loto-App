import { ILoto } from "@/interfaces/loto.interface";
import { Button, Col, Layout, Typography, Row, List, Spin } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { convertHtmlStringToArr } from "@/utils";
import { EditOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Title } = Typography;
const lotoNumbers = Array(10).fill(0);

export default function Home() {
  const router = useRouter();
  const [lotos, setLotos] = useState<ILoto[]>([]);
  const [currentNumber, setCurrentNumber] = useState("1");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchLotoList();
  }, []);

  const fetchLotoList = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/get");

      if (response.status === 200) {
        setIsLoading(false);
        const { lotos } = response.data;
        setLotos(lotos);
      } else {
        setIsLoading(false);
        console.error("An error occurred while fetching data.");
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const handleClickLotoNumber = (index: number) => () => {
    setCurrentNumber(index.toString());
    contentRef.current?.scrollTo(0, 0);
  };

  const data = lotos.find((e) => e.number === currentNumber);

  if (!data) {
    return;
  }

  return (
    <Spin spinning={isLoading}>
      <Content>
        <div style={{ padding: "8px" }}>
          <Title
            level={4}
            className="text-center cursor-pointer text-primary-orange"
            onClick={() => router.push("/")}
          >
            Loto App - JS Team
          </Title>
          <Row style={{ height: "calc(100vh - 70px)" }}>
            <Col span={6} dir="horizontal">
              {lotoNumbers.map((_, index) => {
                const num = index + 1;
                return (
                  <Row
                    key={index}
                    style={{ height: "10%", width: 72 }}
                    align="middle"
                    justify="space-between"
                  >
                    <Button
                      type={+currentNumber === num ? "primary" : "default"}
                      style={{
                        width: 48,
                        background: +currentNumber === num ? "#3F96FE" : "#fff",
                      }}
                      onClick={handleClickLotoNumber(num)}
                    >
                      {num}
                    </Button>
                    <EditOutlined
                      height={16}
                      onClick={() => router.push(`/update/${num}`)}
                    />
                  </Row>
                );
              })}
            </Col>
            <Col
              span={18}
              className="pl-2 overflow-y-auto"
              style={{ height: "calc(100vh - 70px)" }}
              id="content"
              ref={contentRef}
            >
              <List
                bordered
                dataSource={convertHtmlStringToArr(data!.content)}
                renderItem={(item) => (
                  <List.Item style={{ padding: 12 }}>
                    <div
                      className="text-black"
                      dangerouslySetInnerHTML={{
                        __html: item,
                      }}
                    />
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </div>
      </Content>
    </Spin>
  );
}

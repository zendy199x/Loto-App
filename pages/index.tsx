import { ILoto } from "@/interfaces/loto.interface";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Input,
  Layout,
  List,
  Menu,
  Space,
  Typography,
  message,
} from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const { Content } = Layout;
const { Title } = Typography;

export default function Home() {
  const router = useRouter();
  const [currentNumber, setCurrentNumber] = useState<string>("0");
  const [searchText, setSearchText] = useState("");
  const [lotos, setLotos] = useState<ILoto[]>([]);
  const [sortedLotos, setSortedLotos] = useState<ILoto[]>(lotos);

  useEffect(() => {
    fetchLotoList();
  }, []);

  useEffect(() => {
    const sorted = [...lotos].sort((a, b) => {
      const numA = parseInt(a.number, 10);
      const numB = parseInt(b.number, 10);
      return numA - numB;
    });

    setSortedLotos(sorted);
  }, [lotos]);

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

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleDelete = async (number: string) => {
    try {
      const response = await axios.delete(`/api/delete?number=${number}`);

      if (response.status === 200) {
        message.success("Record deleted successfully.");
        fetchLotoList();
      } else {
        message.error("An error occurred while deleting the record.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const options = [
    {
      key: "edit",
      title: "Edit",
      action: () => router.push(`/update/${currentNumber}`),
    },
    {
      key: "delete",
      title: "Delete",
      action: () => handleDelete(currentNumber),
    },
  ];

  const menu = (
    <Menu className="action-btn-menu">
      {options.map(({ key, title, action }) => {
        return (
          <Col key={key}>
            {true && (
              <Menu.Item key={key} onClick={action}>
                {title}
              </Menu.Item>
            )}
          </Col>
        );
      })}
    </Menu>
  );

  return (
    <Content>
      <div className="p-6">
        <Title
          level={2}
          className="text-center cursor-pointer text-primary-orange"
          onClick={() => router.push("/")}
        >
          Loto App - JS Team
        </Title>
        <div className="text-end">
          <Button type="primary" onClick={() => router.push("/create")}>
            Crew New Loto Number
          </Button>
        </div>
        <br />
        <br />
        <Input
          placeholder="Enter a number (1 - 99)"
          onChange={(e) => handleSearch(e.target.value)}
        />
        <br />
        <br />
        <Col className="font-bold text-primary-blue">
          {`Currently viewing ${
            sortedLotos.filter((loto) => loto.number.includes(searchText))
              .length
          } out of ${lotos.length} records`}
        </Col>
        <List
          itemLayout="horizontal"
          dataSource={sortedLotos.filter((loto) =>
            loto.number.includes(searchText)
          )}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <div className="flex justify-between items-center	">
                    <div className="w-12 h-12 flex justify-center items-center text-primary-orange font-bold text-3xl border border-primary-orange rounded">
                      {item.number}
                    </div>
                    <Dropdown
                      overlay={menu}
                      arrow={true}
                      trigger={["click"]}
                      placement="bottomRight"
                    >
                      <Button
                        htmlType="button"
                        type="primary"
                        onClick={() => setCurrentNumber(item.number)}
                      >
                        Action
                      </Button>
                    </Dropdown>
                  </div>
                }
                description={
                  <Card>
                    <Space className="w-full flex justify-between">
                      <div
                        className="text-black text-lg"
                        dangerouslySetInnerHTML={{
                          __html: item?.content ?? "",
                        }}
                      />
                    </Space>
                  </Card>
                }
              />
            </List.Item>
          )}
        />
      </div>
    </Content>
  );
}

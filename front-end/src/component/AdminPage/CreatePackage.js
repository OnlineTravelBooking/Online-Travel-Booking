import React, { useEffect, useState } from "react";
import ApprovePage from "./ApprovePage";
import { GET_PACKAGES } from "../../Graphql";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import {
  DesktopOutlined,
  FileOutlined,
  PlusCircleFilled,
} from "@ant-design/icons";
import { Layout, Menu, theme, Card, Row, Col } from "antd";

const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem("Create Package", "1", <PlusCircleFilled />),
  getItem("Verify Slip", "2", <DesktopOutlined />),
  getItem("Approved List", "3", <FileOutlined />),
];
export default function CreatePackage() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { Meta } = Card;

  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_PACKAGES);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    if (data && data.packages) {
      const mapData = data.packages.map((item) => ({
        documentId: item.documentId,
        Price: item.Price,
        Title: item.Title,
        Type: item.Type,
        urlImage: item.Image[0].url,
        Description: item.Description,
        MeetingPoint: item.MeetingPoint,
      }));
      setDataSource(mapData);
    }
  }, [data]);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        />
        <Content
          style={{
            margin: "0 16px",
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Row gutter={[16, 16]} style={{ padding: "24px" }}>
              {dataSource.map((item) => (
                <Col xs={24} sm={12} md={8} lg={6} key={item.documentId}>
                  <Card
                    hoverable
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                    cover={
                      <img
                        alt={item.Title}
                        src={`http://localhost:1337${item.urlImage}`}
                        style={{
                          height: "200px",
                          objectFit: "cover",
                        }}
                      />
                    }
                    onClick={() => {
                      navigate("/admin/approve", {
                        state: {
                          documentId: item.documentId,
                          Title: item.Title,
                          Price: item.Price,
                          Type: item.Type,
                          Description: item.Description,
                          MeetingPoint: item.MeetingPoint,
                        },
                      });
                    }}
                  >
                    <Meta
                      title={item.Title}
                      description={
                        <>
                          <div>{item.Type}</div>
                          <div style={{ color: "#FF0000" }}>${item.Price}</div>
                        </>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
}

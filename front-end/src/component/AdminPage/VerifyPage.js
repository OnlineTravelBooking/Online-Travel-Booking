import React from "react";
import { Layout, theme, Row, Col, Card } from "antd";
import Sidebar from "./Sidebar";
import { GET_PACKAGES } from "../../Graphql";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
const { Header, Content } = Layout;
const { Meta } = Card;
export default function VerifyPage() {
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  //ดึง package มา
  const { loading: loading_package, error: error_package, data: data_package } = useQuery(GET_PACKAGES);
  //กรองเฉพาะที่มีการ booking
  const packageWithBooking = data_package?.packages?.filter((pkg) => pkg.bookings && pkg.bookings.length > 0) || [];

  if (loading_package) {
    return <div>Loading...</div>;
  }
  if (error_package) {
    return <div>Error: {error_package.message}</div>;
  }
  console.log("img", packageWithBooking);
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "0 16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Row gutter={[16, 16]} style={{ padding: "24px" }}>
              {packageWithBooking.map((item) => (
                <Col xs={24} sm={12} md={8} lg={6} key={item.documentId}>
                  <Card
                    hoverable
                    style={{ width: "100%", height: "100%" }}
                    cover={
                      <img
                        alt={item.Title}
                        src={`http://localhost:1337${item.Image[0].url}`}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    }
                    onClick={() => navigate("/admin/approve", { state: { ...item } })}
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
            <div>Verify YAY!</div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

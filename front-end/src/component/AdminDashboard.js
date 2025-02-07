import React from "react";
import { Card, Layout, Typography, Row, Col } from "antd";
import { EditOutlined, CheckCircleOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

const AdminDashboard = () => {
  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f8f8f8" }}>
      <Header
        style={{
          background: "linear-gradient(to right, #91c1c1, #5c9e9e)",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <Title style={{ color: "#fff", margin: 0 }}>
          Welcome to the Admin Dashboard!
        </Title>
      </Header>

      <Content style={{ padding: "50px", textAlign: "center" }}>
        <Paragraph style={{ fontSize: "16px", color: "#555" }}>
          Manage tours, review bookings, and streamline operations with ease.
          Use the options below to update tour details, verify payments, and
          approve reservations efficiently.
        </Paragraph>

        <Row gutter={[24, 24]} justify="center" style={{ marginTop: "30px" }}>
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              style={{ backgroundColor: "#d3ecec", padding: "20px" }}
              cover={
                <EditOutlined style={{ fontSize: "40px", margin: "20px 0" }} />
              }
            >
              <Title level={3}>Manage Tour</Title>
              <Paragraph>
                Add, edit, and delete tours, set prices, and manage tour
                details.
              </Paragraph>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              style={{ backgroundColor: "#d3ecec", padding: "20px" }}
              cover={
                <CheckCircleOutlined
                  style={{ fontSize: "40px", margin: "20px 0" }}
                />
              }
            >
              <Title level={3}>Booking Approval</Title>
              <Paragraph>
                Review bookings, verify payments, and approve/reject
                reservations.
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default AdminDashboard;

import React from "react";
import { Layout, Typography, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Title } = Typography;

export default function EditPackage() {
  return (
    <Layout style={{ backgroundColor: "#FFF6ee" }}>
      <Content style={{ padding: "20px" }}>
        <Title level={2}>รายชื่อทัวร์</Title>
        <Link to="/">
          <Button type="primary" icon={<PlusOutlined />}>
            กลับไปที่ Dashboard
          </Button>
        </Link>
      </Content>
    </Layout>
  );
}

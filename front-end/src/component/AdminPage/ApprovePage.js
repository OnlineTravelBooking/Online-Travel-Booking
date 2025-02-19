import React from "react";
import { Layout, theme } from "antd";
import Sidebar from "./Sidebar";

const { Header, Content } = Layout;

export default function ApprovePage() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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
            <div>ApprovePage Content Here!</div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

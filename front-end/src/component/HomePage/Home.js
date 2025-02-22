import React, { useState } from "react";
import { UserHeader } from "../Header/UserHeader";
import { useAuth } from "../../AuthContext";
import PackageCard from "./PackageCard";
import SiderFilter from "./Filter";
import Slide from "./Slide-img";
import { Layout } from "antd";

const { Header, Footer, Sider, Content } = Layout;

const footerStyle = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#4096ff",
};

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [filters, setFilters] = useState({});

  return (
    <Layout>
      <Header>
        <UserHeader />
      </Header>
      <Layout>
        <Slide />
      </Layout>
      <Layout>
        <Sider width="20%">
          <SiderFilter onFilter={setFilters} />
        </Sider>
        <Content>
          {<PackageCard /> ? (
            <PackageCard filters={filters} />
          ) : (
            <h1>No Package Data</h1>
          )}
        </Content>
      </Layout>
      <Footer style={footerStyle}>Footer</Footer>
    </Layout>
  );
}

import React, { useState } from "react";
import { UserHeader } from "../Header/UserHeader";
import { useAuth } from "../../AuthContext";
import PackageCard from "./PackageCard";
import Filter_Button from "./Filter";
import PriceFilter from "./PriceFilter";
import SlideImg from "./SlideImg";
import { Layout } from "antd";
import CustomFooter from "./Footer";

const { Footer, Sider, Content } = Layout;

const footerStyle = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#4096ff",
};

export default function Home() {
  const [filters, setFilters] = useState({});
  const [searchTitle, setSearchTitle] = useState("");

  const mergeFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <Layout>
      <UserHeader />
      <Layout>
        <SlideImg onSearch={(title) => setSearchTitle(title)} />
      </Layout>
      <Layout>
        <Sider width="20%">
          <PriceFilter onFilter={mergeFilters} />
        </Sider>
        <Content className="Main-Content">
          <Filter_Button onFilter={mergeFilters} />
          {<PackageCard /> ? <PackageCard filters={{ ...filters, searchTitle }} /> : <h1>No Package Data</h1>}
        </Content>
      </Layout>
      <CustomFooter />
    </Layout>
  );
}

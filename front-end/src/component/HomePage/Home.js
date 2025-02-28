import React, { useState } from "react";
import { UserHeader } from "../Header/UserHeader";
import { useAuth } from "../../AuthContext";
import PackageCard from "./PackageCard";
import FilterButton from "./FilterButton";
import PriceFilter from "./PriceFilter";
import SlideImg from "./SlideImg";
import { Layout } from "antd";
import CustomFooter from "./Footer";
import BackToTop from "./back";

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
        <Content className="Main-Content">
          <FilterButton onFilter={mergeFilters} />
          {<PackageCard /> ? <PackageCard filters={{ ...filters, searchTitle }} /> : <h1>No Package Data</h1>}
        </Content>
        <Sider className="Filter-Box" width="20%">
          <PriceFilter onFilter={mergeFilters} />
        </Sider>
      </Layout>
      <BackToTop />
      <CustomFooter />
    </Layout>
  );
}

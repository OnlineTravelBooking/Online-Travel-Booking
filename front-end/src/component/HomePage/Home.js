import React from "react";
import { UserHeader, LoggedIn } from "../Header";
import { Layout, Menu } from "antd";
import { useAuth } from "../../AuthContext";
import PackageCard from "./PackageCard";

const { Header } = Layout;
export default function Home() {
  const { Header } = Layout;
  const { isAuthenticated } = useAuth();

  console.log("Auth: ", isAuthenticated);
  if (!isAuthenticated) {
    return (
      <div>
        <Layout>
          <Header>
            <UserHeader />
          </Header>
        </Layout>

        <div>
          <h1>Home YAY!</h1>
          <PackageCard />
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <Layout>
          <Header>
            <LoggedIn />
          </Header>
        </Layout>
        <div>
          <PackageCard />
        </div>
      </div>
    );
  }
}

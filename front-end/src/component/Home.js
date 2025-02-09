import React from "react";
import { UserHeader, LoggedIn } from "./Header";
import { Layout, Menu } from "antd";
import { useAuth } from "../AuthContext";
const { Header } = Layout;

export default function Home() {
  const { isAuthenticated } = useAuth();

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
          <h1>Home YAY!</h1>
        </div>
      </div>
    );
  }
}

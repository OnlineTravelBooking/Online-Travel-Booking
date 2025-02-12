import React from "react";
import { Menu, Layout } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { FormOutlined, FileTextOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
const { Header } = Layout;

export const UserHeader = () => {
  const navigate = useNavigate();
  const { isAuthenticated, data, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div>
        <Layout>
          <Header>
            <div className="container-fluid">
              <div className="header">
                <div className="logo" />
                <Menu
                  theme="dark"
                  mode="horizontal"
                  defaultSelectedKeys={["2"]}
                >
                  <Menu.Item key="1">nav 1</Menu.Item>
                  <Menu.Item key="2">nav 2</Menu.Item>
                  <Menu.Item
                    key="3"
                    style={{ marginLeft: "auto" }}
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    <UserOutlined /> เข้าสู่ระบบ
                  </Menu.Item>
                  <Menu.Item
                    key="4"
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    <FormOutlined /> ลงทะเบียน
                  </Menu.Item>
                </Menu>
              </div>
            </div>
          </Header>
        </Layout>
      </div >
    );
  } else {
    return (
      <div>
        <Layout>
          <Header>
            <div className="container-fluid">
              <div className="header">
                <div className="logo" />
                <Menu
                  theme="dark"
                  mode="horizontal"
                  defaultSelectedKeys={["2"]}
                >
                  <Menu.Item key="1">nav 1</Menu.Item>
                  <Menu.Item key="2">nav 2</Menu.Item>
                  <Menu.Item key="3" style={{ marginLeft: "auto" }} ><FileTextOutlined /> ตรวจสอบสถานะการจองทัวร์</Menu.Item>
                  <Menu.Item key="4" ><FileTextOutlined /> ตรวจสอบสถานะการจองทัวร์</Menu.Item>
                  <Menu.SubMenu
                    key="user"
                    title={
                      <span>
                        <UserOutlined />{" "}
                        {data?.username || "User"} {/* Display username or fallback to 'User' */}
                      </span>
                    }
                  >
                    <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
                      ออกจากระบบ
                    </Menu.Item>
                  </Menu.SubMenu>
                </Menu>
              </div>
            </div>
          </Header>
        </Layout>
      </div>
    );
  }
};

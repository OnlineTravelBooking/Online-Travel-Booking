import React from "react";
import { Menu, Layout } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
const { Header } = Layout;

export const UserHeader = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

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
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    Login
                  </Menu.Item>
                </Menu>
              </div>
            </div>
          </Header>
        </Layout>
      </div>
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
                  <Menu.SubMenu
                    key="user"
                    title={
                      <span>
                        <UserOutlined />
                        {user?.username || "User"} {/* Display username or fallback to 'User' */}
                      </span>
                    }
                    style={{ marginLeft: "auto" }} // Push to the right
                  >
                    <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
                      Logout
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

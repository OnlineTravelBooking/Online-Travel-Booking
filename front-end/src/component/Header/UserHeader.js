import React, { useEffect, useState } from "react";
import { Menu, Layout } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import {
  FormOutlined,
  FileTextOutlined,
  LogoutOutlined,
  UserOutlined,
  HomeOutlined,
} from "@ant-design/icons";
const { Header } = Layout;

export const UserHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, data } = useAuth();
  const [fullName, setFullName] = useState("User"); // ชื่อผู้ใช้

  // ดึงชื่อผู้ใช้จาก sessionStorage
  useEffect(() => {
    if (data) {
      try {
        if (data.Fname && data.Lname) {
          setFullName(`${data.Fname} ${data.Lname}`);
        }
      } catch (error) {
        console.error("Error parsing userData from sessionStorage:", error);
      }
    }
  }, [data]);

  if (!isAuthenticated) {
    return (
      <Layout>
        <Header>
          <div className="container-fluid">
            <div className="header">
              <div className="logo" />
              <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
                <Menu.Item
                  key="3"
                  style={{ marginLeft: "auto" }}
                  onClick={() => navigate("/login")}
                >
                  <UserOutlined /> เข้าสู่ระบบ
                </Menu.Item>
                <Menu.Item key="4" onClick={() => navigate("/login")}>
                  <FormOutlined /> ลงทะเบียน
                </Menu.Item>
              </Menu>
            </div>
          </div>
        </Header>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <Header>
          <div className="container-fluid">
            <div className="header">
              <div className="logo" />
              <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
                <Menu.Item
                  key="3"
                  style={{ marginLeft: "auto" }}
                  onClick={() =>
                    navigate(location.pathname === "/status" ? "/" : "/status")
                  }
                >
                  {location.pathname === "/status" ? (
                    <>
                      <HomeOutlined /> Home
                    </>
                  ) : (
                    <>
                      <FileTextOutlined /> ตรวจสอบสถานะการจองทัวร์
                    </>
                  )}
                </Menu.Item>
                <Menu.SubMenu
                  key="user"
                  title={
                    <span>
                      <UserOutlined /> {fullName}
                    </span>
                  }
                >
                  <Menu.Item
                    key="logout"
                    icon={<LogoutOutlined />}
                    onClick={logout}
                  >
                    ออกจากระบบ
                  </Menu.Item>
                </Menu.SubMenu>
              </Menu>
            </div>
          </div>
        </Header>
      </Layout>
    );
  }
};

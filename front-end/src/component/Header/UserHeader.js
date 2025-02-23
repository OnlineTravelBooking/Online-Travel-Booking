import React, { useEffect, useState } from "react";
import { Menu, Layout } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { FormOutlined, FileTextOutlined, LogoutOutlined, UserOutlined, HomeOutlined } from "@ant-design/icons";
const { Header } = Layout;

export const UserHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, data } = useAuth();
  const [fullName, setFullName] = useState("User"); // ชื่อผู้ใช้
  const [menuItems, setMenuItems] = useState([]);

  // ดึงชื่อผู้ใช้จาก sessionStorage
  useEffect(() => {
    if (data?.Fname && data?.Lname) {
      setFullName(`${data.Fname} ${data.Lname}`);
    }
  }, [data]);

  useEffect(() => {
    if (!isAuthenticated) {
      setMenuItems([
        {
          key: "login",
          label: "เข้าสู่ระบบ",
          icon: <UserOutlined />,
          onClick: () => navigate("/login"),
          style: { marginLeft: "auto" },
        },
        {
          key: "register",
          label: "ลงทะเบียน",
          icon: <FormOutlined />,
          onClick: () => navigate("/login"),
        },
      ]);
    } else {
      setMenuItems([
        {
          key: "nav-toggle",
          label:
            location.pathname === "/status" ? (
              <>
                <HomeOutlined /> Home
              </>
            ) : (
              <>
                <FileTextOutlined /> ตรวจสอบสถานะการจองทัวร์
              </>
            ),
          onClick: () => navigate(location.pathname === "/status" ? "/" : "/status"),
          style: { marginLeft: "auto" },
        },
        {
          key: "user-menu",
          label: (
            <span>
              <UserOutlined /> {fullName}
            </span>
          ),
          children: [
            {
              key: "logout",
              label: "ออกจากระบบ",
              icon: <LogoutOutlined />,
              onClick: logout,
            },
          ],
        },
      ]);
    }
  }, [isAuthenticated, location.pathname, fullName, navigate, logout]);

  return (
    <Header>
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]} items={menuItems} />
    </Header>
  );
};

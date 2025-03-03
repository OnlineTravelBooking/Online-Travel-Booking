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
  HeartOutlined, // เพิ่ม icon สำหรับ Favorite
} from "@ant-design/icons";

const { Header } = Layout;

export const UserHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, data } = useAuth();
  const [fullName, setFullName] = useState("User");
  const [menuItems, setMenuItems] = useState([]);
  const images = ["southtex_logo.png"];

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
          onClick: () => navigate("/register"),
        },
      ]);
    } else {
      setMenuItems([
        //
        {
          key: "favorite",
          label:
            location.pathname === "/favorite" ? (
              <>
                <HomeOutlined /> Home
              </>
            ) : (
              <>
                <HeartOutlined /> Favorite package
              </>
            ),
          onClick: () =>
            navigate(location.pathname === "/favorite" ? "/" : "/favorite"),
          style: { marginLeft: "auto" },
        },
        //
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
          onClick: () =>
            navigate(location.pathname === "/status" ? "/" : "/status"),
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
    <Header className="Header-user">
      <img src={images[0]} alt="Sothtex Logo" className="Logo-header" />
      <div className="Header-title"> SOUTHEX </div>
      <Menu
        className="Menu-user"
        mode="horizontal"
        defaultSelectedKeys={["2"]}
        items={menuItems}
      />
    </Header>
  );
};
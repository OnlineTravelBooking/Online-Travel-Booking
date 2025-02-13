import React, { useEffect, useState } from "react";
import { Layout, Typography, Menu, Button, Dropdown } from "antd";
import { FileTextOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../../AuthContext";

const { Header } = Layout;
const { Title } = Typography;

export default function AdminHeader() {
    const [adminName, setAdminName] = useState("Admin A");
    const { logout, data } = useAuth();

    // ดึงข้อมูลชื่อผู้ใช้จาก sessionStorage
    useEffect(() => {
        if (data) {
            try {
                if (data.Fname && data.Lname) {
                    setAdminName(`${data.Fname} ${data.Lname}`);
                }
            } catch (error) {
                console.error("Error parsing userData from sessionStorage:", error);
            }
        }
    }, [data]);


    return (
        <Header className="admin-header">
            <div className="container-fluid" style={{ display: "flex", alignItems: "center" }}>
                <img src="/southtex_logo.png" alt="SOUTHEX" className="admin-logo" />
                <Title level={3} className="header-title" style={{ margin: "0 16px", color: "black" }}>
                    SOUTHEX
                </Title>
                <Menu mode="horizontal" className="admin-header" style={{ marginLeft: "auto" }}>
                    <Menu.SubMenu
                        key="user"
                        title={
                            <span style={{ color: "white" }}>
                                <UserOutlined /> Admin: {adminName}
                            </span>
                        }
                    >
                        <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
                            ออกจากระบบ
                        </Menu.Item>
                    </Menu.SubMenu>
                </Menu>
            </div>
        </Header>
    );
}



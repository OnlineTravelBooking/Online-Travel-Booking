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
            <div className="container-fluid">
                <Menu mode="horizontal" className="admin-header" b>
                    <Menu.SubMenu
                        style={{ marginLeft: "auto" }}
                        key="user"
                        title={
                            <span style={{ color: "white" }}  >
                                <UserOutlined /> Admin: {adminName}
                            </span>
                        }
                    >
                        <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
                            ออกจากระบบ
                        </Menu.Item>
                    </Menu.SubMenu>
                </Menu>
            </div >
        </Header >
    );
}



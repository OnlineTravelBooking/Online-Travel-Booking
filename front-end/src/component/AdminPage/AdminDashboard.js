import React from "react";
import { Layout, Table, Typography, Button, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import AdminHeader from "../Header/AdminHeader";

const { Content } = Layout;
const { Title, Text } = Typography;

const columns = [
    {
        title: "ชื่อทัวร์",
        dataIndex: "name",
        key: "name",
        align: "center",
    },
    {
        title: "ประเภท",
        dataIndex: "type",
        key: "type",
        align: "center",
        render: (type) => (<Tag color={type === "One Day Trip" ? "red" : "blue"}>{type}</Tag>)
    },
    {
        title: "จัดการ",
        key: "manage",
        align: "center",
        render: () => (
            <>
                <Button type="primary" style={{ marginRight: 8 }}>Approval</Button>
                <Button type="default">ดูรายชื่อ</Button>
            </>
        ),
    },
    {
        title: "Actions",
        key: "actions",
        align: "center",
        render: () => (
            <>
                <Button type="link">Edit</Button>
                <Button type="link" danger>Delete</Button>
            </>
        ),
    },
];

const data = [
    { key: "1", name: "ทัวร์หาดสมิลา", type: "One Day Trip" },
    { key: "2", name: "ทัวร์ลุง", type: "Multi Day Trip" },
    { key: "3", name: "ทัวร์ภูเก็ต", type: "One Day Trip" },
    { key: "4", name: "ทัวร์กระบี่", type: "Multi Day Trip" },
];

export default function AdminDashboard() {
    return (
        <Layout className="admin-layout">
            <AdminHeader />

            <Content className="admin-content">
                <Title level={2} className="admin-welcome-title">ยินดีต้อนรับสู่ระบบการจัดการทัวร์ของ Southex</Title>
                <Text>
                    คุณสามารถจัดการทัวร์ ตรวจสอบการจอง และทำให้การดำเนินงานเป็นไปอย่างราบรื่นได้ง่ายๆ<br />
                    ลองใช้ตัวเลือกด้านล่างเพื่ออัปเดตรายละเอียดทัวร์, ยืนยันการชำระเงิน และอนุมัติการจองอย่างมีประสิทธิภาพ
                </Text>

                <div className="table-container">
                    <Table columns={columns} dataSource={data} pagination={false} />
                </div>

                <Link to="/add-package">
                    <Button type="dashed" className="add-package-btn" icon={<PlusOutlined />} >
                        เพิ่มแพ็คเกจ
                    </Button>
                </Link>
                <div className="logo-container"></div>
            </Content>
        </Layout>
    );
}

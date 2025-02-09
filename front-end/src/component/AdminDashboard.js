import React from "react";
import { Layout, Card, Typography, Avatar } from "antd";
import { CheckCircleOutlined, ProfileOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const AdminDashboard = () => {
    return (
        <Layout className="admin-layout">
            {/* Header */}
            <Header className="admin-header">
                <img src="url('southtex_logo.png')" alt="SOUTHEX" className="admin-logo" />
                <Avatar src="/admin-avatar.jpg" className="admin-avatar" /> <Text style={{ color: "white" }}>Admin A</Text>
            </Header>

            {/* Welcome Section */}
            <Content className="admin-content">
                <Title level={2}>
                    ยินดีต้อนรับสู่ระบบการจัดการทัวร์ของ <span className="admin-welcome-title">Southex</span>
                </Title>
                <Text>
                    คุณสามารถจัดการทัวร์ ตรวจสอบการจอง และทำให้การดำเนินงานเป็นไปอย่างราบรื่นได้ง่ายๆ
                    ใช้ตัวเลือกด้านล่างเพื่ออัปเดตรายละเอียดทัวร์ ยืนยันการชำระเงิน และอนุมัติการจองอย่างมีประสิทธิภาพ
                </Text>

                {/* Card Section */}
                <div className="card-container">
                    <Card
                        hoverable
                        className="admin-card"
                        cover={<ProfileOutlined className="card-icon" />}
                    >
                        <Title level={3}>จัดการทัวร์</Title>
                        <Text>เพิ่ม แก้ไข และลบทัวร์ ตั้งราคา และจัดการรายละเอียดทัวร์</Text>
                    </Card>

                    <Card
                        hoverable
                        className="admin-card"
                        cover={<CheckCircleOutlined className="card-icon" />}
                    >
                        <Title level={3}>อนุมัติการจอง</Title>
                        <Text>ตรวจสอบการจอง, ยืนยันการชำระเงิน และอนุมัติ/ปฏิเสธการจอง</Text>
                    </Card>
                </div>
            </Content>
        </Layout>
    );
};

export default AdminDashboard;
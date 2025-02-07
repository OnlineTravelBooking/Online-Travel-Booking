import React from "react";
import { Layout, Card, Typography, Avatar } from "antd";
import { CheckCircleOutlined, ProfileOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const AdminDashboard = () => {
    return (
        <Layout style={{ minHeight: "100vh", backgroundImage: "url('./admin_dashboard_background.jpeg')", backgroundSize: "cover" }}>
            {/* Header */}
            <Header style={{ background: "#5AB1AE", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px" }}>
                <img src="/assets/southex_logo.png" alt="SOUTHEX" style={{ height: 40 }} />
                <Avatar src="/admin-avatar.jpg" /> <Text style={{ color: "white" }}>Admin A</Text>
            </Header>

            {/* Welcome Section */}
            <Content style={{ textAlign: "center", padding: "40px 20px" }}>
                <Title level={2}>ยินดีต้อนรับสู่ระบบการจัดการทัวร์ของ <span style={{ color: "#5AB1AE" }}>Southex</span></Title>
                <Text>
                    คุณสามารถจัดการทัวร์ ตรวจสอบการจอง และทำให้การดำเนินงานเป็นไปอย่างราบรื่นได้ง่ายๆ
                    ใช้ตัวเลือกด้านล่างเพื่ออัปเดตรายละเอียดทัวร์ ยืนยันการชำระเงิน และอนุมัติการจองอย่างมีประสิทธิภาพ
                </Text>

                {/* Card Section */}
                <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "40px", flexWrap: "wrap" }}>
                    <Card
                        hoverable
                        style={{ width: 300, textAlign: "center", background: "#E3F2F1" }}
                        cover={<ProfileOutlined style={{ fontSize: "50px", marginTop: "20px", color: "#5AB1AE" }} />}
                    >
                        <Title level={3}>จัดการทัวร์</Title>
                        <Text>เพิ่ม แก้ไข และลบทัวร์ ตั้งราคา และจัดการรายละเอียดทัวร์</Text>
                    </Card>

                    <Card
                        hoverable
                        style={{ width: 300, textAlign: "center", background: "#E3F2F1" }}
                        cover={<CheckCircleOutlined style={{ fontSize: "50px", marginTop: "20px", color: "#5AB1AE" }} />}
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

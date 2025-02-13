import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Layout, Table, Typography, Avatar, Button, Tag } from "antd";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function EditTourList() {
    return (
        <Layout>
            <Content style={{ padding: "20px" }}>
                <Title level={2}>รายชื่อทัวร์</Title>
                <Link to="/">
                    <Button type="primary" icon={<PlusOutlined />}>กลับไปที่ Dashboard</Button>
                </Link>
            </Content>
        </Layout>
    );
}


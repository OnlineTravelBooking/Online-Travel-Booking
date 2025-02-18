import React, { useState } from "react";
import { Form, Input, Select, Button, Upload, Typography, Card, Space, Layout } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import AdminHeader from "../Header/AdminHeader";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

export default function AddTourPackage() {
  const [form] = Form.useForm();
  const [description, setDescription] = useState("");

  const onFinish = (values) => {
    console.log("Submitted Values:", { ...values, description });
  };

  return (
    <Layout className="admin-layout" style={{ height: "100vh", overflow: "hidden" }}>
      <AdminHeader />
      <Content className="content-container" style={{ overflowY: "auto", maxHeight: "calc(100vh - 64px)", padding: 20 }}>
        <Card className="add-tour-container" style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
          <Title level={2} style={{ textAlign: "center" }}>สร้างแพ็คเกจทัวร์</Title>
          <Form form={form} layout="vertical" onFinish={onFinish} scrollToFirstError>
            <Form.Item name="title" label="ชื่อแพ็คเกจทัวร์" rules={[{ required: true, message: "Please enter title" }]}>
              <Input placeholder="Enter tour title" />
            </Form.Item>

            <Form.Item name="type" label="ประเภทแพ็คเกจทัวร์" rules={[{ required: true, message: "Please select a type" }]}>
              <Select placeholder="Select type">
                <Option value="day_trip">Day Trip</Option>
                <Option value="multi_day_trip">Multi Day Trip</Option>
              </Select>
            </Form.Item>

            <Form.Item label="คำอธิบาย" rules={[{ required: true, message: "Please enter description" }]}>
              <ReactQuill value={description} onChange={setDescription} />
            </Form.Item>

            <Form.Item name="images" label="อัพโหลดรูปภาพ" valuePropName="fileList" getValueFromEvent={(e) => e.fileList} rules={[{ required: true, message: "Please upload images" }]}>
              <Upload listType="picture-card" beforeUpload={() => false} multiple>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>

            <Form.Item name="price" label="ราคา" rules={[{ required: true, message: "Please enter price" }]}>
              <Input type="number" placeholder="Enter price" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">Create Tour</Button>
                <Link to="/admin">
                  <Button htmlType="button" onClick={() => form.resetFields()}>Cancel</Button>
                </Link>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
}

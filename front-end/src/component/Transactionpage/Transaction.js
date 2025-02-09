import React from "react";
import { UserHeader } from "../Header";
import { useAuth } from "../../AuthContext";
import { Layout, Typography, Avatar, Button, Tag, Upload, Steps } from "antd";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";

const { Content, Header } = Layout;

export default function Transaction() {
  const paymentInfo = [
    { label: "ชื่อ-นามสกุล", value: "สมชาย ใจดี" },
    { label: "เลขบัญชี", value: "123-4-56789-0" },
    { label: "ธนาคาร", value: "ไทยพาณิชย์ (SCB)" },
  ];

  const bookingDetails = [
    { label: "Booking ID", value: "SONGKLA12345" },
    { label: "ทัวร์", value: "Samila Beach Trip" },
    { label: "ราคา", value: "1,700 บาท" },
    { label: "ชื่อลูกค้า", value: "สมชาย แอ๊บแอ้" },
    { label: "เบอร์โทร", value: "081-234-5678" },
    { label: "อีเมล", value: "somchai.abae@example.com" },
  ];

  return (
    <Layout style={{ minHeight: "100vh", overflow: "hidden" }}>
      <Header className="admin-header">James</Header>
      <Content className="Box">
        <div className="trip-data">
          <h2>รายละเอียดการจองของลูกค้า</h2>
          <p>ชื่อ: สมชาย ใจดี</p>
          <p>อีเมล: somchai@example.com</p>
        </div>

        <div className="Qr-payment">
          <h2>Qr-payment</h2>
        </div>

        <div className="Upload-payment">
          <h2>อัปโหลดหลักฐานการชำระเงิน</h2>
        </div>

        <div className="Steps">
          <h2>สถานะการชำระเงิน</h2>
          <Steps
            className="Step-Body"
            size="large"
            current={1}
            items={[
              { title: "Finished" },
              { title: "In Progress" },
              { title: "Waiting" },
            ]}
          />
        </div>
        <div>
          <Button className="Back-button" variant="solid">
            ย้อนกลับไปน้าแรก
          </Button>
        </div>
      </Content>
    </Layout>
  );
}

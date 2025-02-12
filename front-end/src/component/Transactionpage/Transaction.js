import React, { useState } from "react";
import { UserHeader } from "../Header";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  Form,
  message,
  Select,
  Button,
  Upload,
  Space,
  Layout,
  Steps,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
const { Content } = Layout;
export default function Transaction() {
  const [paymentStatus, setPaymentStatus] = useState(0);
  const navigate = useNavigate();
  const { data, Title, Price, selectedDate, Type } = useLocation().state;
  const [form] = Form.useForm();
  const { Option } = Select;
  const onFinish = (values) => {
    try {
      message.success("อัปโหลดสำเร็จ! กำลังตรวจสอบหลักฐาน");
      setPaymentStatus(1);
    } catch (err) {
      message.error("อัปโหลดล้มเหลว: " + err.message);
    }
  };
  const paymentInfo = [
    { label: "ชื่อ-นามสกุล", value: "สมชาย แอ๊บแอ้" },
    { label: "เลขบัญชี", value: "123-4-56789-0" },
    { label: "ธนาคาร", value: "ไทยพาณิชย์ (SCB)" },
  ];

  const bookingDetails = [
    { label: "Booking ID", value: data.documentId },
    {
      label: "วันที่เดินทาง",
      value: `${dayjs(selectedDate.Start_Date).format("DD/MM/YYYY")}${
        selectedDate.End_Date
          ? ` - ${dayjs(selectedDate.End_Date).format("DD/MM/YYYY")}`
          : ""
      }`,
    },
    { label: "ทัวร์", value: Title },
    { label: "ราคา", value: Price },
    { label: "ชื่อลูกค้า", value: `${data.Fname} ${data.Lname}` },
    { label: "อีเมล", value: data.email },
  ];

  return (
    <Layout style={{ minHeight: "100vh", overflow: "hidden" }}>
      <UserHeader />
      <Content className="Box">
        <div className="Box-trip-data">
          <h2>รายละเอียดการจองของลูกค้า</h2>
          <div className="trip-data">
            {bookingDetails.map((item, index) => (
              <p key={index}>
                <strong>{item.label}:</strong> {item.value}
              </p>
            ))}
          </div>
        </div>

        <div className="Box-Qr-payment">
          <h2>การชำระเงินด้วย QR Code</h2>
          <div className="Qr-container">
            <img
              src="/qrcode-placeholder.png"
              alt="QR Code"
              style={{ width: "200px", margin: "20px 0" }}
            />
            <div className="Qr-payment">
              <p>
                สแกน QR Code
                นี้ด้วยแอปมือถือธนาคารของคุณเพื่อชำระเงินให้เสร็จสมบูรณ์
                ข้อมูลการชำระเงิน
              </p>
              {paymentInfo.map((item, index) => (
                <p key={index}>
                  {"- "}
                  <strong>{item.label}:</strong> {item.value}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="Box-Upload-payment">
          <h2>อัปโหลดหลักฐานการชำระเงิน</h2>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            scrollToFirstError
          >
            <Form.Item
              name="images"
              label="อัพโหลดรูปภาพ"
              valuePropName="fileList"
              getValueFromEvent={(e) => e.fileList}
              rules={[{ required: true, message: "Please upload images" }]}
            >
              <Upload
                listType="picture-card"
                beforeUpload={() => false}
                multiple
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  ยืนยันการอัปโหลด
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>

        <div className="Steps">
          <h2>สถานะการชำระเงิน</h2>
          <Steps
            current={paymentStatus}
            className="Step-Body"
            size="large"
            items={[
              { title: "รอการชำระเงิน" },
              { title: "กำลังตรวจสอบ" },
              { title: "ยืนยันสำเร็จ" },
            ]}
          />
        </div>
        <div>
          <Button
            onClick={() => {
              navigate("/");
            }}
            className="Back-button"
            variant="solid"
            size="large"
          >
            ย้อนกลับไปน้าแรก
          </Button>
        </div>
      </Content>
    </Layout>
  );
}

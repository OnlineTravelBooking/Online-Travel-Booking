import React, { useState } from "react";
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
import { UserHeader } from "../Header/UserHeader";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import "antd/dist/reset.css";
message.config({
  maxCount: 3,
  duration: 3,
  rtl: false,
});
const { Content } = Layout;
export default function Transaction() {
  const [messageApi, contextHolder] = message.useMessage();

  const [paymentStatus, setPaymentStatus] = useState(0);
  const navigate = useNavigate();
  const { data, Title, Price, selectedDate, people, packageId } =
    useLocation().state;
  const [form] = Form.useForm();
  const { Option } = Select;

  const onFinish = async (values) => {
    const hide = message.loading({
      content: "กำลังอัพโหลดข้อมูล...",
      duration: 0,
    });

    if (!values.image || values.image.length === 0) {
      message.error("กรุณาเลือกรูปภาพ");
      return;
    }
    const imageFile = values.image[0].originFileObj;
    const formData = new FormData();
    formData.append("files", imageFile);

    try {
      const uploadRes = await axios.post(
        "http://localhost:1337/api/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      const slipId = uploadRes.data[0]?.id;

      const bookingData = {
        data: {
          HowManyPeople: parseInt(people, 10),
          TotalPrice: parseFloat(Price),
          customer: data.documentId,
          package: packageId,
          slip: slipId,
          Status_booking: "pending",
          Start: selectedDate.Start_Date,
          End: selectedDate.End_Date,
        },
      };

      console.log("date", selectedDate);
      await axios.post("http://localhost:1337/api/bookings", bookingData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      hide();

      message.success({
        content: "ส่งข้อมูลสำเร็จ โปรดรอการตรวจสอบ",
        duration: 3,
      });
      setPaymentStatus(1);
    } catch (err) {
      hide?.();
      message.error({
        content: "อัพโหลดล้มเหลว: " + err.message,
        duration: 3,
      });
    }
  };
  const paymentInfo = [
    { label: "ชื่อ-นามสกุล", value: "สมชาย แอ๊บแอ้" },
    { label: "เลขบัญชี", value: "123-4-56789-0" },
    { label: "ธนาคาร", value: "ไทยพาณิชย์ (SCB)" },
  ];

  const bookingDetails = [
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
    { label: "จำนวน", value: `${people} คน` },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <UserHeader />
      <Content className="Box">
        {contextHolder}
        <div className="Box-trip-data">
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
          <h2>อัพโหลดหลักฐานการชำระเงิน</h2>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            scrollToFirstError
          >
            <Form.Item
              name="image"
              label="อัพโหลดรูปภาพ"
              valuePropName="fileList"
              getValueFromEvent={(e) => e.fileList}
              rules={[{ required: true, message: "Please upload images" }]}
            >
              <Upload
                listType="picture-card"
                beforeUpload={() => false}
                multiple={false}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  ยืนยันการอัพโหลด
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
            ย้อนกลับไปหน้าแรก
          </Button>
        </div>
      </Content>
    </Layout>
  );
}

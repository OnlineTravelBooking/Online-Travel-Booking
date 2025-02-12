import React from "react";
import { UserHeader } from "../Header";
import { useLocation } from "react-router-dom";
import { Layout, Typography, Avatar, Button, Tag, Upload, Steps } from "antd";
import dayjs from "dayjs";
const { Content } = Layout;

export default function Transaction() {
  const { data, Title, Price, selectedDate } = useLocation().state;
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
    <Layout style={{ minHeight: "100vh" }}>
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
          <div className="Upload-payment">
            <Button className="summit-upload" variant="solid">
              Submit Payment Proof
            </Button>
          </div>
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
          <Button className="Back-button" variant="solid" size="large">
            ย้อนกลับไปน้าแรก
          </Button>
        </div>
      </Content>
    </Layout>
  );
}

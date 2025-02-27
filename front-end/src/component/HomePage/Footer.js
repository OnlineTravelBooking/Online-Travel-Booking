import React from "react";
import { Layout } from "antd";
import { FacebookOutlined, InstagramOutlined } from "@ant-design/icons";

const { Footer } = Layout;

const footerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#fff",
  backgroundColor: "#2E5077",
  padding: "10px 20px",
  fontSize: "20px",
};

const iconStyle = {
  fontSize: "25px",
  margin: "0 8px",
  color: "#fff",
  transition: "color 0.3s ease", // เพิ่ม transition ให้เปลี่ยนสีแบบ smooth
};

export default function CustomFooter() {
  return (
    <Footer style={footerStyle}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ marginRight: "15px" }}>©SOUTHEX</span>
        <span>Follow : Facebook</span>
        <a href="https://facebook.com">
          <FacebookOutlined
            style={{ ...iconStyle }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#1877F2")} // เปลี่ยนเป็นสีน้ำเงินของ Facebook
            onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")} // กลับเป็นสีขาว
          />
        </a>
        <span>Instagram</span>
        <a href="https://instagram.com">
          <InstagramOutlined
            style={{ ...iconStyle }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#E4405F")} // เปลี่ยนเป็นสีแดงของ Instagram
            onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")} // กลับเป็นสีขาว
          />
        </a>
      </div>
    </Footer>
  );
}
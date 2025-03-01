import React from "react";
import { Layout } from "antd";
import { FacebookOutlined, InstagramOutlined } from "@ant-design/icons";

const { Footer } = Layout;

const footerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  color: "#fff",
  backgroundColor: "#2E5077",
  padding: "20px",
  fontSize: "16px",
};

const sectionStyle = {
  width: "100%",
  maxWidth: "1000px",
  display: "flex",
  justifyContent: "space-between",
  textAlign: "left",
  marginBottom: "20px",
};

const developerContainerStyle = {
  display: "flex",
  alignItems: "flex-start",
};

const developerStyle = {
  marginLeft: "300px", // ขยับไปทางซ้ายอีกหน่อย
};

const taglineStyle = {
  marginTop: "0px", // ขยับขึ้นข้างบน
  marginLeft: "-400px", // ขยับไปทางซ้าย
};

const iconStyle = {
  fontSize: "25px",
  margin: "0 0px",
  color: "#fff",
  transition: "color 0.3s ease",
};

export default function CustomFooter() {
  return (
    <Footer style={footerStyle}>
      <div style={sectionStyle}>
        <div style={developerContainerStyle}>
          <div style={taglineStyle}><strong>Tailored Trips, Timeless Memories</strong></div>
          <div style={developerStyle}>
            <strong>Developer</strong>
            <p>นายโมไนย สุชาตานนท์ - Full Stack Developer</p>
            <p>นายพชรพล ปิยดิลก - Front End Developer</p>
            <p>นายธนธาน พฤกษโกศล - Front End Developer</p>
            <p>นายธันวา เชื้อสูงเนิน - Back End Developer</p>
          </div>
        </div>
        <div>
          <strong>Support</strong>
          
          <p>
            Facebook:
            <a href="https://facebook.com">
              <FacebookOutlined
                style={{ ...iconStyle }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#1877F2")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
              />
            </a>
          </p>
          <p>
            Instagram:
            <a href="https://instagram.com">
              <InstagramOutlined
                style={{ ...iconStyle }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E4405F")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
              />
            </a>
          </p>
        </div>
      </div>
      <div>© 2024 SOUTHEX, All rights reserved.</div>
    </Footer>
  );
}
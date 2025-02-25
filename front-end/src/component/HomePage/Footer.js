import React from "react";
import { Layout } from "antd";
import BackToTop from "./back";
const { Footer } = Layout;

const footerStyle = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#4096ff",
};

export default function CustomFooter() {
  return <div>
    <Footer style={footerStyle}>Footer
      <BackToTop />
    </Footer> 
  </div>;
}

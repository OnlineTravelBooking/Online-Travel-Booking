import React from "react";
import { Layout } from "antd";

const { Footer } = Layout;

const footerStyle = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#4096ff",
};

export default function CustomFooter() {
  return <Footer style={footerStyle}>Footer</Footer>;
}

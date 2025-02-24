import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { UpOutlined } from "@ant-design/icons";
import "./back.css"; // สร้างไฟล์ CSS เพื่อกำหนดสไตล์

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 100/*ปรับได้ว่าจะให้เห็นปุ่มเลื่อนขึ้นเมื่อถึงเกินเท่าไหร่ อันนี้ตั้งที่100*/ ) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Button
      type="primary"
      shape="circle"
      icon={<UpOutlined />}
      onClick={scrollToTop}
      className={`back-to-top ${isVisible ? "show" : "hide"}`}
    />
  );
};

export default BackToTop;
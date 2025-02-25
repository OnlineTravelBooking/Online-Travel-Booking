import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export default function LoadingSpin() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.8)", // Optional: Add a semi-transparent background
        zIndex: 9999, // Ensure it is on top of other elements
      }}
    >
      <Spin
        indicator={
          <LoadingOutlined
            style={{
              fontSize: 100,
            }}
            spin
          />
        }
      />
    </div>
  );
}

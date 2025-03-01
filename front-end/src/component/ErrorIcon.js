import React from "react";
import { Button, Result } from "antd";

export default function ErrorIcon(error) {
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
      <Result
        status="warning"
        title={error.error.message || "An error occurred"}
        extra={
          <Button
            type="primary"
            key="reload"
            onClick={() => window.location.reload()}
            style={{
              fontSize: "25px",
              padding: "20px 30px",
              borderRadius: "8px",
              backgroundColor: "#2034cb",
              borderColor: "#2034cb",
            }}
          >
            Reload
          </Button>
        }
      />
    </div>
  );
}

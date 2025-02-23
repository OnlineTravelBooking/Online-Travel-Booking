import React, { useState } from "react";
import { Modal, Row, Col } from "antd";

export default function Image({ isImageModalOpen, setIsImageModalOpen, selectedBooking }) {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <Modal title="Uploaded Images" open={isImageModalOpen} onCancel={() => setIsImageModalOpen(false)} footer={null}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <img
            src={`http://localhost:1337${selectedBooking?.slip?.url}`}
            style={{
              maxWidth: "100%",
              maxHeight: "75vh",
              width: isZoomed ? "auto" : "100%",
              height: isZoomed ? "auto" : "100%",
              objectFit: "contain",
              cursor: "pointer",
            }}
            onClick={handleImageClick}
          />
        </Col>
      </Row>
    </Modal>
  );
}

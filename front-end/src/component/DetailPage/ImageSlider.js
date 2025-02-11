import React, { useState } from "react";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { Button } from "antd";
export default function ImageSlider({ allImages }) {
  const [imageIndex, setImageIndex] = useState(0);

  const prevImage = () => {
    imageIndex === 0
      ? setImageIndex(allImages.length - 1)
      : setImageIndex((imageIndex) => imageIndex - 1);
  };

  const nextImage = () => {
    imageIndex === allImages.length - 1
      ? setImageIndex(0)
      : setImageIndex((imageIndex) => imageIndex + 1);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="IMG">
        <img
          src={`http://localhost:1337${allImages[imageIndex]}`}
          className="img-slide"
        />
        <Button className="button-slide-left" onClick={prevImage}>
          <div style={{ scale: "3" }}>❰</div>
        </Button>
        <Button className="button-slide-right" onClick={nextImage}>
          <div style={{ scale: "3" }}>❱</div>
        </Button>
      </div>
    </div>
  );
}

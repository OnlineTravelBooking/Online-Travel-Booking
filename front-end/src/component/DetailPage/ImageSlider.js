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
      }}
    >
      <div className="IMG">
        <img
          className="img-slide"
          src={`http://localhost:1337${allImages[imageIndex]}`}
        />
        <Button className="button-slide-left" onClick={prevImage}>
          <div
            style={{
              transform: "scale(3)",
              marginRight: "6px",
              marginBotto: "3px",
            }}
          >
            ❰
          </div>
        </Button>
        <Button className="button-slide-right" onClick={nextImage}>
          <div
            style={{
              transform: "scale(3)",
              marginLeft: "6px",
              marginBottom: "3px",
            }}
          >
            ❱
          </div>
        </Button>
      </div>
    </div>
  );
}

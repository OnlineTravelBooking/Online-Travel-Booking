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
    <div style={{ width: "100%", height: "100%" }}>
      <img src={`http://localhost:1337${allImages[imageIndex]}`} />
      <div>
        <ArrowBigLeft onClick={prevImage} />{" "}
        <ArrowBigRight onClick={nextImage} />
      </div>
    </div>
  );
}

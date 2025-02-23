import React, { useState } from "react";
import { Button } from "antd";
import { motion, AnimatePresence } from "framer-motion";

export default function ImageSlider({ allImages }) {
  const [imageIndex, setImageIndex] = useState(0);
  const [direction, setDirection] = useState("next");

  const prevImage = () => {
    setDirection("prev");
    setImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setDirection("next");
    setImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const slideVariants = {
    hidden: (direction) => ({
      x: direction === "next" ? "20%" : "-20%",
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.2 },
    },
    exit: (direction) => ({
      x: direction === "next" ? "-20%" : "20%",
      opacity: 0,
      transition: { duration: 0.2 },
    }),
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
        <AnimatePresence mode="wait" custom={direction}>
          <motion.img
            key={imageIndex}
            src={`http://localhost:1337${allImages[imageIndex]}`}
            className="img-slide"
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            custom={direction}
            style={{ position: "absolute", width: "100%", height: "100%" }}
          />
        </AnimatePresence>
        <Button className="button-slide-left" onClick={prevImage}>
          <div
            style={{
              transform: "scale(3)",
              marginRight: "6px",
              marginBottom: "3px",
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

import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { motion } from "framer-motion";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Carousel } from "bootstrap";

export default function Slide() {
  const images = ["Zoo.jpg", "Payanarg.jpg", "Samila.jpg"];

  useEffect(() => {
    const carousel = document.querySelector("#carouselExample");
    const carouselInstance = new Carousel(carousel);
    carouselInstance.next();
  }, []);

  return (
    <div
      id="carouselExample"
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="3000"
      data-bs-pause="hover"
    >
      <div className="Search-carousel">
        <Input
          placeholder="FIND YOUR TRIP!!!"
          className="Input-search"
          prefix={<SearchOutlined style={{ fontSize: "22px" }} />}
        />
      </div>
      <div className="carousel-inner">
        {images.map((img, index) => (
          <div
            key={index}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <img
              src={img}
              className="d-block w-100"
              alt={`Slide ${index + 1}`}
              style={{ height: "550px", objectFit: "cover" }}
            />
          </div>
        ))}
        <div className="carousel-indicators">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              data-bs-target="#carouselExample"
              data-bs-slide-to={idx}
              className={idx === 0 ? "active" : ""}
              aria-current={idx === 0 ? "true" : "false"}
            ></button>
          ))}
        </div>
      </div>

      <motion.button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="prev"
        whileTap={{
          scale: 0.9,
          transition: { type: "spring", stiffness: 1000 },
        }}
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </motion.button>
      <motion.button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="next"
        whileTap={{
          scale: 0.8,
          transition: { type: "spring", stiffness: 500 },
        }}
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </motion.button>
    </div>
  );
}

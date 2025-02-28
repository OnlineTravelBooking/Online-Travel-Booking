import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "antd";
import LoadingSpin from "../LoadingSpin";
import ErrorIcon from "../ErrorIcon";
import { GET_PACKAGES } from "../../Graphql";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
const StrapiUrl = process.env.REACT_APP_API_URL;

const { Meta } = Card;

export default function PackageCard({ filters }) {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    // โหลดข้อมูล favorites จาก localStorage เมื่อโหลดหน้า
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const { loading: loading_package, error: error_package, data: data_package } = useQuery(GET_PACKAGES);

  useEffect(() => {
    if (data_package && data_package.packages) {
      let filteredData = data_package.packages;
      
      // กรองแพ็คเกจที่เป็น favorites หากมีการเลือก
      if (filters.favorites?.length > 0) {
        filteredData = filteredData.filter((item) =>
          filters.favorites.includes(item.documentId)
        );
      }

      if (filters.searchTitle) {
        filteredData = filteredData.filter((item) =>
          item.Title.toLowerCase().includes(filters.searchTitle.toLowerCase())
        );
      }

      if (filters.types?.length > 0) {
        filteredData = filteredData.filter((item) => filters.types.includes(item.Type));
      }

      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        filteredData = filteredData.filter((item) => item.Price >= min && item.Price <= max);
      }

      if (filters.travelDate) {
        const [start, end] = filters.travelDate;
        filteredData = filteredData.filter((pkg) => {
          return pkg.Date?.some((date) => {
            const Start_Date = date.Start_Date;
            const End_Date = date.End_Date;
            return End_Date ? Start_Date >= start && End_Date <= end : Start_Date >= start;
          });
        });
      }

      const mapData = filteredData.map((item) => ({
        documentId: item.documentId,
        Price: item?.Price,
        Title: item?.Title,
        Type: item?.Type,
        urlImage: item?.Image[0]?.url,
        Description: item?.Description,
        MeetingPoint: item?.MeetingPoint,
        Accommodation: item?.Accommodation,
        StartDate: item?.Start_Date,
        EndDate: item?.End_Date,
      }));
      setDataSource(mapData);
    }
  }, [data_package, filters]);

  const toggleFavorite = (documentId) => {
    const updatedFavorites = favorites.includes(documentId)
      ? favorites.filter((id) => id !== documentId)
      : [...favorites, documentId];

    setFavorites(updatedFavorites);

    // เก็บข้อมูล favorites ใน localStorage
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  if (loading_package) {
    return <LoadingSpin />;
  }
  if (error_package) {
    return <ErrorIcon error={error_package} />;
  }

  return (
    <Row className="Package">
      <AnimatePresence initial={false}>
        {dataSource.map((item, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={item.documentId}>
            <motion.div
              layout
              initial={{ x: 100, opacity: 0, rotate: 0 }}
              animate={{ x: 0, opacity: 1, rotate: 0 }}
              transition={{
                delay: index * 0.1,
                duration: 0.5,
              }}
              whileHover={{
                scale: 1.05,
                x: [0, -10, 10, 0],
                rotate: [0, -1, 1, 0],
                transition: {
                  duration: 0.5,
                },
              }}
              whileTap={{
                scale: 0.9,
                transition: { type: "spring", stiffness: 1000 },
              }}
            >
              <Card
                hoverable
                className="Card-package"
                cover={
                  <div style={{ position: "relative" }}>
                    <img
                      alt={item.Title}
                      src={`${StrapiUrl}${item.urlImage}`}
                      style={{
                        height: "170px",
                        objectFit: "cover",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        left: "10px",
                        fontSize: "24px",
                        color: favorites.includes(item.documentId) ? "#ff0000" : "#fff",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.documentId);
                      }}
                    >
                      {favorites.includes(item.documentId) ? <HeartFilled /> : <HeartOutlined />}
                    </div>
                  </div>
                }
                onClick={() => {
                  navigate("/detail", {
                    state: {
                      documentId: item.documentId,
                      Title: item.Title,
                      Price: item.Price,
                      Type: item.Type,
                      Description: item.Description,
                      MeetingPoint: item.MeetingPoint,
                      Accommodation: item?.Accommodation,
                    },
                  });
                }}
              >
                <Meta
                  title={item.Title}
                  description={
                    <>
                      <div>{item.Type}</div>
                      <div style={{ color: "#FF0000", textAlign: "end" }}>${item.Price}</div>
                    </>
                  }
                />
              </Card>
            </motion.div>
          </Col>
        ))}
      </AnimatePresence>
    </Row>
  );
}
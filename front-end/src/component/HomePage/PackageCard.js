import React, { useEffect, useState } from "react";
import { Card, Row, Col, Descriptions } from "antd";
import { GET_PACKAGES, TRAVEL_DATE } from "../../Graphql";
import { useQuery } from "@apollo/client";
import { data, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
const { Meta } = Card;

export default function PackageCard({ filters }) {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([]);

  const {
    loading: loading_package,
    error: error_package,
    data: data_package,
  } = useQuery(GET_PACKAGES);

  const {
    loading: loading_date,
    error: error_date,
    data: data_date,
  } = useQuery(TRAVEL_DATE);

  useEffect(() => {
    if (data_package && data_package.packages) {
      let filteredData = data_package.packages;

      if (filters.searchTitle) {
        filteredData = filteredData.filter((item) =>
          item.Title.toLowerCase().includes(filters.searchTitle.toLowerCase())
        );
      }

      if (filters.types?.length > 0) {
        filteredData = filteredData.filter((item) =>
          filters.types.includes(item.Type)
        );
      }

      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        filteredData = filteredData.filter(
          (item) => item.Price >= min && item.Price <= max
        );
      }

      const mapData = filteredData.map((item) => ({
        documentId: item.documentId,
        Price: item.Price,
        Title: item.Title,
        Type: item.Type,
        urlImage: item.Image[0]?.url,
        Description: item.Description,
        MeetingPoint: item.MeetingPoint,
        StartDate: item.Start_Date,
        EndDate: item.End_Date,
        StartDate: item.Start_Date,
        EndDate: item.End_Date,
      }));
      setDataSource(mapData);
    }
  }, [data_package, filters]);

  if (loading_package) {
    return <div>Loading...</div>;
  }
  if (error_package) {
    return <div>Error: {error_package.message}</div>;
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
                  <img
                    alt={item.Title}
                    src={`http://localhost:1337${item.urlImage}`}
                    style={{
                      height: "170px",
                      objectFit: "cover",
                    }}
                  />
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
                    },
                  });
                }}
              >
                <Meta
                  title={item.Title}
                  description={
                    <>
                      <div>{item.Type}</div>
                      <div style={{ color: "#FF0000", textAlign: "end" }}>
                        ${item.Price}
                      </div>
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

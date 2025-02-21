import React, { useEffect, useState } from "react";
import { Card, Row, Col, Descriptions } from "antd";
import { GET_PACKAGES } from "../../Graphql";
import { useQuery } from "@apollo/client";
import Title from "antd/es/skeleton/Title";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { spaceChildren } from "antd/es/button";

const { Meta } = Card;

export default function PackageCard() {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_PACKAGES);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    if (data && data.packages) {
      const mapData = data.packages.map((item) => ({
        documentId: item.documentId,
        Price: item.Price,
        Title: item.Title,
        Type: item.Type,
        urlImage: item.Image[0].url,
        Description: item.Description,
        MeetingPoint: item.MeetingPoint,
      }));
      setDataSource(mapData);
    }
  }, [data]);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <Row className="Package">
      {dataSource.map((item, index) => (
        <Col xs={24} sm={12} md={8} lg={6} key={item.documentId}>
          <motion.div
            initial={{ x: 100, opacity: 0, rotate: 0 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            transition={{
              delay: index * 0.2,
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
                    objectFit: "contain",
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
                    <div style={{ color: "#FF0000" }}>${item.Price}</div>
                  </>
                }
              />
            </Card>
          </motion.div>
        </Col>
      ))}
    </Row>
  );
}

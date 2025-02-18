import React, { useEffect, useState } from "react";
import { Card, Row, Col, Descriptions } from "antd";
import { GET_PACKAGES } from "../../Graphql";
import { useQuery } from "@apollo/client";
import Title from "antd/es/skeleton/Title";
import { useNavigate } from "react-router-dom";
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
    <Row gutter={[16, 16]} style={{ padding: "24px" }}>
      {dataSource.map((item) => (
        <Col xs={24} sm={12} md={8} lg={6} key={item.documentId}>
          <Card
            hoverable
            style={{
              width: "100%",
              height: "100%",
            }}
            cover={
              <img
                alt={item.Title}
                src={`http://localhost:1337${item.urlImage}`}
                style={{
                  height: "200px",
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
                  <div style={{ color: "#FF0000" }}>${item.Price}</div>
                </>
              }
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
}

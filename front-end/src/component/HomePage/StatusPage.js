import React, { useState, useEffect } from "react";
import { Card, Row, Col, Tag, Timeline, Layout, message } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { UserHeader } from "../Header/UserHeader";
import { useAuth } from "../../AuthContext";
import { BOOKING } from "../../Graphql";
import { useQuery } from "@apollo/client";
import { ALL_IMAGES_PACKAGE } from "../../Graphql";
import "antd/dist/reset.css";

export default function StatusPage() {
  const { loading, error, data: data_booking } = useQuery(BOOKING);
  const { data: data_image } = useQuery(ALL_IMAGES_PACKAGE);
  const { data } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [image, setImage] = useState([]);

  const getStatusTag = (status) => {
    switch (status) {
      case "approved":
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Approved
          </Tag>
        );
      case "pending":
        return (
          <Tag icon={<ClockCircleOutlined />} color="processing">
            Pending
          </Tag>
        );
      case "rejected":
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Rejected
          </Tag>
        );
      default:
        return <Tag color="default">Unknown</Tag>;
    }
  };
  useEffect(() => {
    if (data_booking && data_image) {
      const mapData = data_booking.bookings.map((booking, index) => {
        const packageImage = data_image.packages.find((item) => item.documentId === booking.package.documentId);
        return {
          id: index,
          seats: booking.HowManyPeople,
          status: booking.Status_booking,
          price: booking.TotalPrice,
          documentId: booking.documentId,
          packageName: booking.package.Title,
          Type: booking.package.Type,
          Start: booking.Start,
          End: booking.End,
          image: `http://localhost:1337${packageImage.Image[0].url}`,
        };
      });
      setBookings(mapData);
    }
  }, [data_booking, data_image]);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data_booking) return <div>No data available</div>;
  return (
    <Layout>
      <Header>
        <UserHeader />
      </Header>

      <Content>
        <div style={{ padding: "24px" }}>
          <h1 style={{ marginBottom: "24px" }}>Booking Status</h1>
          <Row gutter={[16, 16]}>
            {bookings.map((item) => (
              <Col key={item.id} xs={24} sm={12} lg={8}>
                <Card
                  cover={
                    <img alt={item.packageName} src={item.image} style={{ height: "200px", objectFit: "cover" }} />
                  }
                  hoverable
                >
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <h2>{item.packageName}</h2>
                      <p>
                        Date: {new Date(item.Start).toLocaleDateString()}{" "}
                        {item.End && ` - ${new Date(item.End).toLocaleDateString()}`}
                      </p>
                      <p>Price: ${item.price}</p>
                      <p>Seats: {item.seats}</p>
                      <div style={{ marginTop: "16px" }}>{getStatusTag(item.status)}</div>
                    </Col>
                    <Col span={24}>
                      <Timeline>
                        <Timeline.Item color="green">Booked</Timeline.Item>
                        <Timeline.Item
                          color={item.status === "approved" || item.status === "rejected" ? "green" : "gray"}
                        >
                          Payment Completed
                        </Timeline.Item>
                        <Timeline.Item
                          color={item.status === "approved" ? "green" : item.status === "rejected" ? "red" : "gray"}
                        >
                          {item.status === "approved"
                            ? "Approved"
                            : item.status === "rejected"
                            ? "Rejected"
                            : "Pending Approval"}
                        </Timeline.Item>
                        <Timeline.Item color="gray">Trip Completion</Timeline.Item>
                      </Timeline>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Content>
    </Layout>
  );
}

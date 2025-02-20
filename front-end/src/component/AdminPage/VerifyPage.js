import React, { useState } from "react";
import { Layout, theme, Row, Col, Card, message, Modal, Collapse, List, Button, Input } from "antd";
import Sidebar from "./Sidebar";
import { GET_PACKAGES } from "../../Graphql";
import { useQuery } from "@apollo/client";

const { Header, Content } = Layout;
const { Meta } = Card;
const { Panel } = Collapse;
const { TextArea } = Input;

export default function VerifyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [comment, setComment] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG }, // สีพื้นหลัง container, ขนาดความโค้งของขอบ
  } = theme.useToken();

  //ดึง package มา
  const { loading: loading_package, error: error_package, data: data_package } = useQuery(GET_PACKAGES);

  //กรองเฉพาะที่มีการ booking
  const packageWithBooking = data_package?.packages?.filter((pkg) => pkg.bookings && pkg.bookings.length > 0) || [];

  if (loading_package) {
    return <div>Loading...</div>;
  }
  if (error_package) {
    return <div>Error: {error_package.message}</div>;
  }

  const groupBookingByDate = (pkg) => {
    console.log("Package Data:", pkg);
    if (!pkg || !pkg.bookings) return {};
    return pkg.bookings.reduce((acc, booking) => {
      const date = booking.Start;
      if (!acc[date]) acc[date] = [];
      acc[date].push(booking);
      return acc;
    }, {});
  };

  const handleCardClick = (pkg) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const handleApprove = (bookingId) => {
    message.success(`Booking ${bookingId} approved!`);
  };

  const handleReject = (bookingId) => {
    if (!comment) {
      message.error("Please provide a rejection reason");
      return;
    }
    message.success(`Booking ${bookingId} rejected. Reason: ${comment}`);
    setComment("");
    setSelectedBooking(null);
  };

  const handleViewImage = (booking) => {
    setSelectedBooking(booking);
    setIsImageModalOpen(true);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "0 16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Row gutter={[16, 16]} style={{ padding: "24px" }}>
              {packageWithBooking.map((item) => (
                <Col xs={24} sm={12} md={8} lg={6} key={item.documentId}>
                  <Card
                    hoverable
                    style={{ width: "100%", height: "100%" }}
                    cover={
                      <img
                        alt={item.Title}
                        src={`http://localhost:1337${item.Image[0].url}`}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    }
                    onClick={() => handleCardClick(item)}
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
            {/* Booking Details Modal */}
            <Modal
              title={`Bookings for ${selectedPackage?.Title}`}
              open={isModalOpen}
              onCancel={() => setIsModalOpen(false)}
              footer={null}
              width={800}
            >
              <Collapse accordion>
                {Object.entries(groupBookingByDate(selectedPackage) || []).map(([date, bookings]) => (
                  <Panel header={date} key={date}>
                    <List
                      dataSource={bookings}
                      renderItem={(booking) => (
                        <List.Item
                          actions={[
                            <Button type="link" onClick={() => handleViewImage(booking)}>
                              View Images
                            </Button>,
                            selectedBooking?.id === booking.documentId ? (
                              <>
                                <TextArea
                                  placeholder="Rejection reason"
                                  value={comment}
                                  onChange={(e) => setComment(e.target.value)}
                                  rows={2}
                                />
                                <Button danger onClick={() => handleReject(booking.id)}>
                                  Confirm Reject
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button type="primary" onClick={() => handleApprove(booking.id)}>
                                  Approve
                                </Button>
                                <Button danger onClick={() => setSelectedBooking(booking)}>
                                  Reject
                                </Button>
                              </>
                            ),
                          ]}
                        >
                          <List.Item.Meta
                            title={`${booking.customer?.Fname} ${booking.customer?.Lname}`}
                            description={
                              <>
                                <div>Participants: {booking.participants}</div>
                                <div>Status: {booking.Status_booking}</div>
                                <div>Email: {booking.customer?.email}</div>
                              </>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </Panel>
                ))}
              </Collapse>
            </Modal>
            {/* Image View Modal */}
            <Modal
              title="Uploaded Images"
              open={isImageModalOpen}
              onCancel={() => setIsImageModalOpen(false)}
              footer={null}
            >
              <Row gutter={[16, 16]}>
                {selectedBooking?.images?.map((image, index) => (
                  <Col span={8} key={index}>
                    <img
                      src={`http://localhost:1337${image.url}`}
                      alt={`Upload ${index + 1}`}
                      style={{ width: "100%", height: "100px", objectFit: "cover" }}
                    />
                  </Col>
                ))}
              </Row>
            </Modal>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

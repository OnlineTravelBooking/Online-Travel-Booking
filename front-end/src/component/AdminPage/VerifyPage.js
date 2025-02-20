import React, { useState } from "react";
import { Layout, theme, Row, Col, Card, message, Modal, Collapse, List, Button, Input } from "antd";
import Sidebar from "./Sidebar";
import { GET_PACKAGES } from "../../Graphql";
import { useQuery } from "@apollo/client";
import BookingDetailsModal from "./Modal/BookingDetailsModal";
import ImageViewModal from "./Modal/ImageViewModal";
import moment from "moment";

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
  const [viewingBooking, setViewingBooking] = useState(null);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { loading: loading_package, error: error_package, data: data_package } = useQuery(GET_PACKAGES);

  const packageWithBooking = data_package?.packages?.filter((pkg) => pkg.bookings && pkg.bookings.length > 0) || [];

  if (loading_package) return <div>Loading...</div>;
  if (error_package) return <div>Error: {error_package.message}</div>;

  const groupBookingByDate = (pkg) => {
    if (!pkg?.bookings) return {};
    return pkg.bookings.reduce((acc, { End, Start, ...booking }) => {
      const formattedStart = moment(Start).format("DD/MM/YYYY");
      const formattedEnd = End ? moment(End).format("DD/MM/YYYY") : null;
      const dateRange = formattedEnd ? `${formattedStart} - ${formattedEnd}` : formattedStart;
      acc[dateRange] = acc[dateRange] || [];
      acc[dateRange].push(booking);
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
    setViewingBooking(booking);
    setIsImageModalOpen(true);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "0 16px" }}>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer, borderRadius: borderRadiusLG }}>
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
                        style={{ width: "100%", height: "auto" }}
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
            <BookingDetailsModal
              isModalOpen={isModalOpen}
              selectedPackage={selectedPackage}
              setIsModalOpen={setIsModalOpen}
              groupBookingByDate={groupBookingByDate}
              selectedBooking={selectedBooking}
              setSelectedBooking={setSelectedBooking}
              comment={comment}
              setComment={setComment}
              handleApprove={handleApprove}
              handleReject={handleReject}
              handleViewImage={handleViewImage}
            />
            <ImageViewModal
              isImageModalOpen={isImageModalOpen}
              setIsImageModalOpen={setIsImageModalOpen}
              selectedBooking={viewingBooking}
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

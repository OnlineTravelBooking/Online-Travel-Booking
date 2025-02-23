import React, { useState } from "react";
import { Layout, theme, Row, Col, Card, message, Modal, Collapse, List, Button, Input } from "antd";
import Sidebar from "./Sidebar";
import { GET_PACKAGES } from "../../Graphql";
import { useMutation, useQuery } from "@apollo/client";
import BookingDetailsModal from "./Modal/BookingDetailsModal";
import ImageViewModal from "./Modal/ImageViewModal";
import moment from "moment";
import { UPDATE_STATUS } from "../../Graphql";
import { useAuth } from "../../AuthContext";

const { Header, Content } = Layout;
const { Meta } = Card;

export default function VerifyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [comment, setComment] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [viewingBooking, setViewingBooking] = useState(null);
  const [updateStatus] = useMutation(UPDATE_STATUS);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { loading: loading_package, error: error_package, data: data_package, refetch } = useQuery(GET_PACKAGES);

  const packageWithBooking =
    data_package?.packages?.filter((pkg) => pkg.bookings?.some((booking) => booking.Status_booking === "pending")) ||
    [];

  if (loading_package) return <div>Loading...</div>;
  if (error_package) return <div>Error: {error_package.message}</div>;

  const groupBookingByDate = (pkg) => {
    if (!pkg?.bookings) return {};
    const pendingBooking = pkg.bookings.filter((booking) => booking.Status_booking === "pending");
    return pendingBooking.reduce((acc, { End, Start, ...booking }) => {
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

  const handleApprove = async (bookingId) => {
    try {
      await updateStatus({
        variables: {
          documentId: bookingId,
          data: {
            Status_booking: "approved",
          },
        },
        context: {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        },
      });
      const { data: newData } = await refetch();
      const updatedPackage = newData.packages.find((pkg) => pkg.documentId === selectedPackage.documentId);
      setSelectedPackage(updatedPackage);
      message.success(`Booking ${bookingId} approved!`);

      //ตรวจสอบวถ้าไม่มี pending bookint ให้ปิด modal
      const hasPending = updatedPackage.bookings.some((b) => b.Status_booking === "pending");
      if (!hasPending) setIsModalOpen(false);
    } catch (err) {
      message.error(`Failed to approve booking: ${err.message}`);
    }
  };

  const handleReject = async (bookingId) => {
    if (!comment) {
      message.error("Please provide a rejection reason");
      return;
    }
    try {
      await updateStatus({
        variables: {
          documentId: bookingId,
          data: {
            Status_booking: "rejected",
            RejectionReason: comment,
          },
        },
        context: {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        },
      });
      await refetch();
      const { data: newData } = await refetch();
      const updatedPackage = newData.packages.find((pkg) => pkg.documentId === selectedPackage.documentId);
      setSelectedPackage(updatedPackage);
      setComment("");
      setSelectedBooking(null);
      message.success(`Booking ${bookingId} rejected. Reason: ${comment}`);
      //ตรวจสอบวถ้าไม่มี pending bookint ให้ปิด modal
      const hasPending = updatedPackage.bookings.some((b) => b.Status_booking === "pending");
      if (!hasPending) setIsModalOpen(false);
    } catch (error) {}
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

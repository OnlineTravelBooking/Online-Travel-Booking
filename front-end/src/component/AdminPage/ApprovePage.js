import React, { useState } from "react";
import { Layout, Table, Tag, Space, Typography, Badge, Card, Button, Input } from "antd";
import Sidebar from "./Sidebar";
import { GET_APPROVED_BOOKINGS } from "../../Graphql";
import { useQuery } from "@apollo/client";
import moment from "moment";
import BookingDetailsModal from "./Modal/BookingDetailsModal";
const { Title } = Typography;
const { Content } = Layout;

export default function ApprovePage() {
  const { loading, error, data } = useQuery(GET_APPROVED_BOOKINGS, {
    variables: {
      filters: {
        Status_booking: {
          eq: "approved",
        },
      },
    },
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const columns = [
    {
      title: "Customer",
      dataIndex: ["customer", "Fname"],
      render: (_, record) => `${record.customer?.Fname} ${record.customer?.Lname}`,
    },
    {
      title: "Trip",
      dataIndex: ["package", "Title"],
    },
    {
      title: "Dates",
      render: (_, record) => (
        <Tag color="blue">
          {moment(record.Start).format("DD MMM")}
          {record.End && ` - ${moment(record.End).format("DD MMM")}`}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "Status_booking",
      render: (status) => <Badge status={status === "approved" ? "success" : "default"} text={status.toUpperCase()} />,
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Content style={{ margin: "16px" }}>
          <Card style={{ borderRadius: 8 }}>
            <div style={{ marginBottom: 24 }}>
              <Title level={3}>Approved Bookings</Title>
              <div style={{ display: "flex", gap: 16 }}>
                <Input.Search placeholder="Search bookings..." style={{ width: 300 }} />
              </div>
            </div>

            <Table
              pagination={false}
              columns={columns}
              dataSource={data?.bookings || []}
              rowKey="documentId"
              expandable={{
                expandedRowRender: (record) => (
                  <div style={{ margin: 0 }}>
                    <p>
                      <strong>Participants:</strong> {record.HowManyPeople}
                    </p>
                    <p>
                      <strong>Total Price:</strong> ${record.TotalPrice}
                    </p>
                    <p>
                      <strong>Contact:</strong> {record.customer?.email}
                    </p>
                  </div>
                ),
              }}
            />
          </Card>

          {/* Booking Detail Modal */}
          {selectedBooking && (
            <BookingDetailsModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
          )}
        </Content>
      </Layout>
    </Layout>
  );
}

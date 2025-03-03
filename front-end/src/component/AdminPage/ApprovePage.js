import React, { useState } from "react";
import { Layout, Table, Tag, Space, Typography, Badge, Card, Button, Input } from "antd";
import Sidebar from "./Sidebar";
import { GET_APPROVED_BOOKINGS } from "../../Graphql";
import { useQuery } from "@apollo/client";
import moment from "moment";
import BookingDetailsModal from "./Modal/BookingDetailsModal";
import ErrorIcon from "../ErrorIcon";
import LoadingSpin from "../LoadingSpin";
const { Title } = Typography;
const { Content } = Layout;

export default function ApprovePage() {
  const { loading, error, data, refetch } = useQuery(GET_APPROVED_BOOKINGS, {
    variables: {
      filters: {
        Status_booking: {
          eq: "approved",
        },
      },
    },
  });
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Process data to group bookings by package title
  const groupedPackages =
    data?.bookings?.reduce((acc, booking) => {
      const packageTitle = booking.package?.Title || "Unnamed Package";
      if (!acc[packageTitle]) {
        acc[packageTitle] = {
          packageTitle,
          bookings: [],
        };
      }
      refetch();
      acc[packageTitle].bookings.push(booking);
      return acc;
    }, {}) || {};

  const packageData = Object.values(groupedPackages);

  // Columns for parent table (packages)
  const packageColumns = [
    {
      title: "Package",
      dataIndex: "packageTitle",
    },
    {
      title: "Number of Bookings",
      render: (_, record) => record.bookings.length,
    },
  ];


  const bookingColumns = [
    {
      title: "Customer",
      render: (_, record) => `${record.customer?.Fname} ${record.customer?.Lname}`,
      sorter: (a, b) => {
        const nameA = `${a.customer?.Fname} ${a.customer?.Lname}`.toLowerCase();
        const nameB = `${b.customer?.Fname} ${b.customer?.Lname}`.toLowerCase();
        return nameA.localeCompare(nameB);
      },
      filters: data?.bookings?.map(booking => ({
        text: `${booking.customer?.Fname} ${booking.customer?.Lname}`,
        value: `${booking.customer?.Fname} ${booking.customer?.Lname}`,
      })).filter((v, i, a) => a.findIndex(t => t.value === v.value) === i),
      onFilter: (value, record) =>
        `${record.customer?.Fname} ${record.customer?.Lname}` === value,
    },
    {
      title: "Dates",
      render: (_, record) => (
        <Tag color="blue">
          {moment(record.Start).format("DD MMM")}
          {record.End && ` - ${moment(record.End).format("DD MMM")}`}
        </Tag>
      ),
      sorter: (a, b) => moment(a.Start).unix() - moment(b.Start).unix(),
    },
    {
      title: "Status",
      dataIndex: "Status_booking",
      render: (status) => <Badge status={status === "approved" ? "success" : "default"} text={status.toUpperCase()} />,
      filters: [
        { text: "APPROVED", value: "approved" },
      ],
      onFilter: (value, record) => record.Status_booking === value,
    },
    // เพิ่ม column ใหม่สำหรับ updatedAt
    {
      title: "Last Updated",
      dataIndex: "updatedAt",
      render: (_, record) => (
        <Tag color="geekblue">
          {moment(record.updatedAt).format("DD MMM YYYY, HH:mm")}
        </Tag>
      ),
      sorter: (a, b) => moment(a.updatedAt).unix() - moment(b.updatedAt).unix(),
    },
  ];

  if (loading) return <LoadingSpin />;
  if (error) return <ErrorIcon error={error} />;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout style={{ backgroundColor: "#FFF6ee" }}>
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
              columns={packageColumns}
              dataSource={packageData}
              rowKey="packageTitle"
              expandable={{
                expandedRowRender: (packageGroup) => (
                  <Table
                    columns={bookingColumns}
                    dataSource={packageGroup.bookings}
                    rowKey="documentId"
                    // Pagination configuration
                    pagination={{
                      pageSize: 5,
                      showSizeChanger: true,
                      pageSizeOptions: ['5', '10', '20'],
                      showTotal: (total) => `Total ${total} bookings`,
                    }}
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
                ),
              }}
            />
          </Card>

          {selectedBooking && (
            <BookingDetailsModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
          )}
        </Content>
      </Layout>
    </Layout>
  );
}
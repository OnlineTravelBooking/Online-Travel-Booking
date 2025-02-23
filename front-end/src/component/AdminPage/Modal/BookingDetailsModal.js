import React from "react";
import { Modal, Collapse, List, Button, Input, Space } from "antd";
import { EyeOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import moment from "moment";

const { Panel } = Collapse;
const { TextArea } = Input;

export default function BookingDetailsModal({
  isModalOpen,
  selectedPackage,
  setIsModalOpen,
  groupBookingByDate,
  selectedBooking,
  setSelectedBooking,
  comment,
  setComment,
  handleApprove,
  handleReject,
  handleViewImage,
}) {
  return (
    <Modal
      title={`Bookings for ${selectedPackage?.Title}`}
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
      width={800}
    >
      <Collapse accordion>
        {Object.entries(groupBookingByDate(selectedPackage) || [])
          .sort(([dateA], [dateB]) => moment(dateA, "DD/MM/YYYY") - moment(dateB, "DD/MM/YYYY")) // Sort dates in ascending order
          .map(([date, bookings]) => {
            return (
              <Panel header={<span style={{ fontWeight: "bold", color: "#1890ff" }}>{date}</span>} key={date}>
                <List
                  dataSource={bookings}
                  renderItem={(booking) => (
                    <List.Item
                      actions={[
                        <Space>
                          <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewImage(booking)}>
                            View
                          </Button>
                          {selectedBooking?.documentId === booking.documentId ? (
                            <>
                              <TextArea
                                placeholder="Rejection reason"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={2}
                              />
                              <Button
                                danger
                                icon={<CloseOutlined />}
                                shape="round"
                                style={{ backgroundColor: "#ff4d4f", color: "#fff" }}
                                onClick={() => handleReject(booking.documentId)}
                              >
                                Confirm Reject
                              </Button>
                              <Button shape="round" onClick={() => setSelectedBooking(null)}>
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                type="primary"
                                icon={<CheckOutlined />}
                                shape="round"
                                style={{ backgroundColor: "#52c41a", color: "#fff" }}
                                onClick={() => handleApprove(booking.documentId)}
                              >
                                Approve
                              </Button>
                              <Button
                                danger
                                icon={<CloseOutlined />}
                                shape="round"
                                style={{ backgroundColor: "#ff4d4f", color: "#fff" }}
                                onClick={() => setSelectedBooking(booking)}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </Space>,
                      ]}
                    >
                      <List.Item.Meta
                        title={`${booking.customer?.Fname} ${booking.customer?.Lname}`}
                        description={
                          <>
                            <div>Participants: {booking.HowManyPeople}</div>
                            <div>Status: {booking.Status_booking}</div>
                            <div>Email: {booking.customer?.email}</div>
                            {booking.End && (
                              <div>
                                End Date:{" "}
                                <span style={{ fontWeight: "bold", color: "#1890ff" }}>
                                  {moment(booking.End).format("DD/MM/YYYY")}
                                </span>
                              </div>
                            )}
                          </>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Panel>
            );
          })}
      </Collapse>
    </Modal>
  );
}

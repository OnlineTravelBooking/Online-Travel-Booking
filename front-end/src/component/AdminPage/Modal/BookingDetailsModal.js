import React from "react";
import { Modal, Collapse, List, Button, Input } from "antd";
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
                        <Button type="link" onClick={() => handleViewImage(booking)}>
                          View Images
                        </Button>,
                        selectedBooking?.documentId === booking.documentId ? (
                          <>
                            <TextArea
                              placeholder="Rejection reason"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              rows={2}
                            />
                            <Button danger onClick={() => handleReject(booking.documentId)}>
                              Confirm Reject
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button type="primary" onClick={() => handleApprove(booking.documentId)}>
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

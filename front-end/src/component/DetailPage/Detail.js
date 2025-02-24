import React, { useEffect, useState } from "react";
import { UserHeader } from "../Header/UserHeader";
import { useLocation, useNavigate } from "react-router-dom";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { Button, Form, Select, message, Layout, Col, Row, Avatar } from "antd";
import { PlusOutlined, MinusOutlined, ConsoleSqlOutlined, UserOutlined, CalendarOutlined } from "@ant-design/icons";
import { TRAVEL_DATE, ALL_IMAGES_PACKAGE, APPROVE_BOOKINGSD } from "../../Graphql";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import ImageSlider from "./ImageSlider";
import { useAuth } from "../../AuthContext";
import { motion } from "framer-motion";
import "./Detail.css";

const { Option } = Select;

const { Content } = Layout;

export default function Detail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const { data, isAuthenticated } = useAuth();
  const { documentId, Title, Price, Type, Description, MeetingPoint } = location.state || {};
  const formattedType = Type.replaceAll("_", " ");
  const [totalPrice, setTotalPrice] = useState(Price);
  const [count, setCount] = useState(1);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [allImages, setAllImages] = useState([]);
  const {
    loading: loadingDate,
    error: errorDate,
    data: data_date,
  } = useQuery(TRAVEL_DATE, {
    variables: {
      filters: {
        package: {
          documentId: {
            eq: documentId,
          },
        },
      },
    },
  });

  const {
    loading: loadingImage,
    error: errorImage,
    data: data_image,
  } = useQuery(ALL_IMAGES_PACKAGE, {
    variables: {
      filters: {
        documentId: {
          eq: documentId,
        },
      },
    },
  });

  const {
    loading: loadingBooking,
    error: errorBooking,
    data: data_booking,
  } = useQuery(APPROVE_BOOKINGSD, {
    variables: {
      filters: {
        package: {
          documentId: {
            eq: documentId,
          },
        },
        Status_booking: {
          eq: "approved",
        },
      },
    },
  });

  useEffect(() => {
    if (data_date?.travelDates) {
      const formattedDates = data_date.travelDates.map((date) => ({
        documentId: date.documentId,
        Start_Date: date.Start_Date,
        End_Date: date.End_Date,
        MaxPeople: date.MaxPeople,
      }));
      // Sort dates in ascending order
      formattedDates.sort((a, b) => new Date(a.Start_Date) - new Date(b.Start_Date));
      setAvailableDates(formattedDates);
    }
  }, [data_date]);

  const handleDateChange = (key) => {
    const showDate = availableDates.find((item) => item.documentId === key);
    setSelectedDate(showDate);
    form.setFieldsValue({ select: key });
  };

  useEffect(() => {
    if (data_image?.packages[0].Image) {
      const imageUrls = data_image?.packages[0].Image.map((item) => item.url);
      setAllImages(imageUrls);
    }
  }, [data_image]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then(() => {
        isAuthenticated
          ? navigate("/transaction", {
              state: {
                data: data,
                Title: Title,
                Price: totalPrice * count,
                selectedDate: selectedDate,
                people: count,
                packageId: documentId,
              },
            })
          : navigate("/login");
      })
      .catch((err) => {
        message.log("Validation failed:", err);
      });
  };

  const onFinishFailed = (err) => {
    message.error("กรุณาเลือกวันที่");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <UserHeader />
      <Content style={{ display: "flex", flexDirection: "column" }}>
        <div className="Title-detail">
          <div>{Title}</div>
        </div>
        <div>
          <div>
            <ImageSlider allImages={allImages} />
          </div>
          <div className="Type-Trip-box">
            <div className="Type-Trip">{formattedType}</div>
          </div>
          <Row>
            <Col span={15} className="Detail">
              <div className="Detail-Tour">รายละเอียดทริปทัวร์</div>
              <BlocksRenderer content={Description} />
            </Col>
            <Col span={7} className="Detail-input">
              <div>
                <Form form={form} onFinish={handleSubmit} onFinishFailed={onFinishFailed}>
                  <div className="Background-add">
                    <Avatar shape="square" size={64} icon={<UserOutlined />} />
                    <div className="Member-Trip">จำนวนลูกค้า/ท่าน</div>
                    <div style={{ scale: "1.2" }}>
                      <Button
                        className="Add-Button"
                        type="primary"
                        shape="circle"
                        icon={<MinusOutlined />}
                        onClick={() => (count > 1 ? setCount((count) => count - 1) : setCount(1))}
                      />
                      {count}
                      <Button
                        className="Add-Button"
                        type="primary"
                        shape="circle"
                        icon={<PlusOutlined />}
                        onClick={() => setCount((count) => count + 1)}
                      />
                    </div>
                  </div>
                  <div className="line">_______________________________________________________</div>
                  {/* ช่องเลือกวันที่ */}
                  <div className="Day-Trip">
                    <Form.Item
                      name="select"
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: "กรุณาเลือกวันเที่ยว",
                        },
                      ]}
                    >
                      <div className="title-input">เลือกวันที่ต้องการจอง</div>
                      <Select placeholder="เลือกวันเที่ยว" onChange={handleDateChange}>
                        {availableDates?.map((date) => {
                          const totalPeople = data_booking?.bookings
                            ?.filter((booking) => booking.Start === date.Start_Date)
                            ?.reduce((sum, booking) => sum + booking.HowManyPeople, 0);

                          return (
                            <Option key={date.documentId} disabled={totalPeople >= date.MaxPeople}>
                              {dayjs(date.Start_Date).format("DD/MM/YYYY")}
                              {date.End_Date && ` - ${dayjs(date.End_Date).format("DD/MM/YYYY")}`}

                              {/* จำนวนสูงสุดที่จองได้ */}
                              <span
                                className="Total-people"
                                style={date.End_Date ? { marginLeft: "30%" } : { marginLeft: "70%" }}
                              >{`${totalPeople}/${date.MaxPeople}`}</span>
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="line">_______________________________________________________</div>
                  <div className="Meeting-box">จุดนัดพบ</div>
                  <div className="Meeting">{MeetingPoint}</div>
                  <div className="line">_______________________________________________________</div>
                  <div className="title-cost">ราคาที่ต้องชำระ</div>
                  <div className="Pay-box">
                    <div className="Cost">THB {count === 0 ? totalPrice : totalPrice * count}</div>
                    <div>
                      <Button className="pay-button" type="primary" htmlType="submit">
                        ชำระเงิน
                      </Button>
                    </div>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
}

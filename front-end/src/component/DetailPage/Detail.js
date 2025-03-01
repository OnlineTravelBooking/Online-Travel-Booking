import React, { useEffect, useState } from "react";
import { UserHeader } from "../Header/UserHeader";
import { useLocation, useNavigate } from "react-router-dom";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { Button, Form, Select, message, Layout, Col, Row, Avatar } from "antd";
import { PlusOutlined, MinusOutlined, UserOutlined, CalendarTwoTone, HeartOutlined, HeartFilled } from "@ant-design/icons";
import { TRAVEL_DATE, ALL_IMAGES_PACKAGE, APPROVE_BOOKINGSD } from "../../Graphql";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import ImageSlider from "./ImageSlider";
import { useAuth } from "../../AuthContext";
import "./Detail.css";
import CustomFooter from "../HomePage/Footer";
import { motion } from "framer-motion";


const { Option } = Select;
const { Content } = Layout;

export default function Detail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const { data, isAuthenticated } = useAuth();
  const { documentId, Title, Price, Type, Description, MeetingPoint, Accommodation } = location.state || {};
  const formattedType = Type.replaceAll("_", " ");
  const [totalPrice, setTotalPrice] = useState(Price);
  const [count, setCount] = useState(1);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [allImages, setAllImages] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    // โหลดข้อมูล favorites จาก localStorage เมื่อโหลดหน้า
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

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
        const totalPeople = data_booking?.bookings
          ?.filter((booking) => booking.Start === selectedDate.Start_Date)
          ?.reduce((sum, booking) => sum + booking.HowManyPeople, 0);

        const seatAvailable = count + totalPeople <= selectedDate.MaxPeople;
        if (!seatAvailable) {
          message.error("จำนวนคนมากกว่าที่จองได้");
          return;
        }
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
     const toggleFavorite = (documentId) => {
    const updatedFavorites = favorites.includes(documentId)
      ? favorites.filter((id) => id !== documentId)
      : [...favorites, documentId];

    setFavorites(updatedFavorites);

    // เก็บข้อมูล favorites ใน localStorage
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };
  return (
    <Layout style={{ backgroundColor: "#FFF6ee" }}>
      <UserHeader />
      <Content style={{ display: "flex", flexDirection: "column", maxHeight: "fit-content", marginBottom: "30px" }}>
        <div className="Title-Detail">{Title}</div>
        <div>
          <div>
            <ImageSlider allImages={allImages} />
          </div>
          <div className="Type-Trip">
            {formattedType}
            <span
              style={{
                marginLeft: "10px",
                cursor: "pointer",
                fontSize: "30px",
                marginTop: "4px",  // เพิ่มระยะห่างด้านบนเล็กน้อย
                color: favorites.includes(documentId) ? "#ff0000" : "#000",
              }}
              onClick={() => toggleFavorite(documentId)}
            >
              {favorites.includes(documentId) ? <HeartFilled /> : <HeartOutlined />}
            </span>
          </div>
          <Row>
            <Col span={15} className="Detail">
              <div className="Detail-Tour">รายละเอียดทริปทัวร์</div>
              <div className="Detail-Description">
                <BlocksRenderer content={Description} />
              </div>
            </Col>
            <Col span={7} className="Detail-input">
              <div>
                <Form form={form} onFinish={handleSubmit}>
                  {/* จำนวนลูกค้า */}
                  <div className="Member-Trip">จำนวนลูกค้า/ท่าน</div>
                  <div className="Background-add">
                    <Avatar shape="square" size={50} icon={<UserOutlined />} />
                    <div className="Box-add-button">
                      <Button
                        className="Add-Button"
                        type="primary"
                        shape="square"
                        icon={<MinusOutlined />}
                        onClick={() => (count > 1 ? setCount(count - 1) : setCount(1))}
                      />
                      <div className="Count"> {count}</div>
                      <Button
                        className="Add-Button"
                        type="primary"
                        shape="square"
                        icon={<PlusOutlined />}
                        onClick={() => setCount(count + 1)}
                      />
                    </div>
                  </div>

                  {/* ช่องเลือกวันที่ */}
                  <div className="Day-Trip">
                    <div className="title-input">เลือกวันที่ต้องการจอง🗓️</div>
                    <Form.Item
                      name="select"
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: "กรุณาเลือกวันเที่ยว",
                        },
                      ]}
                      style={{ width: "80%", margin: "0 auto", marginTop: "25px", marginBottom: "30px" }}
                    >
                      <Select placeholder="เลือกวันเที่ยว" onChange={handleDateChange} className="Select-DATE">
                        {availableDates?.map((date) => {
                          const totalPeople = data_booking?.bookings
                            ?.filter((booking) => booking.Start === date.Start_Date)
                            ?.reduce((sum, booking) => sum + booking.HowManyPeople, 0);

                          return (
                            <Option key={date.documentId} disabled={totalPeople >= date.MaxPeople}>
                              <CalendarTwoTone style={{ marginRight: "10px" }} />
                              {dayjs(date.Start_Date).format("DD/MM/YYYY")}
                              {date.End_Date && ` - ${dayjs(date.End_Date).format("DD/MM/YYYY")}`}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </div>
                  {Accommodation && (
                    <>
                      <div className="Meeting-box">สถานที่พัก</div>
                      <div className="Meeting">{Accommodation}</div>
                    </>
                  )}
                  <div className="Meeting-box">จุดนัดพบ</div>
                  <div className="Meeting">{MeetingPoint}</div>
                  <hr className="line" />
                  <div className="title-cost">ราคาที่ต้องชำระ</div>
                  <div className="Pay-box">
                    <div className="Cost">THB {totalPrice * count}</div>
                    <motion.div
                      style={{ display: "inline-flex" }}
                      whileTap={{
                        scale: 0.9,
                        transition: { type: "spring", stiffness: 1000 },
                      }}
                    >
                      <Button className="pay-button" type="primary" htmlType="submit">
                        ชำระเงิน
                      </Button>
                    </motion.div>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </div>
      </Content>
      <CustomFooter />
    </Layout>
  );
}
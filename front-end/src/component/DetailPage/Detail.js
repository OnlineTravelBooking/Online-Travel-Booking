import React, { useEffect, useState } from "react";
import { UserHeader } from "../Header";
import { useLocation, useNavigate } from "react-router-dom";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { Button, Form, Select, message } from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  ConsoleSqlOutlined,
} from "@ant-design/icons";
import { TRAVEL_DATE, ALL_IMAGES_PACKAGE } from "../../Graphql";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import ImageSlider from "./ImageSlider";
import { useAuth } from "../../AuthContext";
const { Option } = Select;

export default function Detail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const { data, isAuthenticated } = useAuth();
  const { documentId, Title, Price, Type, Description, MeetingPoint } =
    location.state || {};
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
  useEffect(() => {
    if (data_date?.travelDates) {
      const formattedDates = data_date.travelDates.map((date) => ({
        documentId: date.documentId,
        Start_Date: date.Start_Date,
        End_Date: date.End_Date,
      }));
      setAvailableDates(formattedDates);
    }
  }, [data_date]);

  const handleDateChange = (key) => {
    const showDate = availableDates.find((item) => item.documentId === key);
    setSelectedDate(showDate);
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
        console.log("Validation failed:", err);
      });
  };

  const onFinishFailed = (err) => {
    message.error("กรุณาเลือกวันที่");
  };
  return (
    <div>
      <UserHeader />
      <div>
        <div>{Title}</div>
        <div>
          <div>{Type}</div>
          <div>{MeetingPoint}</div>
          <div>
            <ImageSlider allImages={allImages} />
          </div>
          <BlocksRenderer content={Description} />
        </div>
        {/* ช่องเลือกวันที่ */}
        <div>
          <Form
            form={form}
            onFinish={handleSubmit}
            onFinishFailed={onFinishFailed}
          >
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
              <Select placeholder="เลือกวันเที่ยว" onChange={handleDateChange}>
                {availableDates?.map((date) => (
                  <Option key={date.documentId}>
                    {dayjs(date.Start_Date).format("DD/MM/YYYY")}
                    {date.End_Date &&
                      ` - ${dayjs(date.End_Date).format("DD/MM/YYYY")}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <div>{count}</div>
            <div>
              <Button
                type="primary"
                shape="circle"
                icon={<MinusOutlined />}
                onClick={() =>
                  count > 1 ? setCount((count) => count - 1) : setCount(1)
                }
              />
              {count === 0 ? totalPrice : totalPrice * count}
              <Button
                type="primary"
                shape="circle"
                icon={<PlusOutlined />}
                onClick={() => setCount((count) => count + 1)}
              />
            </div>
            <div>
              <Button type="primary" htmlType="submit">
                จองวันเที่ยว
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

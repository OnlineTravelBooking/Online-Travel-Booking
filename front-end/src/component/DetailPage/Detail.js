import React, { useEffect, useState } from "react";
import { UserHeader } from "../Header";
import { useLocation } from "react-router-dom";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { Button, Form, Select } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { TRAVEL_DATE } from "../../Graphql";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";

const { Option } = Select;
const onFinish = (values) => {
  console.log("Received values of form: ", values);
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
export default function Detail() {
  const location = useLocation();
  const { documentId, Title, Price, Type, Description } = location.state || {};
  const [totalPrice, setTotalPrice] = useState(Price);
  const [count, setCount] = useState(1);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const { loading, error, data } = useQuery(TRAVEL_DATE, {
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

  useEffect(() => {
    if (data?.travelDates) {
      const formattedDates = data.travelDates.map((date) => ({
        Start_Date: date.Start_Date, //dayjs(date.Start_Date, "DD/MM/YYYY"),
        End_Date: date.End_Date, //dayjs(date.End_Date, "DD/MM/YYYY"),
      }));
      setAvailableDates(formattedDates);
    }
  }, [data]);

  return (
    <div>
      <UserHeader />
      <div>
        <div>{Title}</div>

        <div>
          <div>{Type}</div>
          <BlocksRenderer content={Description} />
        </div>

        <div>
          <Form
            name="validate_other"
            {...formItemLayout}
            onFinish={onFinish}
            initialValues={{
              "input-number": 3,
              "checkbox-group": ["A", "B"],
              rate: 3.5,
              "color-picker": null,
            }}
            style={{
              maxWidth: 600,
            }}
          />

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
            <Select placeholder="เลือกวันเที่ยว">
              {availableDates?.map((date) => (
                <Option key={date.Start_Date} value={date.Start_Date}>
                  {dayjs(date.Start_Date).format("DD/MM/YYYY")}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

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
      </div>
    </div>
  );
}

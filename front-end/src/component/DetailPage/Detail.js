import React, { useEffect, useState } from "react";
import { UserHeader } from "../Header";
import { useLocation } from "react-router-dom";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { Button, DatePicker } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { TRAVEL_DATE } from "../../Graphql";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

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
        Start_Date: dayjs(date.Start_Date, "DD/MM/YYYY"),
        End_Date: dayjs(date.End_Date, "DD/MM/YYYY"),
      }));
      setAvailableDates(formattedDates);
    }
  }, [data]);

  const disabledDate = (current) => {
    return !availableDates.some(({ Start_Date, End_Date }) => {
      return (
        current.isBetween(Start_Date, End_Date, "day", "[]") ||
        current.isSame(Start_Date, "day") ||
        current.isSame(End_Date, "day")
      );
    });
  };

  return (
    <div>
      <UserHeader />
      <div>
        <div>{Title}</div>
        <div>
          <div>{Type}</div>
          <BlocksRenderer content={Description} />
        </div>

        {/* Date Picker Section */}
        <div style={{ margin: "16px 0" }}>
          <DatePicker
            format="YYYY-MM-DD"
            onChange={setSelectedDate}
            disabledDate={disabledDate}
            placeholder="Select available date"
          />
          {selectedDate && (
            <div style={{ marginTop: 8 }}>
              Selected Date: {selectedDate.format("MMMM Do, YYYY")}
            </div>
          )}
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

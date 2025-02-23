import React, { useState } from "react";
import { Button, Checkbox, Slider, DatePicker, Form, InputNumber, Layout, Space } from "antd";
import { FilterOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { Sider } = Layout;

export default function SiderFilter({ onFilter }) {
  const [form] = Form.useForm();
  const [priceRange, setPriceRange] = useState([0, 10000]);

  const handleSubmit = (values) => {
    const processedValues = {
      ...values,
      travelDate: values.travelDate?.map((date) => date?.format("YYYY-MM-DD")),
    };
    onFilter(processedValues);
    console.log("travelDate: ", processedValues);
  };

  const handleMinChange = (min) => {
    const newRange = [min, priceRange[1]];
    setPriceRange(newRange);
    form.setFieldsValue({ priceRange: newRange });
  };

  const handleMaxChange = (max) => {
    const newRange = [priceRange[0], max];
    setPriceRange(newRange);
    form.setFieldsValue({ priceRange: newRange });
  };

  const handleSliderChange = (value) => {
    setPriceRange(value);
    form.setFieldsValue({ priceRange: value });
  };

  return (
    <Sider className="Filter-Box" width="100%">
      <Form form={form} onFinish={handleSubmit} className="Filter-form" layout="vertical">
        <h2 style={{ color: "white", textAlign: "center" }}>
          <FilterOutlined /> ค้นหาทริป
        </h2>

        <Form.Item label="ประเภททริป" name="types">
          <Checkbox.Group>
            <Space direction="vertical">
              <Checkbox value="One_day_trip">ทริปวันเดียว</Checkbox>
              <Checkbox value="Multi_day_trip">ทริปหลายวัน</Checkbox>
            </Space>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item label="ช่วงราคา (บาท)" name="priceRange">
          <div style={{ display: "flex", alignItems: "center" }}>
            <InputNumber
              placeholder="ราคาต่ำสุด"
              min={0}
              max={priceRange[1]}
              style={{ width: "40%" }}
              value={priceRange[0]}
              onChange={handleMinChange}
            />
            <div
              style={{
                width: "25px",
                height: "2px",
                backgroundColor: "#005C78",
                margin: "0 10px",
              }}
            ></div>

            <InputNumber
              placeholder="ราคาสูงสุด"
              min={priceRange[0]} // ไม่ให้ต่ำกว่าราคาต่ำสุด
              max={10000}
              style={{ width: "40%" }}
              value={priceRange[1]}
              onChange={handleMaxChange}
            />
          </div>

          <Slider range min={0} max={10000} step={100} value={priceRange} onChange={handleSliderChange} />
        </Form.Item>

        <Form.Item label="วันที่เดินทาง" name="travelDate">
          <RangePicker style={{ width: "100%" }} placeholder={["เริ่มต้น", "สิ้นสุด"]} format="DD-MM-YYYY" />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
          style={{
            backgroundColor: "#005c78",
            fontWeight: "bold",
          }}
        >
          กรองผลลัพธ์
        </Button>
      </Form>
    </Sider>
  );
}

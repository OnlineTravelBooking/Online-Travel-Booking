import React, { useState } from "react";
import { Button, Slider, Form, InputNumber } from "antd";
import { FilterOutlined } from "@ant-design/icons";

export default function PriceFilter({ onFilter }) {
  const [form] = Form.useForm();
  const [priceRange, setPriceRange] = useState([0, 10000]);

  const handleSubmit = (values) => {
    const processedValues = {
      ...values,
    };
    onFilter(processedValues);
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
    <div className="Filter-Box">
      <Form form={form} onFinish={handleSubmit} className="Filter-form" layout="vertical">
        <h4 style={{ color: "white", textAlign: "center" }}>
          <FilterOutlined /> กรองด้วยราคา
        </h4>

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
              min={priceRange[0]}
              max={10000}
              style={{ width: "40%" }}
              value={priceRange[1]}
              onChange={handleMaxChange}
            />
          </div>

          <Slider range min={0} max={10000} step={100} value={priceRange} onChange={handleSliderChange} />
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
    </div>
  );
}

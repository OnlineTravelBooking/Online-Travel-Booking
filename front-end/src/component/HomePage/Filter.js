import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Slider,
  DatePicker,
  Form,
  InputNumber,
  Layout,
  Space,
} from "antd";
import { FilterOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { Sider } = Layout;

export default function SiderFilter() {
  const [form] = Form.useForm();

  return (
    <Sider className="Filter-Box" width="100%">
      <Form form={form} className="Filter-form" layout="vertical">
        <h2 style={{ color: "white", textAlign: "center" }}>
          <FilterOutlined /> ค้นหาทริป
        </h2>

        <Form.Item label="ประเภททริป" name="types">
          <Checkbox.Group>
            <Space direction="vertical">
              <Checkbox value="One day trip">ทริปวันเดียว</Checkbox>
              <Checkbox value="Multi day trip">ทริปหลายวัน</Checkbox>
            </Space>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item label="ช่วงราคา (บาท)" name="priceRange">
          <div style={{ display: "flex", alignItems: "center" }}>
            <InputNumber
              placeholder="ราคาต่ำสุด"
              min={0}
              style={{ width: "40%" }}
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
              min={0}
              style={{ width: "40%" }}
            />
          </div>
          <Slider
            range
            min={0}
            max={20000}
            step={100}
            defaultValue={[0, 20000]}
            style={{ marginBottom: -10 }}
          />
        </Form.Item>
        <Form.Item label="วันที่เดินทาง" name="travelDate">
          <RangePicker
            style={{ width: "100%" }}
            placeholder={["เริ่มต้น", "สิ้นสุด"]}
          />
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

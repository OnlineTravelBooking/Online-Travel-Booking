import React, { useState } from "react";
import {
  Button,
  Cascader,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Mentions,
  Segmented,
  Select,
  TreeSelect,
  Radio,
  Layout,
} from "antd";
import { FilterOutlined } from "@ant-design/icons";

const { Sider } = Layout;
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function SiderFilter() {
  const [form] = Form.useForm();
  const variant = Form.useWatch("variant", form);
  return (
    <div className="Filter-Box">
      <Form
        form={form}
        variant={variant || "filled"}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          variant: "filled",
        }}
        className="Filter-form"
      >
        <Form.Item label="Input" name="Input">
          <Input />
        </Form.Item>
        <Radio>One day trip</Radio>
        <Radio>Muti day trip</Radio>
        <Form.Item label="DatePicker" name="DatePicker">
          <DatePicker />
        </Form.Item>
        <Form.Item label="RangePicker" name="RangePicker">
          <RangePicker />
        </Form.Item>
      </Form>
    </div>
  );
}

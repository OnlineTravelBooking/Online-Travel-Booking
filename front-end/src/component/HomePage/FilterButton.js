import React, { useState } from "react";
import { DatePicker, Form, Layout, Space, Button } from "antd";

const { RangePicker } = DatePicker;
const { Sider } = Layout;

export default function FilterButton({ onFilter }) {
  const [form] = Form.useForm();
  const [selectedTypes, setSelectedTypes] = useState([]);

  const handleTypeToggle = (type) => {
    const newTypes = selectedTypes.includes(type) ? selectedTypes.filter((t) => t !== type) : [...selectedTypes, type];

    setSelectedTypes(newTypes);
    form.setFieldsValue({ types: newTypes });
    onFilter({ types: newTypes });
  };

  const handleValuesChange = (changedValues, allValues) => {
    const processedValues = {
      ...allValues,
      travelDate: allValues.travelDate?.map((date) => date?.format("YYYY-MM-DD")),
    };
    onFilter(processedValues);
  };

  return (
    <Form className="Filter-bar" form={form} onValuesChange={handleValuesChange} layout="inline">
      <Form.Item name="travelDate" className="Select-Date">
        <RangePicker placeholder={["เริ่มต้น", "สิ้นสุด"]} format="DD-MM-YYYY" style={{ width: 250 }} />
      </Form.Item>

      <Form.Item className="Filter-Button" name="types">
        <Button
          className="One-Button"
          type={selectedTypes.includes("One_Day_Trip") ? "primary" : "default"}
          onClick={() => handleTypeToggle("One_Day_Trip")}
        >
          One Day Trip 🚍
        </Button>

        <Button
          className="Muti-Button"
          type={selectedTypes.includes("Multi_Day_Trip") ? "primary" : "default"}
          onClick={() => handleTypeToggle("Multi_Day_Trip")}
        >
          Package พร้อมที่พัก 🏢
        </Button>
      </Form.Item>
    </Form>
  );
}

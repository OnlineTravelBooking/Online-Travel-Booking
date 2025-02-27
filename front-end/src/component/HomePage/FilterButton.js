import React, { useState } from "react";
import { DatePicker, Form, Button } from "antd";
import { motion } from "framer-motion";

const { RangePicker } = DatePicker;

export default function FilterButton({ onFilter }) {
  const [form] = Form.useForm();
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [hasInput, setHasInput] = useState(false);

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

  const handleChange = (dates, dateStrings) => {
    if (dateStrings[0] && dateStrings[1]) {
      setHasInput(true);
    } else {
      setHasInput(false);
    }
  };

  return (
    <Form className="Filter-bar" form={form} onValuesChange={handleValuesChange} layout="inline">
      <Form.Item name="travelDate" className="Select-Date">
        <RangePicker
          className={`Rage-picker ${hasInput ? "input-success" : ""}`}
          placeholder={["เริ่มต้น", "สิ้นสุด"]}
          format="DD-MM-YYYY"
          style={{ width: 250 }}
          onChange={handleChange}
        />
      </Form.Item>

      <Form.Item className="Filter-Button" name="types">
        <motion.div
          style={{ display: "inline-flex" }}
          whileTap={{
            scale: 0.9,
            transition: { type: "spring", stiffness: 1000 },
          }}
        >
          <Button
            className="One-Button"
            type={selectedTypes.includes("One_Day_Trip") ? "primary" : "default"}
            onClick={() => handleTypeToggle("One_Day_Trip")}
          >
            One Day Trip 🚍
          </Button>
        </motion.div>
        <motion.div
          style={{ display: "inline-flex" }}
          whileTap={{
            scale: 0.9,
            transition: { type: "spring", stiffness: 1000 },
          }}
        >
          <Button
            className="Muti-Button"
            type={selectedTypes.includes("Multi_Day_Trip") ? "primary" : "default"}
            onClick={() => handleTypeToggle("Multi_Day_Trip")}
          >
            Package พร้อมที่พัก 🏢
          </Button>
        </motion.div>
      </Form.Item>
    </Form>
  );
}

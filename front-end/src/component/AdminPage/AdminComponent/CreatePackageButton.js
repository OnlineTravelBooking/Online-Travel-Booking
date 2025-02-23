"use client";
import { Radio, Space, Button, Dropdown, Menu, DatePicker, Modal } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import { DeleteOutlined, PlusOutlined, DownOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import "./CreatePackageButton.css";

const { RangePicker } = DatePicker;

export default function CreateButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    type: "One Day Trip",
    description: "",
    price: "",
    meetingPoint: "",
    dates: [],
    ranges: [],
  });
  const [errors, setErrors] = useState({});
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title || formData.title.length < 2) newErrors.title = "Title must be at least 2 characters";
    if (!formData.type) newErrors.type = "Please select a tour type";
    if (!formData.description || formData.description.length < 10)
      newErrors.description = "Description must be at least 10 characters";
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0)
      newErrors.price = "Please enter a valid price";
    if (!formData.meetingPoint) newErrors.meetingPoint = "Please enter a meeting point";
    if (images.length === 0) newErrors.images = "Please upload at least one image";
    if (
      (formData.type === "One Day Trip" && formData.dates.length === 0) ||
      (formData.type === "Multi Day Trip" && formData.ranges.length === 0)
    ) {
      newErrors.dates = "Please select at least one date or date range";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showToast = (message, type = "success") => {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const uploadedImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...uploadedImages]);
    // showToast("Images added to preview");
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    if (currentImageIndex >= index && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const convertHtmlToJSONFormat = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const elements = Array.from(doc.body.childNodes); // ใช้ childNodes เพื่อรวม text nodes

    const processNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        return [{ type: "text", text: node.textContent.trim() }];
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return [];

      const children = [];
      const processChildNodes = (childNodes) => {
        return Array.from(childNodes).flatMap((child) => {
          if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
            return [{ type: "text", text: child.textContent.trim() }];
          }
          if (child.nodeType !== Node.ELEMENT_NODE) return [];

          const childContent = processChildNodes(child.childNodes);
          const textNode = childContent.length > 0 ? childContent : [{ type: "text", text: child.textContent || "" }];

          if (child.tagName === "A") {
            return [
              {
                type: "link",
                url: child.getAttribute("href") || "",
                children: textNode,
              },
            ];
          }

          const applyStyles = (node) => {
            return textNode.map((node) => {
              if (child.tagName === "B" || child.tagName === "STRONG") node.bold = true;
              if (child.tagName === "I" || child.tagName === "EM") node.italic = true;
              if (child.tagName === "U") node.underline = true;
              if (child.tagName === "CODE") node.code = true;
              if (child.tagName === "STRIKE" || child.tagName === "S") node.strikethrough = true;
              return node;
            });
          };

          return applyStyles(child);
        });
      };

      const tagName = node.tagName?.toUpperCase();
      if (tagName === "H1" || tagName === "H2") {
        return {
          type: "heading",
          level: tagName === "H1" ? 1 : 2,
          children: processChildNodes(node.childNodes),
        };
      }
      if (tagName === "P") {
        return {
          type: "paragraph",
          children: processChildNodes(node.childNodes),
        };
      }
      if (tagName === "UL" || tagName === "OL") {
        return {
          type: "list",
          format: tagName === "UL" ? "unordered" : "ordered",
          children: Array.from(node.children).map((li) => ({
            type: "list-item",
            children: processChildNodes(li.childNodes),
          })),
        };
      }

      return { type: "paragraph", children: processChildNodes(node.childNodes) };
    };

    const jsonContent = elements.flatMap(processNode).filter((block) => block.children.length > 0);

    return jsonContent.length > 0
      ? jsonContent
      : [
          {
            type: "paragraph",
            children: [{ type: "text", text: "" }],
          },
        ];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast("Please fix the errors in the form", "error");
      return;
    }

    setIsUploading(true);
    const token = sessionStorage.getItem("token");

    try {
      // 1. POST รูปภาพ
      const imageUploadPromises = images.map(async (image) => {
        const imageFormData = new FormData();
        imageFormData.append("files", image.file);

        const response = await axios.post("http://localhost:1337/api/upload", imageFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data[0].id;
      });

      const imageIds = await Promise.all(imageUploadPromises);
      // showToast("Images uploaded successfully");

      // 2. POST package
      const packagePayload = {
        data: {
          Title: formData.title,
          Type: formData.type,
          Description: convertHtmlToJSONFormat(formData.description),
          Price: parseFloat(formData.price),
          MeetingPoint: formData.meetingPoint,
          Image: imageIds.length === 1 ? imageIds[0] : imageIds,
        },
      };

      const packageResponse = await axios.post("http://localhost:1337/api/packages", packagePayload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const packageId = packageResponse.data.data.id - 1;
      showToast("Package created successfully");

      // 3. POST travel dates
      const datePayloads =
        formData.type === "One Day Trip"
          ? formData.dates.map((date) => ({
              data: {
                package: packageId,
                Start_Date: date.format("YYYY-MM-DD"),
                End_Date: date.format("YYYY-MM-DD"),
              },
            }))
          : formData.ranges.map((range) => ({
              data: {
                package: packageId,
                Start_Date: range[0].format("YYYY-MM-DD"),
                End_Date: range[1].format("YYYY-MM-DD"),
              },
            }));

      const dateUploadPromises = datePayloads.map((payload) =>
        axios.post("http://localhost:1337/api/travel-dates", payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
      );

      await Promise.all(dateUploadPromises);
      // showToast("Travel dates created successfully");

      // Reset form
      setFormData({
        title: "",
        type: "One Day Trip",
        description: "",
        price: "",
        meetingPoint: "",
        dates: [],
        ranges: [],
      });
      setImages([]);
      setCurrentImageIndex(0);
    } catch (error) {
      console.error("Error during submission:", error.response?.data || error.message);
      showToast(`Failed to create package: ${error.message}`, "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRadioChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      type: value,
      dates: [],
      ranges: [],
    }));
    setDropdownVisible(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));
    if (errors.description && value.length >= 10) {
      setErrors((prev) => ({ ...prev, description: "" }));
    }
  };

  const isDuplicate = (newValue, values, index, isRange = false) => {
    if (!newValue) return false;
    return isRange
      ? values.some(
          (r, i) =>
            i !== index &&
            r.length === 2 &&
            ((newValue[0].isBefore(r[1]) && newValue[1].isAfter(r[0])) ||
              newValue[0].isSame(r[0], "day") ||
              newValue[1].isSame(r[1], "day"))
        )
      : values.some((d, i) => i !== index && d && d.isSame(newValue, "day"));
  };

  const updateItem = (key, value, index) => {
    if (isDuplicate(value, formData[key], index, key === "ranges")) return;
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].map((item, i) => (i === index ? value : item)),
    }));
    if (errors.dates) {
      setErrors((prev) => ({ ...prev, dates: "" }));
    }
  };

  const addItem = (key) =>
    setFormData((prev) => ({
      ...prev,
      [key]: [...prev[key], key === "ranges" ? [] : null],
    }));

  const removeItem = (key, index) =>
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));

  const renderMenu = (isDayTrip) => {
    const key = isDayTrip ? "dates" : "ranges";
    const items = formData[key];
    return (
      <div className={`scrollable-dropdown ${items.length > 3 ? "scroll-active" : ""}`}>
        <Menu onClick={(e) => e.domEvent.stopPropagation()}>
          {items.map((item, index) => (
            <Menu.Item key={index}>
              <Space>
                {isDayTrip ? (
                  <DatePicker
                    value={item}
                    onChange={(date) => updateItem(key, date, index)}
                    format="YYYY-MM-DD"
                    size="large"
                  />
                ) : (
                  <RangePicker
                    value={item}
                    onChange={(ranges) => updateItem(key, ranges, index)}
                    format="YYYY-MM-DD"
                    size="large"
                  />
                )}
                <Button type="danger" icon={<DeleteOutlined />} onClick={() => removeItem(key, index)} />
              </Space>
            </Menu.Item>
          ))}
          <Menu.Divider />
          <Menu.Item key="add">
            <Button type="dashed" onClick={() => addItem(key)} block icon={<PlusOutlined />}>
              เพิ่ม{isDayTrip ? "วันที่" : "ช่วงวันที่"}
            </Button>
          </Menu.Item>
        </Menu>
      </div>
    );
  };

  return (
    <div>
      <Button type="dashed" className="add-package-btn" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
        เพิ่มแพ็คเกจ
      </Button>
      <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={"80%"}>
        <div className="container">
          <div className="card">
            <div className="header">
              <h1>สร้างแพ็คเกจทัวร์</h1>
            </div>

            <div className="content">
              <div className="image-section">
                <div className="image-preview">
                  {images.length > 0 ? (
                    <>
                      <img
                        src={images[currentImageIndex].url || "/placeholder.svg"}
                        alt="Tour preview"
                        className="main-image"
                      />
                      {images.length > 1 && (
                        <div className="slideshow-controls">
                          <button
                            className="nav-button"
                            onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                          >
                            ←
                          </button>
                          <button
                            className="nav-button"
                            onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                          >
                            →
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="upload-placeholder">
                      <p>No images uploaded</p>
                    </div>
                  )}
                </div>

                <div className="upload-container">
                  <label className="upload-button" htmlFor="image-upload">
                    {isUploading ? "Uploading..." : "Upload Images"}
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      hidden
                    />
                  </label>
                </div>

                {images.length > 0 && (
                  <div className="thumbnail-container">
                    {images.map((image, index) => (
                      <div key={index} className={`thumbnail ${index === currentImageIndex ? "active" : ""}`}>
                        <img src={image.url} alt={`Preview ${index + 1}`} onClick={() => setCurrentImageIndex(index)} />
                        <button
                          className="delete-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index);
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {errors.images && <span className="error">{errors.images}</span>}
              </div>

              <div className="form-section">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="title">ชื่อแพ็คเกจทัวร์</label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter tour title"
                    />
                    {errors.title && <span className="error">{errors.title}</span>}
                  </div>

                  <div className="form-group">
                    <label>ประเภทแพ็คเกจทัวร์</label>
                    <div className="radio-group-full">
                      <Radio.Group
                        value={formData.type}
                        onChange={handleRadioChange}
                        optionType="button"
                        buttonStyle="solid"
                        className="full-width-radio"
                      >
                        <Radio value="One Day Trip">One Day Trip</Radio>
                        <Radio value="Multi Day Trip">Multi Day Trip</Radio>
                      </Radio.Group>
                    </div>
                    {errors.type && <span className="error">{errors.type}</span>}
                  </div>

                  <div className="form-group">
                    <Dropdown
                      overlay={renderMenu(formData.type === "One Day Trip")}
                      trigger={["click"]}
                      visible={dropdownVisible}
                      onVisibleChange={setDropdownVisible}
                    >
                      <Button size="large">
                        เลือก{formData.type === "One Day Trip" ? "วันที่" : "ช่วงวันที่"} <DownOutlined />
                      </Button>
                    </Dropdown>
                    {errors.dates && <span className="error">{errors.dates}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">คำอธิบาย</label>
                    <ReactQuill
                      value={formData.description}
                      onChange={handleDescriptionChange}
                      placeholder="Enter tour description"
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, 3, false] }],
                          ["bold", "italic", "underline"],
                          ["link"],
                          [{ list: "ordered" }, { list: "bullet" }],
                          ["clean"],
                        ],
                      }}
                    />
                    {errors.description && <span className="error">{errors.description}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="price">ราคา</label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="Enter price"
                    />
                    {errors.price && <span className="error">{errors.price}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="meetingPoint">จุดนัดพบ</label>
                    <input
                      id="meetingPoint"
                      name="meetingPoint"
                      type="text"
                      value={formData.meetingPoint}
                      onChange={handleInputChange}
                      placeholder="Enter meeting point"
                    />
                    {errors.meetingPoint && <span className="error">{errors.meetingPoint}</span>}
                  </div>

                  <div className="button-group">
                    <button type="submit" className="primary-button" disabled={isUploading}>
                      สร้างแพ็คเกจ
                    </button>
                    <button
                      type="button"
                      className="secondary-button"
                      disabled={isUploading}
                      onClick={() => handleModalClose()}
                    >
                      ยกเลิก
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

"use client";
import { Radio, Space, Button, Dropdown, Menu, DatePicker } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import { DeleteOutlined, PlusOutlined, DownOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill"; // เพิ่ม Rich Text Editor
import "react-quill/dist/quill.snow.css"; // CSS สำหรับ ReactQuill
import "./TourForm.css";

const { RangePicker } = DatePicker;

export default function TourForm({ onClose }) { // เพิ่ม prop onClose เพื่อปิด popup
    const [images, setImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [formData, setFormData] = useState({
        title: "",
        type: "day_trip",
        description: "",
        price: "",
        meetingPoint: "",
        dates: [],
        ranges: []
    });
    const [errors, setErrors] = useState({});
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [isUploading, setIsUploading] = useState(false); // รักษาไว้ตามคำสั่ง

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title || formData.title.length < 2) {
            newErrors.title = "Title must be at least 2 characters";
        }
        if (!formData.type) {
            newErrors.type = "Please select a tour type";
        }
        if (!formData.description || formData.description.length < 10) {
            newErrors.description = "Description must be at least 10 characters";
        }
        if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
            newErrors.price = "Please enter a valid price";
        }
        if (!formData.meetingPoint) {
            newErrors.meetingPoint = "Please enter a meeting point";
        }
        if (images.length === 0) {
            newErrors.images = "Please upload at least one image";
        }
        if ((formData.type === "day_trip" && formData.dates.length === 0) ||
            (formData.type === "multi_day_trip" && formData.ranges.length === 0)) {
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
        showToast("Images added to preview");
    };

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        if (currentImageIndex >= index && currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            showToast("Please fix the errors in the form", "error");
            return;
        }
        // แสดงข้อมูลใน console เพื่อเตรียม POST
        console.log("Form Data to be submitted:", {
            ...formData,
            images: images.map(img => img.file) // ส่งเฉพาะ file objects
        });
        showToast("Tour package data prepared successfully");
        // Reset form
        setFormData({
            title: "",
            type: "day_trip",
            description: "",
            price: "",
            meetingPoint: "",
            dates: [],
            ranges: []
        });
        setImages([]);
        setCurrentImageIndex(0);
        onClose(); // ปิด popup
    };

    const handleRadioChange = (e) => {
        const { value } = e.target;
        setFormData((prev) => ({
            ...prev,
            type: value,
            dates: [],
            ranges: []
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

    const handleDescriptionChange = (value) => { // เพิ่มสำหรับ Rich Text
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
            ? values.some((r, i) => i !== index && r.length === 2 && (
                (newValue[0].isBefore(r[1]) && newValue[1].isAfter(r[0])) ||
                newValue[0].isSame(r[0], 'day') || newValue[1].isSame(r[1], 'day')
            ))
            : values.some((d, i) => i !== index && d && d.isSame(newValue, 'day'));
    };

    const updateItem = (key, value, index) => {
        if (isDuplicate(value, formData[key], index, key === "ranges")) return;
        setFormData(prev => ({
            ...prev,
            [key]: prev[key].map((item, i) => i === index ? value : item)
        }));
        if (errors.dates) {
            setErrors((prev) => ({ ...prev, dates: "" }));
        }
    };

    const addItem = (key) => setFormData(prev => ({
        ...prev,
        [key]: [...prev[key], key === "ranges" ? [] : null]
    }));

    const removeItem = (key, index) => setFormData(prev => ({
        ...prev,
        [key]: prev[key].filter((_, i) => i !== index)
    }));

    const renderMenu = (isDayTrip) => {
        const key = isDayTrip ? "dates" : "ranges";
        const items = formData[key];
        return (
            <div className={`scrollable-dropdown ${items.length > 3 ? 'scroll-active' : ''}`}>
                <Menu onClick={e => e.domEvent.stopPropagation()}>
                    {items.map((item, index) => (
                        <Menu.Item key={index}>
                            <Space>
                                {isDayTrip ? (
                                    <DatePicker
                                        value={item}
                                        onChange={date => updateItem(key, date, index)}
                                        format="YYYY-MM-DD"
                                        size="large"
                                    />
                                ) : (
                                    <RangePicker
                                        value={item}
                                        onChange={ranges => updateItem(key, ranges, index)}
                                        format="YYYY-MM-DD"
                                        size="large"
                                    />
                                )}
                                <Button
                                    type="danger"
                                    icon={<DeleteOutlined />}
                                    onClick={() => removeItem(key, index)}
                                />
                            </Space>
                        </Menu.Item>
                    ))}
                    <Menu.Divider />
                    <Menu.Item key="add">
                        <Button
                            type="dashed"
                            onClick={() => addItem(key)}
                            block
                            icon={<PlusOutlined />}
                        >
                            เพิ่ม{isDayTrip ? "วันที่" : "ช่วงวันที่"}
                        </Button>
                    </Menu.Item>
                </Menu>
            </div>
        );
    };

    return (
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
                                        <button className="delete-button" onClick={() => removeImage(index)}>
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
                                <div className="radio-group-full"> {/* เพิ่ม div เพื่อควบคุมความยาว */}
                                    <Radio.Group
                                        value={formData.type}
                                        onChange={handleRadioChange}
                                        optionType="button"
                                        buttonStyle="solid"
                                        className="full-width-radio" // เพิ่ม className
                                    >
                                        <Radio value="day_trip">Day Trip</Radio>
                                        <Radio value="multi_day_trip">Multi Day Trip</Radio>
                                    </Radio.Group>
                                </div>
                                {errors.type && <span className="error">{errors.type}</span>}
                            </div>

                            <div className="form-group">
                                <Dropdown
                                    overlay={renderMenu(formData.type === "day_trip")}
                                    trigger={["click"]}
                                    visible={dropdownVisible}
                                    onVisibleChange={setDropdownVisible}
                                >
                                    <Button size="large">
                                        เลือก{formData.type === "day_trip" ? "วันที่" : "ช่วงวันที่"} <DownOutlined />
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
                                            [{ header: [1, 2, false] }],
                                            ['bold', 'italic', 'underline'],
                                            ['link', 'image'],
                                            [{ list: 'ordered' }, { list: 'bullet' }],
                                            ['clean']
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
                                    onClick={onClose} // ปิด popup แทนการเปลี่ยน route
                                    disabled={isUploading}
                                >
                                    ยกเลิก
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
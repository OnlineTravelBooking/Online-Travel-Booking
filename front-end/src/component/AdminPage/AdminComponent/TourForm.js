"use client";
import { Radio } from "antd";
import { useState } from "react";
import axios from "axios";
import "./TourForm.css";

export default function TourForm() {
    const [images, setImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [formData, setFormData] = useState({
        title: "",
        type: "",
        description: "",
        price: "",
        meetingPoint: "",
    });
    const [errors, setErrors] = useState({});
    const [isUploading, setIsUploading] = useState(false);

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
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const showToast = (message, type = "success") => {
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add("show");
        }, 100);
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const uploadedImages = files.map((file) => ({
            file,
            url: URL.createObjectURL(file), // แค่สร้าง preview
        }));

        setImages((prev) => [...prev, ...uploadedImages]);
        showToast("Images added to preview");
    };

    // ฟังก์ชันสำหรับลบรูปภาพที่เลือก
    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        if (currentImageIndex >= index && currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            showToast("Please fix the errors in the form", "error");
            return;
        }

        setIsUploading(true);

        try {
            // อัพโหลดรูปภาพทั้งหมดก่อน
            const imageUploadPromises = images.map(async (image) => {
                const formData = new FormData();
                formData.append("files", image.file);

                const response = await axios.post("http://localhost:1337/api/upload", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                });

                return response.data[0].id; // ได้ ID ของรูปภาพจาก Strapi
            });

            const imageIds = await Promise.all(imageUploadPromises);

            // เตรียมข้อมูลที่ต้องส่งไปยัง Strapi
            const payload = {
                data: {
                    Title: formData.title,
                    Type: formData.type,
                    Description: formData.description,
                    Price: parseFloat(formData.price),
                    MeetingPoint: formData.meetingPoint,
                    images: imageIds, // ใช้ ID ของรูปภาพที่อัปโหลด
                },
            };

            const response = await axios.post("http://localhost:1337/api/packages", payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
            });

            if (response.status === 200) {
                showToast("Tour package created successfully");
                setFormData({ title: "", type: "", description: "", price: "", meetingPoint: "" });
                setImages([]);
                setCurrentImageIndex(0);
            } else {
                showToast("Failed to create tour package", "error");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            showToast("Failed to create tour package", "error");
        } finally {
            setIsUploading(false);
        }
    };



    const handleRadioChange = (e) => {
        const { value } = e.target;
        setFormData((prev) => ({
            ...prev,
            type: value,  // Update the formData with selected radio button value
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    return (
        <div className="container">
            <div className="card">
                <div className="header">
                    <h1>สร้างแพ็คเกจทัวร์</h1>
                </div>

                <div className="content">
                    {/* Image Upload Section */}
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

                    {/* Form Section */}
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

                            <div>
                                <label htmlFor="type">ประเภทแพ็คเกจทัวร์</label>
                                <Radio.Group
                                    block
                                    onChange={handleRadioChange}
                                    defaultValue="day_trip"  // Set the default value here
                                    optionType="button"
                                    buttonStyle="solid"
                                >
                                    <Radio value="day_trip">Day Trip</Radio>
                                    <Radio value="multi_day_trip">Multi Day Trip</Radio>
                                </Radio.Group>
                                {errors.type && <span className="error">{errors.type}</span>}
                            </div>



                            <div className="form-group">
                                <label htmlFor="description">คำอธิบาย</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter tour description"
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
                                    onClick={() => (window.location.href = "/admin")}
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
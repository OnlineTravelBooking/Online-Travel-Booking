"use client"

import { useState } from "react"
import "./TourForm.css"

export default function TourForm() {
    const [images, setImages] = useState([])
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [formData, setFormData] = useState({
        title: "",
        type: "",
        description: "",
        price: "",
        meetingPoint: "",
    })
    const [errors, setErrors] = useState({})
    const [isUploading, setIsUploading] = useState(false)

    const validateForm = () => {
        const newErrors = {}
        if (!formData.title || formData.title.length < 2) {
            newErrors.title = "Title must be at least 2 characters"
        }
        if (!formData.type) {
            newErrors.type = "Please select a tour type"
        }
        if (!formData.description || formData.description.length < 10) {
            newErrors.description = "Description must be at least 10 characters"
        }
        if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
            newErrors.price = "Please enter a valid price"
        }
        if (!formData.meetingPoint) {
            newErrors.meetingPoint = "Please enter a meeting point"
        }
        if (images.length === 0) {
            newErrors.images = "Please upload at least one image"
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const showToast = (message, type = "success") => {
        const toast = document.createElement("div")
        toast.className = `toast ${type}`
        toast.textContent = message
        document.body.appendChild(toast)
        setTimeout(() => {
            toast.classList.add("show")
        }, 100)
        setTimeout(() => {
            toast.classList.remove("show")
            setTimeout(() => {
                document.body.removeChild(toast)
            }, 300)
        }, 3000)
    }

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setIsUploading(true);
        const uploadedImages = [];

        try {
            // เก็บภาพไว้ใน state images แต่ยังไม่ส่งไปที่ API
            files.forEach((file) => {
                uploadedImages.push({
                    file,
                    url: URL.createObjectURL(file), // ใช้ local URL ก่อน
                });
            });

            setImages((prev) => [...prev, ...uploadedImages]);
            showToast("Images uploaded successfully");
        } catch (error) {
            console.error("Upload error:", error);
            showToast("Failed to upload images", "error");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            showToast("Please fix the errors in the form", "error");
            return;
        }

        try {
            const submitData = new FormData();

            // Append form data
            Object.entries(formData).forEach(([key, value]) => {
                submitData.append(key, value);
            });

            // Append images เมื่อกดยืนยันแล้ว
            images.forEach((image, index) => {
                submitData.append(`image${index}`, image.file);
            });

            // Replace with your actual API endpoint
            const response = await fetch("/api/tours", {
                method: "POST",
                body: submitData,
            });

            if (!response.ok) {
                throw new Error("Failed to create tour package");
            }

            showToast("Tour package created successfully");

            // Reset form
            setFormData({
                title: "",
                type: "",
                description: "",
                price: "",
                meetingPoint: "",
            });
            setImages([]);
            setCurrentImageIndex(0);
        } catch (error) {
            console.error("Submission error:", error);
            showToast("Failed to create tour package", "error");
        }
    };



    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }))
        }
    }

    return (
        <div className="container">
            <div className="card">
                <div className="header">
                    <h1>สร้างแพ็คเกจทัวร์</h1>
                    <p>Create a new tour package</p>
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
                                    <div
                                        key={index}
                                        className={`thumbnail ${index === currentImageIndex ? "active" : ""}`}
                                        onClick={() => setCurrentImageIndex(index)}
                                    >
                                        <img src={image.url || "/placeholder.svg"} alt={`Preview ${index + 1}`} />
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

                            <div className="form-group">
                                <label htmlFor="type">ประเภทแพ็คเกจทัวร์</label>
                                <select id="type" name="type" value={formData.type} onChange={handleInputChange}>
                                    <option value="">Select tour type</option>
                                    <option value="day_trip">Day Trip</option>
                                    <option value="multi_day_trip">Multi Day Trip</option>
                                </select>
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
    )
}


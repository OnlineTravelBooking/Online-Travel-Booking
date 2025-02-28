import React, { useEffect, useState } from "react";
import { UPDATE_PACKAGE, TRAVEL_DATE, ALL_IMAGES_PACKAGE } from "../../../Graphql";
import { useMutation, useQuery } from "@apollo/client";
import { Modal, Button, DatePicker, Card, Row, Col, message, Radio, Space } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import dayjs from "dayjs";
import { DeleteOutlined, PlusOutlined, DownOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const StrapiUrl = process.env.REACT_APP_API_URL;

export default function EditPackage({ packageData, visible, onClose, refetchPackages }) {
  const [formData, setFormData] = useState({ ...packageData });
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  const { data: travelDatesData } = useQuery(TRAVEL_DATE, {
    variables: { packageId: packageData.documentId },
  });

  const [updatePackage] = useMutation(UPDATE_PACKAGE);

  useEffect(() => {
    if (packageData) {
      setFormData({
        title: packageData.Title,
        type: packageData.Type,
        description: packageData.Description,
        price: packageData.Price,
        meetingPoint: packageData.MeetingPoint,
        Accommodation: packageData.Accommodation,
        dates: [],
        ranges: [],
      });
    }
  }, [packageData]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const uploadedImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setNewImages((prev) => [...prev, ...uploadedImages]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      const token = sessionStorage.getItem("token");

      // Upload new images
      const imageUploadPromises = newImages.map(async (image) => {
        const imageFormData = new FormData();
        imageFormData.append("files", image.file);
        const response = await axios.post(`${StrapiUrl}/api/upload`, imageFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data[0].id;
      });
      const newImageIds = await Promise.all(imageUploadPromises);

      // Update package
      await updatePackage({
        variables: {
          documentId: packageData.documentId,
          data: {
            Title: formData.title,
            Type: formData.type,
            Description: formData.description,
            Price: parseFloat(formData.price),
            MeetingPoint: formData.meetingPoint,
            Image: [...packageData.urlImage.id, ...newImageIds],
            Accommodation: formData.Accommodation,
          },
        },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      message.success("Package updated successfully");
      refetchPackages();
      onClose();
    } catch (error) {
      message.error("Update failed: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal title="Edit Package" visible={visible} onCancel={onClose} footer={null} width={"85%"} style={{ top: 25 }}>
      <div className="container">
        <div className="card">
          <div className="content">
            {/* Add similar form structure as CreatePackageButton */}
            {/* Pre-fill all fields with formData */}
            {/* Include image handling, date pickers, and form fields */}
          </div>
        </div>
      </div>
    </Modal>
  );
}

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import BACKEND_URL from "./../utils/constant";
import "./AddProductScreen.css";
const AddProduct = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [uploadedImage, setUploadedImage] = useState(null);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setUploadedImage(URL.createObjectURL(acceptedFiles[0]));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("productName", data.productName);
      formData.append("description", data.description);
      formData.append("quantity", data.quantity);
      formData.append("unitPrice", data.unitPrice);

      if (uploadedImage) {
        const blobImage = await fetch(uploadedImage).then((res) => res.blob());
        formData.append("productImage", blobImage);
        console.log("Form Data:", formData, uploadedImage, blobImage, data);
      }
      await axios.post(`${BACKEND_URL}/api/products/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Reset the state
      reset();
      setUploadedImage(null);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="product-create-container">
      <div className="form-container">
        <h2>Create Product</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="productName">Product Name</label>
            <input
              type="text"
              id="productName"
              {...register("productName", {
                required: "Product Name is required",
              })}
            />
            {errors.productName && (
              <p className="error">{errors.productName.message}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <p className="error">{errors.description.message}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              {...register("quantity", {
                required: "Quantity is required",
                min: 0,
              })}
            />
            {errors.quantity && (
              <p className="error">{errors.quantity.message}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="unitPrice">Unit Price</label>
            <input
              type="number"
              id="unitPrice"
              {...register("unitPrice", {
                required: "Unit Price is required",
                min: 0,
              })}
            />
            {errors.unitPrice && (
              <p className="error">{errors.unitPrice.message}</p>
            )}
          </div>

          <button type="submit" disabled={Object.keys(errors).length > 0}>
            Submit
          </button>
        </form>
      </div>
      <div className="image-container">
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? "active" : ""}`}
        >
          <input {...getInputProps()} />
          {uploadedImage ? (
            <img
              src={uploadedImage}
              alt="Uploaded"
              className="uploaded-image"
            />
          ) : isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop an image file here, or click to select one</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;

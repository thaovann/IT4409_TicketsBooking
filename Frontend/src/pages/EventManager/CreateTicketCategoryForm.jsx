import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateTicketCategoryForm = ({ eventId }) => {
  const [categoryData, setCategoryData] = useState({
    eventId: eventId,
    name: "",
    price: "",
    free: false,
    totalQuantity: "",
    minPerOrder: "",
    maxPerOrder: "",
    saleStartTime: "",
    saleEndTime: "",
    description: "",
  });

  useEffect(() => {
    setCategoryData((prevData) => ({
      ...prevData,
      eventId: eventId,
    }));
  }, [eventId]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setCategoryData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    return (
      categoryData.eventId &&
      categoryData.name &&
      categoryData.price &&
      categoryData.totalQuantity &&
      categoryData.saleStartTime &&
      categoryData.saleEndTime
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Category Data:", categoryData); 

    if (!validateForm()) {
      alert("Please fill in all required fields.");
      return;
    }

    
    try {
      const response = await axios.post(
        "http://localhost:3001/api/ticket/createTicketCategory",
        categoryData
      );
      alert("Ticket category created successfully!");
      console.log(response.data);
    } catch (error) {
      console.error(
        "Error creating ticket category:",
        error.response?.data || error.message
      );
      alert(
        "Error creating ticket category: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div>
      <h3>Create Ticket Category</h3>
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#fff5e6",
          padding: "15px",
          borderRadius: "5px",
          marginBottom: "20px",
        }}
      >
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={categoryData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Price:</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={categoryData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Free:</label>
          <input
            type="checkbox"
            className="form-check-input"
            name="free"
            checked={categoryData.free}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Total Quantity:</label>
          <input
            type="number"
            className="form-control"
            name="totalQuantity"
            value={categoryData.totalQuantity}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Minimum Per Order:</label>
          <input
            type="number"
            className="form-control"
            name="minPerOrder"
            value={categoryData.minPerOrder}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Maximum Per Order:</label>
          <input
            type="number"
            className="form-control"
            name="maxPerOrder"
            value={categoryData.maxPerOrder}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Sale Start Time:</label>
          <input
            type="datetime-local"
            className="form-control"
            name="saleStartTime"
            value={categoryData.saleStartTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Sale End Time:</label>
          <input
            type="datetime-local"
            className="form-control"
            name="saleEndTime"
            value={categoryData.saleEndTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description:</label>
          <textarea
            className="form-control"
            name="description"
            value={categoryData.description}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>
        <button type="submit" className="btn btn-warning">
          Create Ticket Category
        </button>
      </form>
    </div>
  );
};

export default CreateTicketCategoryForm;

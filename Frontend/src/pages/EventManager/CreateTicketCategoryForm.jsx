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
      alert("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    try {
      const response = await axios.post(
        // "http://localhost:3001/api/ticket/createTicketCategory",
        "https://it4409-ticketsbooking-1.onrender.com/api/ticket/createTicketCategory",
        categoryData
      );
      alert("Loại vé đã được tạo thành công!");
      console.log(response.data);

      // Reset form data after successful submission
      setCategoryData({
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
    } catch (error) {
      console.error(
        "Lỗi khi tạo loại vé:",
        error.response?.data || error.message
      );
      alert(
        "Lỗi khi tạo loại vé: " +
        (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div style={{ color: "#2c2c2c" }}>
      <h3
        style={{ color: "#2c2c2c", textAlign: "center", marginBottom: "20px" }}
      >
        Tạo Loại Vé Mới
      </h3>
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#fff5e6",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          marginBottom: "20px",
        }}
      >
        <div className="mb-3">
          <label className="form-label">Tên loại vé:</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={categoryData.name}
            onChange={handleChange}
            required
            style={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "10px",
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#ff9800")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Giá:</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={categoryData.price}
            onChange={handleChange}
            required
            style={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "10px",
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#ff9800")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Có miễn phí hay không:</label>
          <input
            type="checkbox"
            className="form-check-input"
            name="free"
            checked={categoryData.free}
            onChange={handleChange}
            style={{ transform: "scale(1.2)" }}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tổng số lượng:</label>
          <input
            type="number"
            className="form-control"
            name="totalQuantity"
            value={categoryData.totalQuantity}
            onChange={handleChange}
            required
            style={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "10px",
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#ff9800")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            Số lượng tối thiểu trong một đơn hàng:
          </label>
          <input
            type="number"
            className="form-control"
            name="minPerOrder"
            value={categoryData.minPerOrder}
            onChange={handleChange}
            required
            style={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "10px",
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#ff9800")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            Số lượng tối đa trong một đơn hàng:
          </label>
          <input
            type="number"
            className="form-control"
            name="maxPerOrder"
            value={categoryData.maxPerOrder}
            onChange={handleChange}
            required
            style={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "10px",
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#ff9800")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Thời gian mở bán vé:</label>
          <input
            type="datetime-local"
            className="form-control"
            name="saleStartTime"
            value={categoryData.saleStartTime}
            onChange={handleChange}
            required
            style={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "10px",
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#ff9800")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Thời gian kết thúc bán vé:</label>
          <input
            type="datetime-local"
            className="form-control"
            name="saleEndTime"
            value={categoryData.saleEndTime}
            onChange={handleChange}
            required
            style={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "10px",
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#ff9800")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mô tả vé:</label>
          <textarea
            className="form-control"
            name="description"
            value={categoryData.description}
            onChange={handleChange}
            rows="3"
            style={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "10px",
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#ff9800")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          ></textarea>
        </div>

        <button
          type="submit"
          className="btn btn-warning"
          style={{ width: "100%" }}
        >
          Tạo loại vé
        </button>
      </form>
    </div>
  );
};

export default CreateTicketCategoryForm;

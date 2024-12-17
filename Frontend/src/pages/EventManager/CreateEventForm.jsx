import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import CreateTicketCategoryForm from "./CreateTicketCategoryForm";
import "bootstrap/dist/css/bootstrap.min.css";
import { Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const CreateEventForm = ({ event }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.login.currentUser);
  // const user = {
  //   id: "1"
  // }
  const [formData, setFormData] = useState({
    userId: user?.body?._doc?._id || "",
    eventTypeId: event?.eventTypeId || "",
    name: event?.name || "",
    description: event?.description || "",
    location: event?.location || "",
    startTime: event?.startTime || "",
    endTime: event?.endTime || "",
    eventTypeLocation: event?.eventTypeLocation || "",
    tags: event?.tags || "",
    organizerInfor: event?.organizerInfor || "",
    organizerName: event?.organizerName || "",
    bankName: event?.bankName || "",
    bankNumber: event?.bankNumber || "",
    accountHolderName: event?.accountHolderName || "",
  });
  useEffect(() => {
    if (!user) {
      // Redirect to login if user is not found
      navigate("/login");
    } else {
      //console.log(user)

      setFormData((prevData) => ({
        ...prevData,
        userId: user.body?._doc?._id,
      }));
    }
  }, [user, navigate]);



  const [files, setFiles] = useState({
    logo: null,
    organizerLogo: null,
    background: null,
    video: null,
  });

  const [filePreviews, setFilePreviews] = useState({
    logo: event?.imageLogo || null,
    organizerLogo: event?.organizerLogo || null,
    background: event?.imageBackground || null,
    video: event?.video || null,
  });

  // const [loading, setLoading] = useState(false);
  // const [message, setMessage] = useState("");
  const [eventTypes, setEventTypes] = useState([]);
  //const [eventCreated, setEventCreated] = useState(true); // New state for event creation
  //const [eventId, setEventId] = useState(null); // Store created event ID


  useEffect(() => {
    // Thiết lập preview ảnh từ API nếu đã có sẵn event
    if (event) {
      setFilePreviews((prevPreviews) => ({
        ...prevPreviews,
        logo: event.imageLogo
          ? `https://it4409-ticketsbooking-1.onrender.com/api/event/images/${event.imageLogo}`
          : null,
        organizerLogo: event.organizerLogo
          ? `https://it4409-ticketsbooking-1.onrender.com/api/event/images/${event.organizerLogo}`
          : null,
        background: event.imageBackground
          ? `https://it4409-ticketsbooking-1.onrender.com/api/event/images/${event.imageBackground}`
          : null,
        video: event.video || null, // Xử lý riêng nếu cần
      }));
    }

    const fetchEventTypes = async () => {
      try {
        const response = await axios.get(
          // "http://localhost:3001/api/event/allEventTypes"
          "https://it4409-ticketsbooking-1.onrender.com/api/event/allEventTypes"
        );
        setEventTypes(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy loại sự kiện:", error);
      }
    };
    fetchEventTypes();
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    setFiles((prevFiles) => ({
      ...prevFiles,
      [name]: file,
    }));

    // Tạo một URL xem trước cho file đã chọn
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setFilePreviews((prevPreviews) => ({
        ...prevPreviews,
        [name]: previewURL,
      }));
    } else if (event && event[name]) {
      // Nếu không tải file mới, giữ nguyên preview từ API
      setFilePreviews((prevPreviews) => ({
        ...prevPreviews,
        [name]: `https://it4409-ticketsbooking-1.onrender.com/api/event/images/${event[name]}`,
      }));
    }
  };

  const validateForm = () => {
    if (!formData.userId) {
      alert("ID người dùng là bắt buộc.");
      return false;
    }
    if (new Date(formData.startTime) >= new Date(formData.endTime)) {
      alert("Thời gian kết thúc phải sau thời gian bắt đầu.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userId) {
      alert("ID người dùng là bắt buộc.");
      return;
    }

    if (!validateForm()) {
      return; // Dừng lại nếu xác thực không thành công
    }

    console.log("Dữ liệu form:", formData); // Ghi lại dữ liệu form
    console.log("Dữ liệu file:", files); // Ghi lại dữ liệu file

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    Object.keys(files).forEach((key) => {
      if (files[key]) {
        data.append(key, files[key]);
      }
    });
    // Đặt trạng thái thành "under review"
    data.append("state", "under review");

    try {
      if (!event) {
        // Nếu không có sự kiện, tạo sự kiện mới
        const response = await axios.post(
          // "http://localhost:3001/api/event/create",
          "https://it4409-ticketsbooking-1.onrender.com/api/event/create",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        //setEventId(response.data.event._id);
        //setEventCreated(true);
        alert("Tạo sự kiện thành công!");
      } else {
        // Nếu sự kiện đã có, cập nhật sự kiện
        const response = await axios.put(
          // `http://localhost:3001/api/event/update/${eventId}`,
          `https://it4409-ticketsbooking-1.onrender.com/api/event/update/${event._id}`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Cập nhật sự kiện thành công:", response.data);
        alert("Cập nhật sự kiện thành công!");
      }
    } catch (error) {
      console.error("Lỗi:", error.response?.data?.message || error.message);
      alert("Lỗi: " + (error.response?.data?.message || error.message));
    }
  };
  // const handleReturnHome = () => {
  //   navigate("/");
  // };
  const formatDateTimeLocal = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div
      className="container"
      style={{ marginTop: "20px", backgroundColor: "#2c2c2c", color: "black" }}
    >
      <Typography variant="h4" sx={{ pt: 3, color: "#EEEEEE" }} gutterBottom>
        Tạo sự kiện
      </Typography>

      <div className="d-flex">
        <div
          className="event-form"
          style={{
            flex: 1,
            backgroundColor: "#2c2c2c",
            borderRadius: "5px",
            marginRight: "10px",
          }}
        >
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* Event Details Section */}
            <div
              style={{
                backgroundColor: "#fff5e6",
                padding: "15px",
                borderRadius: "5px",
                marginBottom: "20px",
              }}
            >
              <h4 className="text-secondary">THÔNG TIN SỰ KIỆN</h4>
              <div className="mb-3">
                <label className="form-label">Tên sự kiện:</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Kiểu sự kiện:</label>
                <select
                  className="form-select"
                  name="eventTypeId"
                  value={formData.eventTypeId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Chọn kiểu sự kiện</option>
                  {eventTypes.map((type) => (
                    <option key={type.id} value={type._id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Thông tin mô tả sự kiện:</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Thời gian diễn ra:</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="startTime"
                  value={formatDateTimeLocal(formData.startTime)}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Thời gian kết thúc:</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="endTime"
                  value={formatDateTimeLocal(formData.endTime)}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Kiểu địa điểm diễn ra:</label>
                <select
                  className="form-select"
                  name="eventTypeLocation"
                  value={formData.eventTypeLocation}
                  onChange={handleChange}
                  required
                >
                  <option value="">Chọn kiểu địa điểm</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
              {formData.eventTypeLocation === "offline" && (
                <div className="mb-3">
                  <label className="form-label">Vị trí diễn ra sự kiện:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
            </div>

            {/* Organizer Information Section */}
            <div
              style={{
                backgroundColor: "#fff5e6",
                padding: "15px",
                borderRadius: "5px",
                marginBottom: "20px",
              }}
            >
              <h4 className="text-secondary">Thông tin ban tổ chức</h4>
              <div className="mb-3">
                <label className="form-label">Tên ban tổ chức:</label>
                <input
                  type="text"
                  className="form-control"
                  name="organizerName"
                  value={formData.organizerName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Mô tả về ban tổ chức:</label>
                <input
                  type="text"
                  className="form-control"
                  name="organizerInfor"
                  value={formData.organizerInfor}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Media Uploads Section */}
            <div
              style={{
                backgroundColor: "#fff5e6",
                padding: "15px",
                borderRadius: "5px",
                marginBottom: "20px",
              }}
            >
              <h4 className="text-secondary">Tải lên các hình ảnh về sự kiện</h4>
              <div className="mb-3">
                <label className="form-label">Logo sự kiện (720x958):</label>
                <input
                  type="file"
                  className="form-control"
                  name="logo"
                  accept="image/*"
                  onChange={handleFileChange}
                  required={!filePreviews.logo}
                />
                {filePreviews.logo && (
                  <img
                    src={filePreviews.logo}
                    alt="Logo Preview"
                    style={{ width: "40%", height: "auto", marginTop: "10px" }}
                  />
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Logo ban tổ chức (275x275):</label>
                <input
                  type="file"
                  className="form-control"
                  name="organizerLogo"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {filePreviews.organizerLogo && (
                  <img
                    src={filePreviews.organizerLogo}
                    alt="Organizer Logo Preview"
                    style={{ width: "40%", height: "auto", marginTop: "10px" }}
                  />
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Hình nền sự kiện (1280x720):
                </label>
                <input
                  type="file"
                  className="form-control"
                  name="background"
                  accept="image/*"
                  onChange={handleFileChange}
                  required={!filePreviews.background}
                />
                {filePreviews.background && (
                  <img
                    src={filePreviews.background}
                    alt="Background Preview"
                    style={{ width: "40%", height: "auto", marginTop: "10px" }}
                  />
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Video (Max 50MB):</label>
                <input
                  type="file"
                  className="form-control"
                  name="video"
                  accept="video/*"
                  onChange={handleFileChange}
                />
                {filePreviews.video && (
                  <video
                    controls
                    style={{ width: "50%", height: "auto", marginTop: "10px" }}
                  >
                    <source src={filePreviews.video} type="video/mp4" />
                    Trình duyệt không hỗ trợ video
                  </video>
                )}
              </div>
            </div>

            {/* Payment Account Section */}
            <div
              style={{
                backgroundColor: "#fff5e6",
                padding: "15px",
                borderRadius: "5px",
                marginBottom: "20px",
              }}
            >
              <h4 className="text-secondary">Tài khoản thanh toán</h4>
              <div className="mb-3">
                <label className="form-label">Tên ngân hàng:</label>
                <textarea
                  className="form-control"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Số tài khoản ngân hàng:</label>
                <textarea
                  className="form-control"
                  name="bankNumber"
                  value={formData.bankNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Tên chủ tài khoản:</label>
                <textarea
                  className="form-control"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-warning"
              style={{ backgroundColor: "#ffea99" }}
            >
              {event ? "Cập nhật sự kiện" : "Tạo sự kiện"}
            </button>
          </form>
        </div>
        {event && (
          <div
            className="ticket-category-form"
            style={{
              flex: 1,
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "5px",
              marginLeft: "10px",
            }}
          >
            <CreateTicketCategoryForm eventId={event._id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateEventForm;

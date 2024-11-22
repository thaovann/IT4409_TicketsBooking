import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import CreateTicketCategoryForm from "./CreateTicketCategoryForm"; 
import "bootstrap/dist/css/bootstrap.min.css";
import { Navigate, useNavigate } from 'react-router-dom';

const CreateEventForm = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.login.currentUser); 
  // const user = {
  //   id: "1"
  // }
  const [formData, setFormData] = useState({
    userId: "",
    eventTypeId: "",
    name: "",
    description: "",
    location: "",
    startTime: "",
    endTime: "",
    eventTypeLocation: "",
    tags: "",
    organizerInfor: "",
    organizerName: "",
    bankName: "",
    bankNumber: "",
    accountHolderName: "",
  });
  useEffect(() => {
    if (!user) {
      // Redirect to login if user is not found
      navigate("/login");
    } else
    {
      console.log(user)
      
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
    logo: null,
    organizerLogo: null,
    background: null,
    video: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [eventTypes, setEventTypes] = useState([]);
  const [eventCreated, setEventCreated] = useState(false); // New state for event creation
  const [eventId, setEventId] = useState(null); // Store created event ID

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/event/allEventTypes"
        );
        setEventTypes(response.data);
      } catch (error) {
        console.error("Error fetching event types:", error);
      }
    };
    fetchEventTypes();
  }, []);

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

    // Create a preview URL for the selected file
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setFilePreviews((prevPreviews) => ({
        ...prevPreviews,
        [name]: previewURL,
      }));
    }
  };

  const validateForm = () => {
    if (!formData.userId) {
      alert("User ID is required.");
      return false;
    }
    if (new Date(formData.startTime) >= new Date(formData.endTime)) {
      alert("End time must be after start time.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userId) {
      alert("User ID is required.");
      return;
    }

    if (!validateForm()) {
      return; // Exit if validation fails
    }

    console.log("Form Data:", formData); // Log form data
    console.log("Files:", files); // Log files data

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    Object.keys(files).forEach((key) => {
      if (files[key]) {
        data.append(key, files[key]);
      }
    });

    try {
      if (!eventId) {
        // If no event exists, create a new one
        const response = await axios.post(
          "http://localhost:3001/api/event/create",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setEventId(response.data.event._id);
        setEventCreated(true); 
        alert("Event created successfully!");
        console.log(response.data);
      } else {
        // If event exists, update it
        const response = await axios.put(
          `http://localhost:3001/api/event/update/${eventId}`,
          data, 
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Event updated successfully:", response.data);
        alert("Event updated successfully!");
      }
    } catch (error) {
      console.error("Error:", error.response?.data?.message || error.message);
      alert("Error: " + (error.response?.data?.message || error.message));
    }
  };
  const handleReturnHome = () => {
    navigate("/");
  };

  return (
    <div
      className="container"
      style={{ marginTop: "20px", backgroundColor: "#2c2c2c" }}
    >
      <h2 className="text-center" style={{ color: "#ffea99" }}>
        Create Event
      </h2>
      <button
        onClick={handleReturnHome}
        className="btn btn-primary mb-4"
        style={{ backgroundColor: "#ffea99", color: "#000000", padding:"20px", marginLeft:"20px", marginTop:"20px", }}
      >
        Return to Homepage
      </button>
      <div className="d-flex">
        <div
          className="event-form"
          style={{
            flex: 1,
            backgroundColor: "#2c2c2c",
            padding: "20px",
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
              <h4 className="text-secondary">Event Details</h4>
              <div className="mb-3">
                <label className="form-label">Name:</label>
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
                <label className="form-label">Event Type:</label>
                <select
                  className="form-select"
                  name="eventTypeId"
                  value={formData.eventTypeId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Event Type</option>
                  {eventTypes.map((type) => (
                    <option key={type.id} value={type._id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Description:</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Start Time:</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">End Time:</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Event Type Location:</label>
                <select
                  className="form-select"
                  name="eventTypeLocation"
                  value={formData.eventTypeLocation}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Location Type</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
              {formData.eventTypeLocation === "offline" && (
                <div className="mb-3">
                  <label className="form-label">Location:</label>
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
              <h4 className="text-secondary">Organizer Information</h4>
              <div className="mb-3">
                <label className="form-label">Organizer Info:</label>
                <input
                  type="text"
                  className="form-control"
                  name="organizerInfor"
                  value={formData.organizerInfor}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Organizer Name:</label>
                <input
                  type="text"
                  className="form-control"
                  name="organizerName"
                  value={formData.organizerName}
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
              <h4 className="text-secondary">Media Uploads</h4>
              <div className="mb-3">
                <label className="form-label">Logo Image (720x958):</label>
                <input
                  type="file"
                  className="form-control"
                  name="logo"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
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
                <label className="form-label">Organizer Logo (275x275):</label>
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
                  Background Image (1280x720):
                </label>
                <input
                  type="file"
                  className="form-control"
                  name="background"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
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
                    style={{ width: "100%", height: "auto", marginTop: "10px" }}
                  >
                    <source src={filePreviews.video} type="video/mp4" />
                    Your browser does not support the video tag.
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
              <h4 className="text-secondary">Payment Account</h4>
              <div className="mb-3">
                <label className="form-label">Bank Name:</label>
                <textarea
                  className="form-control"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Bank Account Number:</label>
                <textarea
                  className="form-control"
                  name="bankNumber"
                  value={formData.bankNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Account Holder Name:</label>
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
              {eventCreated ? "Update Event" : "Create Event"}
            </button>
          </form>
        </div>
        {eventCreated && (
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
            <CreateTicketCategoryForm eventId={eventId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateEventForm;

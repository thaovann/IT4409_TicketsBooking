import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { createEvent } from "../../redux/apiRequest"; // Ensure `createEvent` is defined in apiRequest file

const CreateEventPage = () => {
  const [eventName, setEventName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [eventTypeId, setEventTypeId] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");


  const [imageBackground, setImageBackground] = useState("");
  const [imageBackgroundDisplay, setImageBackgroundDisplay] = useState("");
  const [imageLogo, setImageLogo] = useState("");
  const [imageLogoDisplay, setImageLogoDisplay] = useState("");
  const [video, setVideo] = useState("");
  const [videoDisplay, setVideoDisplay] = useState("");
  const [organizerLogo, setOrganizerLogo] = useState("");
  const [organizerLogoDisplay, setOrganizerLogoDisplay] = useState("");


  const [organizerName, setOrganizerName] = useState("");
  const [organizerInfo, setOrganizerInfo] = useState("");
  const [tags, setTags] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [locationType, setLocationType] = useState("online");

  const userId = "6715fa1fe5a6fc4631f55aa7";
  const dispatch = useDispatch();
  const navigate = useNavigate();

const FileUpload = ({ onChange, label, accept, displayUrl, isImage }) => (
  <>
    <input
      accept={accept}
      type="file"
      onChange={onChange}
      style={{ display: "none" }}
      id={label.replace(/\s/g, "-")}
    />
    <label htmlFor={label.replace(/\s/g, "-")}>
      <Button variant="outlined" component="span">
        {label}
      </Button>
    </label>
    {displayUrl &&
      (isImage ? (
        <img
          src={displayUrl}
          alt={`${label} Preview`}
          style={{ width: "100%", marginTop: "10px" }}
        />
      ) : (
        <video
          src={displayUrl}
          controls
          style={{ width: "100%", marginTop: "10px" }}
        />
      ))}
  </>
);

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

  useEffect(() => {
    const fetchEventTypes = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:3001/api/event/allEventTypes"
        );
        const data = await response.json();
        setEventTypes(data);
      } catch (error) {
        console.error("Failed to fetch event types:", error);
        setError("Could not load event types. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventTypes();
  }, []);
  
  const handleCreateEvent = async (e) => {
    e.preventDefault();

    // Tạo một đối tượng FormData
    const formData = new FormData();

    // Thêm các trường dữ liệu vào formData
    formData.append("userId", userId);
    formData.append("eventTypeId", eventTypeId);
    formData.append("name", eventName);
    formData.append("description", description);
    formData.append("location", locationType === "offline" ? location : null);
    formData.append("startTime", new Date(startTime));
    formData.append("endTime", new Date(endTime));
    formData.append("state", "under review");
    formData.append("averageRating", 0);
    formData.append("eventTypeLocation", locationType);
    formData.append(
      "tags",
      tags ? tags.map((tag) => tag.trim()).join(",") : ""
    );
    formData.append("organizerInfo", organizerInfo);
    formData.append("organizerName", organizerName);
    formData.append("logo", imageLogo); 
  
    formData.append("background", imageBackground); 
    
    if (video) {
      formData.append("video", video); 
    }
    if (organizerLogo) {
      formData.append("organizerLogo", organizerLogo); 
    }

    try {
  
      await createEvent(formData, dispatch);
      setEventName("");
      setStartTime("");
      setEndTime("");
      setEventTypeId("");
      setLocation("");
      setDescription("");
      setImageBackground("");
      setImageLogo("");
      setVideo("");
      setOrganizerLogo("");
      setOrganizerName("");
      setOrganizerInfo("");
      setTags([]);
    } catch (error) {
      console.error("Error creating event:", error);
      setError("Error creating event. Please try again.");
    }
  };



const handleImageChange = (setter1, setter2) => (e) => {
  const file = e.target.files[0];
  if (file) {
    setter1(file); // For setting the actual file object
    setter2(URL.createObjectURL(file)); // For setting a preview URL or similar action
  }
};


  const handleLocationTypeChange = (event) => {
    setLocationType(event.target.value);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Event
        </Typography>
        <form onSubmit={handleCreateEvent}>
          <TextField
            fullWidth
            label="Event Name"
            variant="outlined"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Start Time"
            type="datetime-local"
            variant="outlined"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="End Time"
            type="datetime-local"
            variant="outlined"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
          <FormControl fullWidth variant="outlined" required>
            <InputLabel id="event-type-label">Event Type</InputLabel>
            <Select
              labelId="event-type-label"
              value={eventTypeId}
              onChange={(e) => setEventTypeId(e.target.value)}
              label="Event Type"
            >
              {eventTypes.length > 0 ? (
                eventTypes.map((eventType) => (
                  <MenuItem key={eventType._id} value={eventType._id}>
                    {eventType.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">
                  <em>No event types available</em>
                </MenuItem>
              )}
            </Select>
          </FormControl>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Location Type:
          </Typography>
          <RadioGroup
            row
            value={locationType}
            onChange={handleLocationTypeChange}
          >
            <FormControlLabel
              value="online"
              control={<Radio />}
              label="Online"
            />
            <FormControlLabel
              value="offline"
              control={<Radio />}
              label="Offline"
            />
          </RadioGroup>
          {locationType === "offline" && (
            <TextField
              fullWidth
              label="Location"
              variant="outlined"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          )}
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
          />
          <FileUpload
            onChange={handleImageChange(
              setImageBackground,
              setImageBackgroundDisplay
            )}
            label="Upload Background Image"
            accept="image/*"
            displayUrl={imageBackgroundDisplay}
            isImage
          />

          <FileUpload
            onChange={handleImageChange(setImageLogo, setImageLogoDisplay)}
            label="Upload Logo Image"
            accept="image/*"
            displayUrl={imageLogoDisplay}
            isImage
          />

          <FileUpload
            onChange={handleImageChange(setVideo, setVideoDisplay)}
            label="Upload Video"
            accept="video/*"
            displayUrl={videoDisplay}
            isImage={false}
          />

          <FileUpload
            onChange={handleImageChange(
              setOrganizerLogo,
              setOrganizerLogoDisplay
            )}
            label="Upload Organizer Logo"
            accept="image/*"
            displayUrl={organizerLogoDisplay}
            isImage
          />
          <TextField
            fullWidth
            label="Organizer Name"
            variant="outlined"
            value={organizerName}
            onChange={(e) => setOrganizerName(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Organizer Info"
            variant="outlined"
            value={organizerInfo}
            onChange={(e) => setOrganizerInfo(e.target.value)}
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Tags (comma-separated)"
            variant="outlined"
            value={tags}
            onChange={(e) => setTags(e.target.value.split(","))}
          />
          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Create Event
            </Button>
          </Box>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </form>
      </Box>
    </Container>
  );
};

export default CreateEventPage;

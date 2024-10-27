//Component hiển thị card sự kiện
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardMedia,
} from "@mui/material";
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  const { id, title, date, location, imageUrl } = event; // Giả sử `event` là một đối tượng có các thuộc tính này

  return (
    <Card sx={{ maxWidth: 345, margin: "20px" }}>
      <CardMedia
        component="img"
        height="140"
        image={imageUrl} // URL của hình ảnh sự kiện
        alt={title} // Tiêu đề của sự kiện làm alt text
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Date:</strong> {new Date(date).toLocaleDateString()}{" "}
          {/* Định dạng ngày */}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Location:</strong> {location}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={`/events/${id}`} // Chuyển đến trang chi tiết sự kiện khi nhấn nút
          sx={{ marginTop: "10px" }}
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventCard;

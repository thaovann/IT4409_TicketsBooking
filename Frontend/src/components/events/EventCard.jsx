// Component hiển thị card sự kiện
import React from "react";
import { Card, CardContent, Typography, Button, CardMedia } from "@mui/material";
import { Link } from "react-router-dom";
import "./EventCard.css";

const EventCard = ({ event }) => {
  const { _id, name, startTime, location, imageBackground } = event;

  return (
    <Link to={`/events/${_id}`} style={{ textDecoration: 'none' }}><Card className="event-card">
      <CardMedia
        component="img"
        className="event-image"
        image={`http://localhost:3001/api/event/images/${imageBackground}` || "path/to/default-image.jpg"}
        alt={name}
      />
      <CardContent className="event-content">
        <Typography gutterBottom variant="h5" component="div" className="event-title">
          {name}
        </Typography>
        <Typography variant="body2" className="event-date">
          <strong>Date:</strong> {new Date(startTime).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" className="event-location">
          <strong>Location:</strong> {location || "Online"}
        </Typography>
        <Button
          variant="contained"
          className="book-button"
          component={Link}
          to={`/events/${_id}`} // Đã sửa lại
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
    </Link>
  );
};

export default EventCard;

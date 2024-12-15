// Component hiển thị card sự kiện
import React from "react";
import { Link } from "react-router-dom";
import "./EventCard.css";

const EventCard = ({ event }) => {
  const { _id, name, location, startTime, price, imageBackground } = event;

  return (
    <Link
      to={`/events/${_id}`}
      style={{ textDecoration: "none" }}
      className="event-card"
    >
      <img
        // src={`http://localhost:3001/api/event/images/${event.imageBackground}`}
        src={`https://it4409-ticketsbooking-1.onrender.com/api/event/images/${event.imageBackground}`}
        alt={name}
        className="event-img"
      />
      <div className="event-content">
        <h3 className="event-title">{name}</h3>
        <span className="event-price">
          Từ {price ? `${price.toLocaleString("vi-VN")}` : "500.000"} đ
        </span>
        <span className="event-date">
          <i class="fa-regular fa-calendar-days"></i>{" "}
          {new Date(startTime).toLocaleDateString()}
        </span>
      </div>
    </Link>
  );
};

export default EventCard;

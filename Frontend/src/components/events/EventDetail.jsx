import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../common/Header";
import Footer from "../common/Footer";
import "./EventDetail.css";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/event/getEventById/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    const fetchTickets = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/ticket/getTicketCategoriesByEvent/${id}`);
        setTickets(response.data);
      } catch (error) {
        console.error("Error fetching ticket categories:", error);
      }
    };

    fetchEvent();
    fetchTickets();
  }, [id]);

  const handleBookNow = () => {
    navigate(`/booking/${id}`);
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div>
      <Header />
      <div className="event-detail-container">
        <div className="event-detail-content">
          <div className="event-detail-ticket">
            <div className="event-info">
              <h1 className="event-title">{event.name}</h1>
              <p className="event-date-location">
                <span className="event-date">⏰ {new Date(event.startTime).toLocaleTimeString()} - {new Date(event.startTime).toLocaleDateString()}</span>
                <span className="event-location">📍 {event.location}</span>
              </p>
              <div className="event-price-book">
                <p className="event-price">Giá từ <span>450,000 đ</span></p>
                <button className="book-button" onClick={handleBookNow}>Book now</button>
              </div>
            </div>
            <div className="event-banner">
              <img src={`http://localhost:3001/api/event/images/${event.imageBackground}`} alt={event.name} />
            </div>
          </div>
        </div>
        
        <div className="event-description">
          <h2>Giới thiệu</h2>
          <p>{event.description}</p>
        </div>

        {/* Ticket Information */}
        <div className="ticket-info">
          <h2 className="ticket-info-title">Thông tin vé</h2>
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <div key={ticket._id} className="ticket-category">
                <h3>{ticket.name}</h3>
                <p>Giá vé: {ticket.price.toLocaleString()} đ</p>
                <p>Tình trạng: {ticket.leftQuantity > 0 ? "Còn vé" : "Hết vé"}</p>
                <button className="buy-ticket-button" onClick={handleBookNow}>
                  Mua vé ngay
                </button>
              </div>
            ))
          ) : (
            <p>Không có thông tin vé</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventDetail;

import React, { useEffect, useState, useRef } from "react";
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
  const [minPrice, setMinPrice] = useState(null);

  // Tạo một tham chiếu cho phần thông tin vé
  const ticketInfoRef = useRef(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/event/getEventById/${id}`
        );
        setEvent(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sự kiện:", error);
      }
    };

    const fetchTickets = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/ticket/getTicketCategoriesByEvent/${id}`
        );
        setTickets(response.data.ticketCategories);

        if (response.data.ticketCategories.length > 0) {
          const minTicketPrice = Math.min(
            ...response.data.ticketCategories.map((ticket) => ticket.price)
          );
          setMinPrice(minTicketPrice);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách vé:", error);
      }
    };

    fetchEvent();
    fetchTickets();
  }, [id]);

  // Cuộn đến phần thông tin vé
  const handleScrollToTickets = () => {
    ticketInfoRef.current.scrollIntoView({ behavior: "smooth" });
  };

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
              <h1 className="event-detail-title">{event.name}</h1>
              <p className="event-date-location">
                <span className="event-date">
                  ⏰ {new Date(event.startTime).toLocaleTimeString()} -{" "}
                  {new Date(event.startTime).toLocaleDateString()}
                </span>
                <span className="event-location">📍 {event.location}</span>
              </p>
              <div className="event-price-book">
                <p className="event-price">
                  Giá từ{" "}
                  <span>
                    {minPrice !== null ? minPrice.toLocaleString() : "N/A"} đ
                  </span>
                </p>
                <button className="book-button" onClick={handleScrollToTickets}>
                  Mua vé ngay
                </button>
              </div>
            </div>
            <div className="event-banner">
              <img
                src={`http://localhost:3001/api/event/images/${event.imageBackground}`}
                alt={event.name}
              />
            </div>
          </div>
        </div>

        <div className="ticket-info-container" ref={ticketInfoRef}>
          <div className="event-description">
            <h2>Giới thiệu</h2>
            <p>{event.description}</p>
          </div>

          <div className="ticket-info">
            <h2 className="ticket-info-title">Thông tin vé</h2>
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <div key={ticket._id} className="ticket-category">
                  <div className="ticket-category-container">
                    <h3>{ticket.name}</h3>
                    <p>
                      Giá vé:{" "}
                      <span className="ticket-price">
                        {ticket.price.toLocaleString()} đ
                      </span>
                    </p>
                    <p>
                      Tình trạng:{" "}
                      <span className="state-ticket">
                        {ticket.leftQuantity > 0 ? "Còn vé" : "Hết vé"}
                      </span>
                    </p>
                  </div>

                  <button
                    className={`buy-ticket-button ${
                      ticket.leftQuantity > 0 ? "" : "disabled"
                    }`}
                    onClick={handleBookNow}
                    disabled={ticket.leftQuantity === 0}
                  >
                    Mua vé ngay
                  </button>
                </div>
              ))
            ) : (
              <p>Không có thông tin vé</p>
            )}
          </div>

          <div className="organizer-info">
            <h2 className="organizer-info-title">Ban tổ chức sự kiện</h2>
            <h3 className="organizer-name">{event.organizerName}</h3>
            <p className="organizer-description">{event.organizerInfor}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventDetail;

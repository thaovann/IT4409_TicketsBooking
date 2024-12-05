import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import "./TicketBookingPage.css";

const TicketBookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Khởi tạo useNavigate
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState({});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/event/getEventById/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    const fetchTickets = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/ticket/getTicketCategoriesByEvent/${id}`);
        setTickets(response.data.ticketCategories);

        const initialSelectedTickets = {};
        response.data.ticketCategories.forEach((ticket) => {
          initialSelectedTickets[ticket._id] = 0;
        });
        setSelectedTickets(initialSelectedTickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchEvent();
    fetchTickets();
  }, [id]);

  const handleTicketQuantityChange = (ticketId, action) => {
    setSelectedTickets((prev) => ({
      ...prev,
      [ticketId]: action === "increase" ? prev[ticketId] + 1 : Math.max(prev[ticketId] - 1, 0),
    }));
  };

  const calculateTotalPrice = () => {
    return tickets.reduce((total, ticket) => {
      return total + ticket.price * selectedTickets[ticket._id];
    }, 0);
  };
  console.log("render ra tickets: ", tickets);
  const handleCheckout = () => {
    const selectedTicketDetails = tickets
      .map((ticket) => ({
        ticketId: ticket._id,
        name: ticket.name,
        price: ticket.price,
        quantity: selectedTickets[ticket._id],
        ticketCategoryId: ticket._id, // Thêm ticketCategoryId
      }))
      .filter((ticket) => ticket.quantity > 0); // Lọc vé có số lượng > 0

    // Chuyển hướng sang trang thanh toán với thông tin vé và sự kiện
    navigate("/payment", {
      state: {
        selectedTicketDetails,
        totalPrice: calculateTotalPrice(),
        eventDetails: event, // Thêm thông tin sự kiện
      },
    });
  };
  

  

  if (!event) return <p>Loading...</p>;

  return (
    <div>
      <Header />
      <div className="ticket-booking-container">
        <div className="event-header">
          <h1>{event.name}</h1>
          <p>
            <strong>Thời gian:</strong> {new Date(event.startTime).toLocaleString()} <br />
            <strong>Địa điểm:</strong> {event.location}
          </p>
        </div>

        <h2>Chọn loại vé</h2>
        <div className="ticket-grid">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="ticket-card">
              <h3>{ticket.name}</h3>
              <p className="price">{ticket.price.toLocaleString()} đ</p>
              <p>Số lượng còn lại: {ticket.leftQuantity}</p>
              <div className="quantity-control">
                <button
                  onClick={() => handleTicketQuantityChange(ticket._id, "decrease")}
                  disabled={selectedTickets[ticket._id] === 0}
                >
                  -
                </button>
                <span>{selectedTickets[ticket._id]}</span>
                <button
                  onClick={() => handleTicketQuantityChange(ticket._id, "increase")}
                  disabled={selectedTickets[ticket._id] >= ticket.leftQuantity}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="total-section">
          <h2>Tổng tiền: {calculateTotalPrice().toLocaleString()} đ</h2>
          <button
            className="checkout-button"
            disabled={calculateTotalPrice() === 0}
            onClick={handleCheckout}
          >
            Tiến hành thanh toán
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TicketBookingPage;

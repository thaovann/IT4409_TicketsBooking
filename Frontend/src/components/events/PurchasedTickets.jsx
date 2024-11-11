// component vé đã mua
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from "../common/Header";
import Footer from "../common/Footer";
import './PurchasedTickets.css';

function PurchasedTickets() {
    const user = useSelector((state) => state.auth.login.currentUser);
    const [tickets, setTickets] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchPurchasedTickets = async () => {
            if (user) {
                try {
                    const response = await axios.get(`http://localhost:3001/api/users${user.userId}`);
                    setTickets(response.data);
                } catch (error) {
                    console.error("Lỗi khi lấy vé đã mua:", error);
                }
            }
        };

        fetchPurchasedTickets();
    }, [user]);

    return (
        
    <div>
      <Header/>
      <div className="purchased-tickets-page">
            <h1>Vé đã mua của bạn</h1>
            {tickets.length > 0 ? (
                <div className="tickets-list">
                    {tickets.map((ticket) => (
                        <div key={ticket.id} className="ticket-card">
                            <h2>{ticket.eventName}</h2>
                            <p>Ngày: {new Date(ticket.eventDate).toLocaleDateString()}</p>
                            <p>Ghế ngồi: {ticket.seatInfo}</p>
                            <p>Giá: {ticket.price} VND</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Bạn chưa mua vé nào.</p>
            )}
        </div>
        <Footer/>
    </div>
    );
}

export default PurchasedTickets;

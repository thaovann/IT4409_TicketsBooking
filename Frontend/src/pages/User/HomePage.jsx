import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import EventCard from '../../components/events/EventCard';
import './HomePage.css';

function HomePage() {
    const user = useSelector((state) => state.auth.login.currentUser);
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/event/allEvents');
                const approvedEvents = response.data
                    .filter(event => event.state === "approved")
                    .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
                    .slice(0, 6);
    
                const eventsWithPrices = await Promise.all(
                    approvedEvents.map(async (event) => {
                        try {
                            const ticketResponse = await axios.get(`http://localhost:3001/api/ticket/getTicketCategoriesByEvent/${event._id}`);
                            const tickets = ticketResponse.data.ticketCategories;
                            const minPrice = tickets.length > 0 ? Math.min(...tickets.map(ticket => ticket.price)) : "500.000";
                            return { ...event, price: minPrice }; // gắn giá vé vào sự kiện
                        } catch (error) {
                            console.error(`Error fetching tickets for event ${event._id}:`, error);
                            return event;
                        }
                    })
                );
    
                setEvents(eventsWithPrices);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };
    
        fetchEvents();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBannerIndex(prevIndex => (prevIndex + 1) % Math.ceil(events.length / 2));
        }, 5000);
        
        return () => clearInterval(interval);
    }, [events.length]);

    const handleDotClick = (index) => {
        setCurrentBannerIndex(index);
    };

    const prevSlide = () => {
        setCurrentBannerIndex(prevIndex => 
            prevIndex === 0 ? Math.ceil(events.length / 2) - 1 : prevIndex - 1
        );
    };

    const nextSlide = () => {
        setCurrentBannerIndex(prevIndex => 
            (prevIndex + 1) % Math.ceil(events.length / 2)
        );
    };

    const handleLoginClick = () => {
        navigate("/login");
    };

    return (
        <div className="home-page">
            <Header user={user} onLoginClick={handleLoginClick} />
            <div className='body-container'>    
                <section className="banner">
                    {events.length > 0 && (
                        <div className="banner-container">
                            <div
                                className="banner-slide-group"
                                style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}
                            >
                                {events.map((event, index) => (
                                    <Link
                                        to={`/events/${event._id}`}
                                        className="banner-slide"
                                        key={event._id}
                                    >
                                        <img
                                            src={`http://localhost:3001/api/event/images/${event.imageBackground}`}
                                            alt={event.name}
                                            className="banner-image"
                                        />
                                        <div className="banner-info">
                                            <div className="event-price">Từ {event.price ? `${event.price.toLocaleString('vi-VN')}` : "500.000"} đ</div>
                                            <div className="event-date">
                                                {new Date(event.startTime).toLocaleDateString('vi-VN')}
                                            </div>
                                            <button className="event-button">Xem chi tiết</button>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Nút mũi tên điều hướng */}
                            <button className="banner-arrow banner-arrow-left" onClick={prevSlide}>❮</button>
                            <button className="banner-arrow banner-arrow-right" onClick={nextSlide}>❯</button>

                            {/* Dots điều hướng */}
                            <div className="banner-dots">
                                {Array.from({ length: Math.ceil(events.length / 2) }).map((_, index) => (
                                    <div
                                        key={index}
                                        className={`banner-dot ${index === currentBannerIndex ? "active" : ""}`}
                                        onClick={() => handleDotClick(index)}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
                <section className="featured-events">
                    <h2>Sự kiện nổi bật</h2>
                    <div className="event-list">
                        {events.length > 0 ? (
                            events
                            .filter(event => event.state === "approved") // lọc sự kiện có trạng thái đã duyệt
                            .map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))
                        ) : (
                            <p>Không có sự kiện nào.</p>
                        )}
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}

export default HomePage;

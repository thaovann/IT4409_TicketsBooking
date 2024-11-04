import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import EventCard from '../../components/events/EventCard';
import './HomePage.css'; // style cho HomePage

function HomePage() {
    const user = useSelector((state) => state.auth.login.currentUser);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, []);
    const [events, setEvents] = useState([]);
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/event/allEvents');
                const approvedEvents = response.data
                    .filter(event => event.state === "approved")
                    .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
                    .slice(0, 4);
                setEvents(approvedEvents);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBannerIndex(prevIndex => (prevIndex + 1) % events.length);
        }, 5000);
        
        return () => clearInterval(interval);
    }, [events.length]);

    return (
        <div className="home-page">
            <Header />
        <div className='body-container'>    
            <section className="banner">
                {events.length > 0 && (
                    <Link to={`/events/${events[currentBannerIndex]._id}`} className="banner-slide">
                        <img
                            src={`http://localhost:3001/api/event/images/${events[currentBannerIndex].imageBackground}`} // Tạo URL đầy đủ cho ảnh
                            alt={events[currentBannerIndex].name}
                            className="banner-image"
                        />
                        <div className="banner-info">
                            <div className="event-price">Từ {events[currentBannerIndex].price || "750.000đ"}</div>
                            <div className="event-date">
                                {new Date(events[currentBannerIndex].startTime).toLocaleDateString('vi-VN')}
                            </div>
                            <button className="event-button">Xem chi tiết</button>
                        </div>
                    </Link>
                )}
            </section>
            {/* Danh sách sự kiện nổi bật */}
            <section className="featured-events">
                    <h2>Sự kiện nổi bật</h2>
                    <div className="event-list">
                        {events.length > 0 ? (
                            events
                            .filter(event => event.state === "approved") // Lọc sự kiện có trạng thái "approved"
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
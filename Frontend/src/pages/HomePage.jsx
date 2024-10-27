import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import EventCard from '../components/events/EventCard';
import './HomePage.css'; // Để thêm các style cho trang chủ

function HomePage() {
    return (
        <div className="home-page">
            <Header />
            {/* Banner */}
            <section className="banner">
                <img src="path/to/banner-image.jpg" alt="Banner" />
                <div className="banner-text">
                    <h1>Khám phá các sự kiện nổi bật</h1>
                    <p>Tham gia ngay để không bỏ lỡ cơ hội</p>
                </div>
            </section>
            
            {/* Danh sách sự kiện nổi bật */}
            <section className="featured-events">
                <h2>Sự kiện nổi bật</h2>
                <div className="event-list">

                    {/* <EventCard/>
                    <EventCard/> */}
                </div>
            </section>

            {/* Các chuyên mục sự kiện */}
            <section className="event-categories">
                <h2>Chuyên mục sự kiện</h2>
                <div className="categories-list">
                    <div className="category-item">Âm nhạc</div>
                    <div className="category-item">Thể thao</div>
                    <div className="category-item">Nghệ thuật</div>
                </div>
            </section>
            
            <Footer />
        </div>
    );
}

export default HomePage;


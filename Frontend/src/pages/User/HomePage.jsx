import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import EventCard from "../../components/events/EventCard";
import "./HomePage.css";
import voucherImg from "../../assets/img/voucher-img.webp";
import hochiminh from "../../assets/img/tphochiminh-origin.jpg";
import hanoi from "../../assets/img/hanoi-origin.jpg";
import dalat from "../../assets/img/dalat-origin.jpg";
import danang from "../../assets/img/danang-origin.jpg";

function HomePage() {
  const user = useSelector((state) => state.auth.login.currentUser);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  // State cho banner
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  // State cho EventCard slider
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentCardIndexMusic, setCurrentCardIndexMusic] = useState(0);
  const [currentCardIndexArt, setCurrentCardIndexArt] = useState(0);
  const [currentCardIndexOther, setCurrentCardIndexOther] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/event/allEvents"
        );
        const approvedEvents = response.data
          .filter((event) => event.state === "approved")
          .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

        const eventsWithPrices = await Promise.all(
          approvedEvents.map(async (event) => {
            try {
              const ticketResponse = await axios.get(
                `http://localhost:3001/api/ticket/getTicketCategoriesByEvent/${event._id}`
              );
              const tickets = ticketResponse.data.ticketCategories;
              const minPrice =
                tickets.length > 0
                  ? Math.min(...tickets.map((ticket) => ticket.price))
                  : "500.000";
              return { ...event, price: minPrice }; // gắn giá vé vào sự kiện
            } catch (error) {
              console.error(
                `Error fetching tickets for event ${event._id}:`,
                error
              );
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
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % Math.ceil(3));
    }, 5000);

    return () => clearInterval(interval);
  }, [events.length]);

  const handleDotClick = (index) => {
    setCurrentBannerIndex(index);
  };

  // Hàm điều khiển banner
  const prevBannerSlide = () => {
    setCurrentBannerIndex((prevIndex) =>
      prevIndex === 0 ? Math.ceil(events.length / 2) - 1 : prevIndex - 1
    );
  };

  const nextBannerSlide = () => {
    setCurrentBannerIndex(
      (prevIndex) => (prevIndex + 1) % Math.ceil(events.length / 2)
    );
  };

  // Hàm điều khiển EventCard slider
  const prevCardSlide = () => {
    setCurrentCardIndex((prevIndex) =>
      prevIndex === 0 ? events.length - 4 : Math.max(0, prevIndex - 1)
    );
  };

  const nextCardSlide = () => {
    setCurrentCardIndex((prevIndex) =>
      prevIndex + 1 >= events.length - 3 ? 0 : prevIndex + 1
    );
  };
  const prevCardSlideMusic = () => {
    setCurrentCardIndexMusic((prevIndex) =>
      prevIndex === 0 ? events.length - 4 : Math.max(0, prevIndex - 1)
    );
  };

  const nextCardSlideMusic = () => {
    setCurrentCardIndexMusic((prevIndex) =>
      prevIndex + 1 >= events.length - 3 ? 0 : prevIndex + 1
    );
  };

  const prevCardSlideArt = () => {
    setCurrentCardIndexArt((prevIndex) =>
      prevIndex === 0 ? events.length - 4 : Math.max(0, prevIndex - 1)
    );
  };

  const nextCardSlideArt = () => {
    setCurrentCardIndexArt((prevIndex) =>
      prevIndex + 1 >= events.length - 3 ? 0 : prevIndex + 1
    );
  };

  const prevCardSlideOther = () => {
    setCurrentCardIndexOther((prevIndex) =>
      prevIndex === 0 ? events.length - 4 : Math.max(0, prevIndex - 1)
    );
  };

  const nextCardSlideOther = () => {
    setCurrentCardIndexOther((prevIndex) =>
      prevIndex + 1 >= events.length - 3 ? 0 : prevIndex + 1
    );
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="home-page">
      <Header user={user} onLoginClick={handleLoginClick} />
      <div className="body-container">
        {/* ---------------------banner-------------------- */}
        <section className="banner">
          {events.length > 0 && (
            <div className="banner-container">
              <div
                className="banner-slide-group"
                style={{
                  transform: `translateX(-${currentBannerIndex * 100}%)`,
                }}
              >
                {events.slice(0, 6).map((event, index) => (
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
                      <div className="event-price">
                        Từ{" "}
                        {event.price
                          ? `${event.price.toLocaleString("vi-VN")}`
                          : "500.000"}{" "}
                        đ
                      </div>
                      <div className="event-date">
                        {new Date(event.startTime).toLocaleDateString("vi-VN")}
                      </div>
                      <button className="event-button">Xem chi tiết</button>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Nút mũi tên điều hướng */}
              <button
                className="banner-arrow banner-arrow-left"
                onClick={prevBannerSlide}
              >
                ❮
              </button>
              <button
                className="banner-arrow banner-arrow-right"
                onClick={nextBannerSlide}
              >
                ❯
              </button>

              {/* Dots điều hướng */}
              <div className="banner-dots">
                {Array.from({ length: Math.ceil(3) }).map((_, index) => (
                  <div
                    key={index}
                    className={`banner-dot ${
                      index === currentBannerIndex ? "active" : ""
                    }`}
                    onClick={() => handleDotClick(index)}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </section>
        {/* -------------------sự kiện nổi bật------------------ */}
        <section className="featured-events">
          <h2 className="featured-events-title">Sự kiện nổi bật</h2>
          <div
            className="event-list"
            style={{
              transform: `translateX(-${currentCardIndex * (100 / 4)}%)`,
            }}
          >
            {events.length > 0 ? (
              events
                .filter((event) => event.state === "approved")
                // .slice(currentCardIndex, currentCardIndex + 4)
                .map((event) => <EventCard key={event.id} event={event} />)
            ) : (
              <p>Không có sự kiện nào.</p>
            )}
          </div>
          {/* Nút điều hướng slider */}
          <button
            className="slider-arrow slider-arrow-left"
            onClick={prevCardSlide}
          >
            ❮
          </button>
          <button
            className="slider-arrow slider-arrow-right"
            onClick={nextCardSlide}
          >
            ❯
          </button>
        </section>
        {/* -----------------------ảnh voucher--------------------- */}
        <section className="voucher-banner">
          <img src={voucherImg} alt="voucher" className="voucher-img" />
        </section>
        {/* -----------------------Nhạc sống------------------------- */}
        <section className="music-events">
          <div className="music-events-header">
            <h2 className="music-events-title">Nhạc sống</h2>
            <Link to={`/search?q=music`} className="see-more">
              Xem thêm ❯
            </Link>
          </div>
          <div
            className="event-list"
            style={{
              transform: `translateX(-${currentCardIndexMusic * (100 / 4)}%)`,
            }}
          >
            {events.length > 0 ? (
              events
                .filter(
                  (event) =>
                    event.state === "approved" && event.tags.includes("music")
                )
                // .slice(currentCardIndex, currentCardIndex + 4)
                .map((event) => <EventCard key={event.id} event={event} />)
            ) : (
              <p>Không có sự kiện nào.</p>
            )}
          </div>
          {/* Nút điều hướng slider */}
          <button
            className="slider-arrow slider-arrow-left"
            onClick={prevCardSlideMusic}
          >
            ❮
          </button>
          <button
            className="slider-arrow slider-arrow-right"
            onClick={nextCardSlideMusic}
          >
            ❯
          </button>
        </section>
        {/* -----------------------Sân khấu và nghệ thuật------------------------- */}
        <section className="art-events">
          <div className="art-events-header">
            <h2 className="art-events-title">Sân khấu & Nghệ thuật</h2>
            <Link
              to={`/search/search?query=Sân%20khấu%20&%20Nghệ%20thuật`}
              className="see-more"
            >
              Xem thêm ❯
            </Link>
          </div>
          <div
            className="event-list"
            style={{
              transform: `translateX(-${currentCardIndexArt * (100 / 4)}%)`,
            }}
          >
            {events.length > 0 ? (
              events
                .filter(
                  (event) =>
                    event.state === "approved" &&
                    // event.tags.includes("art", "stage")
                    event.tags.includes("music")
                )
                // .slice(currentCardIndex, currentCardIndex + 4)
                .map((event) => <EventCard key={event.id} event={event} />)
            ) : (
              <p>Không có sự kiện nào.</p>
            )}
          </div>
          {/* Nút điều hướng slider */}
          <button
            className="slider-arrow slider-arrow-left"
            onClick={prevCardSlideArt}
          >
            ❮
          </button>
          <button
            className="slider-arrow slider-arrow-right"
            onClick={nextCardSlideArt}
          >
            ❯
          </button>
        </section>
        {/* -----------------------Thể loại khác------------------------- */}
        <section className="others-events">
          <div className="others-events-header">
            <h2 className="others-events-title">Thể loại khác</h2>
            <Link to={`/search?query=Khác`} className="see-more">
              Xem thêm ❯
            </Link>
          </div>
          <div
            className="event-list"
            style={{
              transform: `translateX(-${currentCardIndexOther * (100 / 4)}%)`,
            }}
          >
            {events.length > 0 ? (
              events
                .filter(
                  (event) =>
                    event.state === "approved" &&
                    // event.tags.includes("art", "stage")
                    event.tags.includes("music")
                )
                // .slice(currentCardIndex, currentCardIndex + 4)
                .map((event) => <EventCard key={event.id} event={event} />)
            ) : (
              <p>Không có sự kiện nào.</p>
            )}
          </div>
          {/* Nút điều hướng slider */}
          <button
            className="slider-arrow slider-arrow-left"
            onClick={prevCardSlideOther}
          >
            ❮
          </button>
          <button
            className="slider-arrow slider-arrow-right"
            onClick={nextCardSlideOther}
          >
            ❯
          </button>
        </section>
        {/* ------------------------Địa điểm đến thú vị-------------------- */}
        <section className="interest-location">
          <h2 className="interest-location-title">Điểm đến thú vị</h2>
          <div className="location-list">
            <Link
              to={`/search?q=Hồ Chí Minh`}
              className="location-item hochiminh-img"
            >
              <img src={hochiminh} alt="Tp. Hồ Chí Minh" className="img " />
            </Link>
            <Link to={`/search?q=Hà Nội`} className="location-item hanoi-img">
              <img src={hanoi} alt="Hà Nội" className="img " />
            </Link>
            <Link to={`/search?q=Đà+Lạt`} className="location-item dalat-img">
              <img src={dalat} alt="Đà Lạt" className="img " />
            </Link>
            <Link to={`/search?q=đà+nẵng`} className="location-item danang-img">
              <img src={danang} alt="Đà Nẵng" className="img " />
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;

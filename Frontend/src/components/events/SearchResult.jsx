import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../common/Header";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import EventCard from "./EventCard";
import "./SearchResult.css";
import Footer from "../common/Footer";

const SearchResult = () => {
  const [events, setEvents] = useState([]); // Dữ liệu sự kiện
  const [filteredEvents, setFilteredEvents] = useState([]); // Sự kiện đã lọc
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams(); // Lấy query từ URL
  const query = searchParams.get("q") || ""; // Nếu không có query thì mặc định là ""

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:3001/api/event/allEvents"
        ); // Lấy tất cả sự kiện
        setEvents(response.data); // Lưu tất cả sự kiện
      } catch (error) {
        console.error("Lỗi khi lấy sự kiện:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const removeVietnameseTones = (str) => {
      return str
        .normalize("NFD") // Chuẩn hóa thành dạng phân tách dấu
        .replace(/[\u0300-\u036f]/g, ""); // Loại bỏ các dấu tiếng Việt
    };
    if (query) {
      // Lọc sự kiện theo tên chứa query
      const filtered = events.filter(
        (event) =>
          removeVietnameseTones(event.name?.toLowerCase()).includes(
            removeVietnameseTones(query.toLowerCase())
          ) ||
          (event.location &&
            removeVietnameseTones(event.location.toLowerCase()).includes(
              removeVietnameseTones(query.toLowerCase())
            )) ||
          (event.tags &&
            event.tags.some((tag) =>
              removeVietnameseTones(tag.toLowerCase()).includes(
                removeVietnameseTones(query.toLowerCase())
              )
            ))
      );
      setFilteredEvents(filtered); // Cập nhật danh sách sự kiện sau khi lọc
    }
    // else {
    //   setFilteredEvents(events); // Nếu không có query, hiển thị tất cả sự kiện
    // }
  }, [events, query]); // Chạy lại khi có sự kiện mới hoặc query thay đổi

  // if (loading) return <div className="loading">Đang tải dữ liệu...</div>;

  return (
    <div className="search-results-bao">
      <Header />
      <div className="search-results-container">
        <div className="search-header">
          <h2>Kết quả tìm kiếm:</h2>
          {/* Bộ lọc ngày tháng và địa điểm */}
          {/* <div className="filters">
            <div className="date-filter-container">
              <label htmlFor="date-filter">Ngày:</label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  updateSearchParams();
                }}
                placeholderText="Chọn ngày"
                dateFormat="dd/MM/yyyy"
                isClearable
              />
            </div>
            <div className="location-filter-container">
              <label htmlFor="location-filter">Địa điểm:</label>
              <select
                id="location-filter"
                value={locationFilter}
                onChange={(e) => {
                  setLocationFilter(e.target.value);
                  updateSearchParams();
                }}
              >
                <option value="all">Toàn Quốc</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="TP HCM">TP HCM</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div> */}
        </div>
        <div className="search-event-list">
          {filteredEvents.length > 0 ? (
            filteredEvents
              .filter((event) => event.state === "approved")
              .map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <p>Không có sự kiện nào.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchResult;

import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../common/Header";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useLocation } from "react-router-dom";
import EventCard from "./EventCard";
import "./SearchResult.css";

const SearchResult = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [locationFilter, setLocationFilter] = useState("all");

  const navigate = useNavigate();
  const location = useLocation();

  // Hàm dùng để lấy giá trị của query param từ URL
  const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get(param);
  };

  useEffect(() => {
    // Gọi API khi component được mount hoặc khi query hoặc ngày thay đổi
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/event/allEvents`,
          {
            params: {
              search: getQueryParam("query") || "",
              date: selectedDate ? selectedDate.toISOString() : "",
              location: locationFilter !== "all" ? locationFilter : "",
            },
          }
        );
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents(); // Gọi hàm lấy dữ liệu khi có query hoặc ngày thay đổi
  }, [location.search, selectedDate, locationFilter]);

  // Hàm để cập nhật URL khi người dùng thay đổi bộ lọc
  const updateSearchParams = () => {
    const params = new URLSearchParams();

    if (selectedDate) {
      params.set("date", selectedDate.toISOString());
    }
    if (locationFilter !== "all") {
      params.set("location", locationFilter);
    }
    navigate({ search: params.toString() });
  };

  return (
    <div className="search-results-bao">
      <Header />
      <div className="search-results-container">
        <div className="search-header">
          <h2>Kết quả tìm kiếm:</h2>
          {/* Bộ lọc ngày tháng và địa điểm */}
          <div className="filters">
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
                <option value="TP HCM">Khác</option>
              </select>
            </div>
          </div>
        </div>
        <div
          className="search-event-list"
          // style={{
          //   transform: `translateX(-${currentCardIndex * (100 / 4)}%)`,
          // }}
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
      </div>
    </div>
  );
};

export default SearchResult;

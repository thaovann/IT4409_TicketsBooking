import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../common/Header.css";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]); // Danh sách gợi ý
  const [showSuggestions, setShowSuggestions] = useState(false); // Hiện thị dropdown
  const navigate = useNavigate(); // Hook để điều hướng

  const handleInputChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    // Cập nhật gợi ý (có thể thay đổi theo logic của bạn)
    if (value) {
      // Ví dụ gợi ý tĩnh
      const mockSuggestions = ["Gợi ý 1", "Gợi ý 2", "Gợi ý 3"];
      setSuggestions(
        mockSuggestions.filter((item) =>
          item.toLowerCase().includes(value.toLowerCase())
        )
      );
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearch = () => {
    if (query.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`); // Điều hướng đến trang kết quả tìm kiếm
    }
    setShowSuggestions(false); // Ẩn gợi ý sau khi tìm kiếm
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch(); // Gọi hàm tìm kiếm khi người dùng nhấn Enter
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion); // Đặt giá trị truy vấn thành gợi ý đã chọn
    setShowSuggestions(false); // Ẩn gợi ý sau khi chọn
    navigate(`/search?query=${encodeURIComponent(suggestion)}`); // Điều hướng đến trang kết quả tìm kiếm
  };

  return (
    <div className="search-bar">
      <i className="fa-solid fa-magnifying-glass"></i>
      <input
        type="text"
        className="search-input"
        placeholder="Bạn tìm gì hôm nay?"
        value={query}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        onFocus={() => setShowSuggestions(query.length > 0)} // Hiện gợi ý khi có nội dung
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Ẩn gợi ý khi mất focus
      />
      <button className="search-button" onClick={handleSearch}>
        Tìm kiếm
      </button>
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

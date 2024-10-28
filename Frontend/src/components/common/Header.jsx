import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import SearchBar from "../events/SearchBar";

function Header() {
  const handleSearch = async (query) => {
    try {
      const response = await fetch(
        `https://api.example.com/events?query=${query}`
      );
      const results = await response.json();
      console.log("Search results:", results);
      // Cập nhật state để hiển thị kết quả trên trang
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <img src="../../assets/img/ticketbox.png" alt="Logo" />
          </Link>
        </div>
        <div className="search-Bar">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="create-buttons">
          <Link to="/login" className="create-btn btn">
            Tạo sự kiện
          </Link>
        </div>
        <div className="history-buttons">
          <Link to="/login" className="history-btn btn">
            <i class="fa-solid fa-ticket"></i> Vé đã mua
          </Link>
        </div>

        <div className="auth-buttons">
          <Link to="/login" className="login-btn btn">
            Đăng nhập | Đăng ký
          </Link>
        </div>
      </div>
      <nav className="navigation">
        <ul>
          <li>
            <Link to="/search?query=Nhạc sống">Nhạc sống</Link>
          </li>
          <li>
            <Link to="/search?query=Sân khấu & Nghệ thuật">Sân khấu & Nghệ thuật</Link>
          </li>
          <li>
            <Link to="/search?query=Thể Thao">Thể Thao</Link>
          </li>
          <li>
            <Link to="/search?query=Khác">Khác</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;

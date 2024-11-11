import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Header.css";
import SearchBar from "../events/SearchBar";
import logo from '../../assets/img/ticketbox.png';
import avatarUser from '../../assets/img/avatar-clone-user.jpg';
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";

function Header({ hideCreateEvent, onLoginClick }) {
  const user = useSelector((state) => state.auth.login.currentUser); // Lấy thông tin người dùng từ Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = async (query) => {
    try {
      const response = await fetch(
        `https://localhost:3001/api/event/getEventByTypeId/?query=${query}`
      );
      const results = await response.json();
      console.log("Search results:", results);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  // xử lý logout Tuấn thêm
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
        </div>
        <div className="search-Bar">
          <SearchBar onSearch={handleSearch} />
        </div>

        {!hideCreateEvent && (
          <div className="create-buttons">
            <Link to={user ? "organizer/create-event" : "/login"} className="create-btn btn">
              Tạo sự kiện
            </Link>
          </div>
        )}

        <div className="history-buttons">
          <Link to={user ? "/purchased-tickets" : "/login"} className="history-btn btn">
            <i className="fa-solid fa-ticket"></i> Vé đã mua
          </Link>
        </div>

        <div className="auth-buttons">
          {user ? (
            <span className="user-greeting">
              <img src={avatarUser} alt="avatar user" />
              <p>{user.body?._doc?.FullName}</p>
              {/* button logout test Tuấn thêm */}
              <button onClick={handleLogout}>Đăng xuất</button>
            </span>
          ) : (
            <button onClick={onLoginClick} className="login-btn btn">
              Đăng nhập | Đăng ký
            </button>
          )}
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

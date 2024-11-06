import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./Header.css";
import SearchBar from "../events/SearchBar";
import logo from '../../assets/img/ticketbox.png';
import avatarUser from '../../assets/img/avatar-clone-user.jpg';
import { logout } from "../../redux/authSlice"; // Import hành động đăng xuất từ Redux

function Header({ hideCreateEvent, onLoginClick }) {
  const user = useSelector((state) => state.auth.login.currentUser);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // const handleLogout = () => {
  //   dispatch(logout()); // Thực hiện đăng xuất
  //   navigate("/login");
  // };

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
            <Link to={user ? "/create-event" : "/login"} className="create-btn btn">
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
            <div className="user-greeting" onClick={toggleDropdown}>
              <img src={avatarUser} alt="avatar user" />
              <p>{user.body?._doc?.FullName}</p>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item"><i class="fa-regular fa-user"></i> Trang cá nhân</Link>
                  <Link to="/purchased-tickets" className="dropdown-item"><i class="fa-solid fa-ticket"></i> Vé đã mua</Link>
                  <Link to="/my-events" className="dropdown-item"><i class="fa-regular fa-calendar-days"></i> Sự kiện của tôi</Link>
                  <button /*onClick={handleLogout}*/ className="dropdown-item logout-btn"><i class="fa-solid fa-arrow-right-from-bracket"></i> Đăng xuất</button>
                </div>
              )}
            </div>
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

// Trang vé đã mua
import React from 'react';
import './MyTickets.css';

const MyTickets = () => {
    return (
        <div className="container">
            <div className="sidebar">
                <div className="profile">
                    <img src="profile-pic-url" alt="Profile" className="profile-pic" />
                    <p className="username">Tuấn Phạm</p>
                </div>
                <nav className="nav">
                    <button className="nav-button">Thông tin tài khoản</button>
                    <button className="nav-button active">Vé đã mua</button>
                    <button className="nav-button">Sự kiện của tôi</button>
                </nav>
            </div>
            <div className="main-content">
                <h1>Vé đã mua</h1>
                <hr className="divider" />
                <div className="tabs">
                    <button className="tab active">Tất cả</button>
                    <button className="tab">Thành công</button>
                    <button className="tab">Đang xử lý</button>
                    <button className="tab">Đã hủy</button>
                </div>
                <div className="status-buttons">
                    <button className="status-button">Sắp diễn ra</button>
                    <button className="status-button">Đã kết thúc</button>
                </div>
                <div className="no-tickets">
                    <img src="no-tickets-image-url" alt="No Tickets" className="no-tickets-img" />
                    <p>Bạn chưa có vé nào</p>
                </div>
                <button className="buy-tickets-button">Mua vé ngay</button>
            </div>
        </div>
    );
};

export default MyTickets;

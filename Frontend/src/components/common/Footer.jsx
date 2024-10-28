import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Liên hệ</h4>
          <p>Email: support@ticketbox.vn</p>
          <p>Hotline: 1900 123 456</p>
        </div>
        <div className="footer-section">
          <h4>Chính sách</h4>
          <ul>
            <li>
              <a href="/terms">Điều khoản sử dụng</a>
            </li>
            <li>
              <a href="/privacy">Chính sách bảo mật</a>
            </li>
            <li>
              <a href="/refund">Chính sách hoàn vé</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Kết nối với chúng tôi</h4>
          <div className="social-media">
            <a href="https://facebook.com">
              <img src="path/to/facebook-icon.png" alt="Facebook" />
            </a>
            <a href="https://instagram.com">
              <img src="path/to/instagram-icon.png" alt="Instagram" />
            </a>
            <a href="https://twitter.com">
              <img src="path/to/twitter-icon.png" alt="Twitter" />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 TicketBox. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;

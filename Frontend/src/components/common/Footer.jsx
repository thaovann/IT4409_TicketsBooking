import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-contact">
          <h4 className="footer-contact-title">Liên hệ</h4>
          <p className="contact-desc">
            <i class="fa-regular fa-envelope"></i> Email: support@ticketSup.vn
          </p>
          <p className="contact-desc">
            <i class="fa-solid fa-phone"></i> Hotline:{" "}
            <span className="hotline">1900 123 456</span>
          </p>
          <p className="contact-desc">
            <i class="fa-solid fa-location-dot"></i> Văn phòng: 201 D5, Đại học
            Bách Khoa Hà Nội
          </p>
        </div>
        <div className="footer-policy">
          <h4 className="footer-policy-title">Chính sách</h4>
          <ul>
            <li>
              <a href="/terms">Điều khoản sử dụng cho khách hàng</a>
            </li>
            <li>
              <a href="/privacy">Chính sách bảo mật</a>
            </li>
            <li>
              <a href="/refund">Chính sách hoàn vé</a>
            </li>
          </ul>
        </div>
        <div className="footer-connect">
          <h4 className="footer-connect-title">Kết nối với chúng tôi</h4>
          <div className="footer-social-media">
            <a href="https://facebook.com" className="footer-facebook">
              <i class="fa-brands fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com" className="footer-instagram">
              <i class="fa-brands fa-instagram"></i>
            </a>
            <a href="https://twitter.com" className="footer-twitter">
              <i class="fa-brands fa-twitter"></i>
            </a>
            <a href="https://tiktok.com" className="footer-tiktok">
              <i class="fa-brands fa-tiktok"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 TicketSup. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;

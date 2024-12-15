import React from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentSuccess.css"; // Thêm CSS để styling (tuỳ chọn)

const PaymentSuccess = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/"); // Điều hướng về trang chủ
  };

  const handleCheckTickets = () => {
    navigate("/purchased-tickets"); // Điều hướng đến trang kiểm tra vé đã mua
  };

  return (
    <div className="payment-success-container">
      <div className="payment-success-content">
        <div className="check-circle-icon">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <h1>Thanh toán thành công!</h1>
        <p>
          Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Chúc bạn một ngày tốt
          lành!
        </p>
        <div className="payment-success-buttons">
          <button onClick={handleGoHome} className="go-home-button">
            Quay trở về trang chủ
          </button>
          <button onClick={handleCheckTickets} className="check-tickets-button">
            Kiểm tra vé đã mua
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

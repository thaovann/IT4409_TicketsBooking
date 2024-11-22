import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import "./PaymentPage.css";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventDetails, selectedTicketDetails, totalPrice } = location.state || {
    eventDetails: {},
    selectedTicketDetails: [],
    totalPrice: 0,
  };

  const [voucher, setVoucher] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleApplyVoucher = () => {
    // Logic kiểm tra và áp dụng voucher
    if (voucher === "DISCOUNT10") {
      setDiscount(totalPrice * 0.1); // Giảm 10%
      alert("Voucher áp dụng thành công!");
    } else {
      setDiscount(0);
      alert("Voucher không hợp lệ!");
    }
  };

  const handleConfirmPayment = () => {
    if (!paymentMethod) {
      alert("Vui lòng chọn hình thức thanh toán!");
      return;
    }

    // Xử lý logic thanh toán
    alert(`Thanh toán thành công qua ${paymentMethod}!`);
    navigate("/"); // Quay về trang chủ
  };

  return (
    <div className="bao">
      <Header hideNav={true}/>
      <div className="payment-container">
        {/* Phần 1: Thông tin sự kiện */}
        <div className="payment-event-info">
  <h2 className="payment-event-title">{eventDetails?.name}</h2>
  <p className="payment-event-desc">
    <strong><i class="fa-regular fa-calendar-days"></i> Thời gian:</strong> {new Date(eventDetails?.startTime).toLocaleString()} <br />
    <strong>Địa điểm:</strong> {eventDetails?.location}
  </p>
</div>


       <div className="payment-infos">
        {/* Phần 2: Hình thức thanh toán */}
        <div className="payment-method-section">
          <h2>Hình thức thanh toán</h2>
          <div className="payment-options">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="Thẻ tín dụng/Thẻ ghi nợ"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Thẻ tín dụng/Thẻ ghi nợ
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="Chuyển khoản ngân hàng"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Chuyển khoản ngân hàng
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="Thanh toán tại quầy"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Thanh toán tại quầy
            </label>
          </div>

        </div>

         <div className="payment-infos-right">

        {/* Phần 4: Nhập voucher */}
        <div className="voucher-section">
          <h2>Nhập voucher</h2>
          <div className="voucher-input">
            <input
              type="text"
              value={voucher}
              onChange={(e) => setVoucher(e.target.value)}
              placeholder="Nhập mã voucher"
            />
            <button className="voucher-button" onClick={handleApplyVoucher}>Áp dụng</button>
          </div>
        </div>

        {/* Phần 3: Thông tin thanh toán */}
        <div className="payment-info">
          <h2>Thông tin thanh toán</h2>
          <div className="ticket-summary">
            {selectedTicketDetails.map((ticket, index) => (
              <div key={index} className="ticket-summary-item">
                <h3>{ticket.name}</h3>
                <p>Giá: {ticket.price.toLocaleString()} đ</p>
                <p>Số lượng: {ticket.quantity}</p>
                <p>Tổng: {(ticket.price * ticket.quantity).toLocaleString()} đ</p>
              </div>
            ))}
          </div>
          <h2>
            Tổng tiền: {(totalPrice - discount).toLocaleString()} đ{" "}
            {discount > 0 && <span className="discount-note"><br/>(Đã áp dụng giảm giá)</span>}
          </h2>
          <button className="confirm-button" onClick={handleConfirmPayment}>
            Xác nhận thanh toán
          </button>
        </div>

         </div>
       </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentPage;

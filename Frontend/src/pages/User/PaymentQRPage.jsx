import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const PaymentQRPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentUrl, orderId } = location.state || {};
  const [paymentStatus, setPaymentStatus] = useState("pending"); // Trạng thái thanh toán
  const token = useSelector((state) => state.auth.login.currentUser?.token);

  useEffect(() => {
    if (!orderId) {
      alert("Không tìm thấy orderId!");
      navigate("/"); // Quay về trang chủ nếu không có orderId
      return;
    }

    // Hàm kiểm tra trạng thái giao dịch
    const checkTransactionStatus = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3001/payment/check-status-transaction",
          { orderId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.status) {
          setPaymentStatus(response.data.status);
        } else {
          alert("Không thể kiểm tra trạng thái thanh toán!");
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái thanh toán:", error);
        alert("Đã xảy ra lỗi khi kiểm tra trạng thái thanh toán.");
      }
    };

    // Kiểm tra trạng thái mỗi 5 giây
    const intervalId = setInterval(() => {
      checkTransactionStatus();
    }, 5000);

    return () => clearInterval(intervalId); // Xóa interval khi unmount
  }, [orderId, token, navigate]);

  if (!paymentUrl) {
    return <div>Đã xảy ra lỗi, không có URL thanh toán.</div>;
  }

  return (
    <div className="payment-qr-container">
      <h2>Thanh toán qua mã QR</h2>
      <p>Vui lòng quét mã QR bên dưới để hoàn tất thanh toán.</p>
      <div className="qr-code">
        <img src={paymentUrl} alt="QR Code" />
      </div>
      <p>
        Hoặc bạn có thể click{" "}
        <a href={paymentUrl} target="_blank" rel="noopener noreferrer">
          tại đây
        </a>{" "}
        để thanh toán trực tiếp.
      </p>
      <p>Trạng thái thanh toán hiện tại: <strong>{paymentStatus}</strong></p>
      {paymentStatus === "success" && (
        <div>
          <p>Thanh toán thành công! Bạn sẽ được chuyển hướng.</p>
          {setTimeout(() => navigate("/success-page"), 3000)}
        </div>
      )}
    </div>
  );
};

export default PaymentQRPage;


import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useSelector } from "react-redux"; // Thêm useSelector để lấy token từ Redux
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import "./PaymentPage.css";
import logoMoMo from "../../assets/img/logo-momo-inkythuatso/logo-momo.svg.svg";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventDetails, selectedTicketDetails, totalPrice } = location.state || {
    eventDetails: {},
    selectedTicketDetails: [],
    totalPrice: 0,
  };
  console.log('selectedTicketDetails: ',selectedTicketDetails)

  const [voucher, setVoucher] = useState("");//mã voucher được chọn
  const [discount, setDiscount] = useState(0);// số tiền giảm giá
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [userVouchers, setUserVouchers] = useState([]); // Danh sách voucher của người dùng
  const [error, setError] = useState(""); //lưu lỗi nếu có
  const token = localStorage.getItem("token");

  const userId = eventDetails?.userId; // Lấy userId từ eventDetails
  console.log('User ID from eventDetails:', userId);

  // Lấy voucher của người dùng từ API
  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:3001/voucher/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          setUserVouchers(response.data.vouchers); // Lưu danh sách voucher vào state
        })
        .catch((error) => {
          console.error("Lỗi khi lấy voucher:", error);
        });
    }
  }, [userId, token]);

  const handleApplyVoucher = () => {
    const selectedVoucher = userVouchers.find((v) => v.code === voucher);

    if (!selectedVoucher) {
      setError("Voucher không hợp lệ!");
      setDiscount(0);
      return;
    }

    // Kiểm tra điều kiện áp dụng
    if (!selectedVoucher.isActive) {
      setError("Voucher này hiện không còn hiệu lực.");
      setDiscount(0);
      return;
    }

    const now = new Date();
    if (now < new Date(selectedVoucher.startDate) || now > new Date(selectedVoucher.endDate)) {
      setError("Voucher đã hết hạn hoặc chưa được kích hoạt.");
      setDiscount(0);
      return;
    }

    if (totalPrice < selectedVoucher.minOrderValue) {
      setError(`Đơn hàng tối thiểu phải đạt ${selectedVoucher.minOrderValue.toLocaleString()} VND để áp dụng voucher này.`);
      setDiscount(0);
      return;
    }

    // Tính giá trị giảm giá
    let calculatedDiscount = 0;

    if (selectedVoucher.discountType === "percentage") {
      calculatedDiscount = (selectedVoucher.discountValue / 100) * totalPrice;
      if (selectedVoucher.maxDiscountAmount) {
        calculatedDiscount = Math.min(calculatedDiscount, selectedVoucher.maxDiscountAmount);
      }
    } else if (selectedVoucher.discountType === "fixed") {
      calculatedDiscount = selectedVoucher.discountValue;
    }

    setDiscount(calculatedDiscount);
    setError("");
    alert(`Voucher áp dụng thành công! Giảm ${calculatedDiscount.toLocaleString()} VND`);
  };

  const finalPrice = totalPrice - discount; // Tính giá trị cuối cùng


  const handleConfirmPayment = async () => {
    if (!paymentMethod) {
      alert("Vui lòng chọn hình thức thanh toán!");
      return;
    }

    if (selectedTicketDetails.length === 0) {
      alert("Vui lòng chọn ít nhất một loại vé!");
      return;
    }

    setLoading(true); // Bật trạng thái loading

    try {
          // Chuẩn bị thông tin để tạo order
          const orderData = {
            userId, // Lấy userId từ eventDetails
            eventId: eventDetails.eventId, // ID của sự kiện
            tickets: selectedTicketDetails.map((ticketCategory) => ({
              ticketCategoryId: ticketCategory.ticketCategoryId, // ID loại vé
              quantity: ticketCategory.quantity, // Tổng số vé đã đặt
              // ticketDetails: ticketCategory.tickets.map((ticket) => ({
              //   ticketId: ticket.ticketId, // ID của từng vé
              // })),
            })),
            orderDate: new Date().toISOString().split("T")[0], // Ngày đặt
            totalPrice, // Tổng giá vé trước khi áp dụng voucher
            finalPrice, // Giá cuối cùng sau khi áp dụng voucher
            state: "processing", // Trạng thái mặc định ban đầu
          };
    
          console.log('Order Data:', orderData); // Debug: kiểm tra dữ liệu gửi lên

      // 1. Gửi yêu cầu tạo order
      const createOrderResponse = await axios.post(
        "http://localhost:3001/order/", // API tạo order
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token xác thực
          },
        }
      );

      // Đảm bảo API trả về orderId
      const orderId = createOrderResponse.data?.orderId;
      if (!orderId) {
        alert("Không thể tạo đơn hàng. Vui lòng thử lại.");
        setLoading(false);
        return;
      }

      console.log("Order created successfully:", createOrderResponse.data);

      // 2. Gửi yêu cầu tạo URL thanh toán
      const createPaymentResponse = await axios.post(
        "http://localhost:3001/payment/create-payment", // API tạo URL thanh toán
        { _id: orderId }, // Truyền orderId trong body
        {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token xác thực
          },
        }
      );

      const paymentUrl = createPaymentResponse.data?.paymentUrl;
      console.log('paymentUrl: ', paymentUrl)

      if (paymentUrl) {
        // 3. Chuyển hướng người dùng đến trang thanh toán
        console.log("Redirecting to payment URL:", paymentUrl);
        window.location.href = paymentUrl; // Chuyển hướng trực tiếp đến URL MOMO
      } else {
        alert("Không nhận được URL thanh toán. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi trong quá trình thanh toán:", error);

      // Hiển thị thông báo lỗi cụ thể
      if (error.response?.data?.message) {
        alert(`Lỗi: ${error.response.data.message}`);
      } else {
        alert("Có lỗi xảy ra trong quá trình xử lý thanh toán. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false); // Tắt trạng thái loading
    }
  };

  

  return (
    <div className="bao">
      <Header hideNav={true} />
      <div className="payment-container">
        {/* Phần 1: Thông tin sự kiện */}
        <div className="payment-event-info">
          <h2 className="payment-event-title">{eventDetails?.name}</h2>
          <p className="payment-event-desc">
            <strong>
              <i className="fa-regular fa-calendar-days"></i> Thời gian:
            </strong>{" "}
            {new Date(eventDetails?.startTime).toLocaleString()} <br />
            <strong>
              <i className="fa-solid fa-location-dot"></i> Địa điểm:
            </strong>{" "}
            {eventDetails?.location}
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
                  value="ví MoMo"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <img src={logoMoMo} alt="MoMo" className="logo-momo"/>
                <span>Ví MoMo</span>
                
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
      <h2 className="voucher-title">Chọn voucher</h2>
      <div className="voucher-input">
        {/* Hiển thị danh sách voucher để người dùng chọn */}
        <select
          value={voucher}
          onChange={(e) => setVoucher(e.target.value)}
          className="voucher-select"
        >
          <option value="">-- Chọn voucher --</option>
          {userVouchers.map((v) => (
            <option key={v._id} value={v.code}>
              {v.code} - {v.discountType === "percentage" ? `${v.discountValue}%` : `${v.discountValue.toLocaleString()} VND`}
            </option>
          ))}
        </select>
        <button className="voucher-button" onClick={handleApplyVoucher}>
          Áp dụng
        </button>
      </div>
      {error && <div className="voucher-error">{error}</div>}
      {/* Hiển thị giá trị cuối cùng sau khi áp dụng voucher */}
      <div className="final-price">
        {/* <h3>Tổng giá trị đơn hàng: {finalPrice.toLocaleString()} VND</h3> */}
      </div>
    </div>

            {/* Phần 3: Thông tin thanh toán */}
            <div className="payment-info">
              <h2 className="payment-info-title">Thông tin thanh toán</h2>
              <div className="ticket-summary">
                {selectedTicketDetails.map((ticket, index) => (
                  <div key={index} className="ticket-summary-item">
                    <h3 className="ticket-summary-item-title">{ticket.name}</h3>
                    <p>Giá: {ticket.price.toLocaleString()} đ</p>
                    <p>Số lượng: {ticket.quantity}</p>
                    <p>Tổng: {(ticket.price * ticket.quantity).toLocaleString()} đ</p>
                  </div>
                ))}
              </div>
              <h2 className="ticket-summary-title">
                Tổng tiền:{" "}
                <strong className="ticket-summary-total">
                  {(totalPrice - discount).toLocaleString()} đ
                </strong>
                {discount > 0 && (
                  <span className="discount-note">
                    <br /> (Đã áp dụng giảm giá)
                  </span>
                )}
              </h2>
              <button
                className="confirm-button"
                onClick={handleConfirmPayment}
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Xác nhận thanh toán"}
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

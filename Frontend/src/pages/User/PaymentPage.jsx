import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux"; // Thêm useSelector để lấy token từ Redux
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import "./PaymentPage.css";
import logoMoMo from "../../assets/img/logo-momo-inkythuatso/logo-momo.svg.svg";
import logoVNpay from "../../assets/img/VNPAYlogo.png";

const PaymentPage = () => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.login.currentUser);
  console.log("Redux currentUser:", user);
  const { eventDetails, selectedTicketDetails, totalPrice } =
    location.state || {
      eventDetails: {},
      selectedTicketDetails: [],
      totalPrice: 0,
    };
  console.log("eventDetails: ", eventDetails);
  console.log("selectedTicketDetails: ", selectedTicketDetails);

  const [voucher, setVoucher] = useState(""); //mã voucher được chọn
  const [discount, setDiscount] = useState(0); // số tiền giảm giá
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [userVouchers, setUserVouchers] = useState([]); // Danh sách voucher của người dùng
  const [error, setError] = useState(""); //lưu lỗi nếu có
  const token = localStorage.getItem("token");

  //  Lấy userId từ localStorage
  const userId = user?.body?._doc?.UserId;
  console.log("User ID:", userId);

  // Lấy voucher của người dùng từ API
  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:3001/voucher/users/${userId}`, {
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
    if (
      now < new Date(selectedVoucher.startDate) ||
      now > new Date(selectedVoucher.endDate)
    ) {
      setError("Voucher đã hết hạn hoặc chưa được kích hoạt.");
      setDiscount(0);
      return;
    }

    if (totalPrice < selectedVoucher.minOrderValue) {
      setError(
        `Đơn hàng tối thiểu phải đạt ${selectedVoucher.minOrderValue.toLocaleString()} VND để áp dụng voucher này.`
      );
      setDiscount(0);
      return;
    }

    // Tính giá trị giảm giá
    let calculatedDiscount = 0;

    if (selectedVoucher.discountType === "percentage") {
      calculatedDiscount = (selectedVoucher.discountValue / 100) * totalPrice;
      if (selectedVoucher.maxDiscountAmount) {
        calculatedDiscount = Math.min(
          calculatedDiscount,
          selectedVoucher.maxDiscountAmount
        );
      }
    } else if (selectedVoucher.discountType === "fixed") {
      calculatedDiscount = selectedVoucher.discountValue;
    }

    setDiscount(calculatedDiscount);
    setError("");
    alert(
      `Voucher áp dụng thành công! Giảm ${calculatedDiscount.toLocaleString()} VND`
    );
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
      // Lấy danh sách vé khả dụng cho từng loại vé
      const ticketsData = await Promise.all(
        selectedTicketDetails.map(async (ticketCategory) => {
          const response = await axios.get(
            `http://localhost:3001/api/ticket/getAvailableTicket/${ticketCategory.ticketCategoryId}?number=${ticketCategory.quantity}`
          );

          // Xử lý nếu không đủ vé hoặc lỗi từ API
          if (
            !response.data ||
            response.data.ticketIds.length < ticketCategory.quantity
          ) {
            throw new Error(
              `Không đủ vé khả dụng cho loại vé ${ticketCategory.ticketCategoryId}.`
            );
          }

          return {
            ticketCategoryId: ticketCategory.ticketCategoryId,
            quantity: ticketCategory.quantity,
            ticketDetails: response.data.ticketIds.map((ticketId) => ({
              ticketId,
            })),
          };
        })
      );

      // Tạo cấu trúc orderData
      const orderData = {
        userId: userId, // Lấy userId từ eventDetails
        eventId: eventDetails._id, // ID của sự kiện
        tickets: ticketsData.map((ticketCategory) => ({
          ticketCategories: [
            {
              ticketCategoryId: ticketCategory.ticketCategoryId,
              ticketDetails: ticketCategory.ticketDetails,
            },
          ],
          quantity: ticketCategory.quantity,
        })),
        orderDate: new Date().toISOString().split("T")[0], // Ngày đặt
        totalPrice, // Tổng giá vé trước khi áp dụng voucher
        finalPrice, // Giá cuối cùng sau khi áp dụng voucher
        state: "processing", // Trạng thái mặc định ban đầu
      };

      console.log("Order Data:", JSON.stringify(orderData, null, 2)); // Debug: kiểm tra dữ liệu gửi lên

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

      const orderId = createOrderResponse.data?.body?._id;
      if (!orderId) {
        alert("Không thể tạo đơn hàng. Vui lòng thử lại.");
        setLoading(false);
        return;
      }

      console.log("Order created successfully:", createOrderResponse.data);

      // 2. Gửi yêu cầu tạo URL thanh toán
      const createPaymentResponse = await axios.post(
        "http://localhost:3001/payment/create-payment", // API tạo URL thanh toán
        { orderId: orderId }, // Truyền orderId trong body
        {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token xác thực
          },
        }
      );

      const paymentUrl = createPaymentResponse.data?.payUrl;
      console.log("Payment URL:", paymentUrl);

      if (paymentUrl) {
        // 3. Chuyển hướng người dùng đến trang thanh toán
        console.log("Redirecting to payment URL:", paymentUrl);
        window.location.href = paymentUrl; // Chuyển hướng trực tiếp đến URL MOMO
      } else {
        alert("Không nhận được URL thanh toán. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi trong quá trình thanh toán:", error);

      if (error.response?.data?.message) {
        alert(`Lỗi: ${error.response.data.message}`);
      } else {
        alert(
          "Có lỗi xảy ra trong quá trình xử lý thanh toán. Vui lòng thử lại."
        );
      }
    } finally {
      setLoading(false); // Tắt trạng thái loading
    }
  };
  const checkPaymentStatus = async (orderId, transactionId) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/payment/check-status-transaction", // API kiểm tra trạng thái thanh toán
        {
          orderId: orderId, // ID đơn hàng
          transactionId: transactionId, // ID giao dịch từ thanh toán
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token xác thực
          },
        }
      );

      // Kiểm tra kết quả trả về
      const paymentStatus = response.data?.status;
      if (paymentStatus === "success") {
        alert("Thanh toán thành công!");
        // Cập nhật trạng thái đơn hàng nếu cần thiết
      } else if (paymentStatus === "failed") {
        alert("Thanh toán không thành công!");
      } else {
        alert("Không thể xác nhận trạng thái thanh toán.");
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra trạng thái thanh toán:", error);
      alert("Có lỗi xảy ra khi kiểm tra trạng thái thanh toán.");
    }
  };

  return (
    <div className="bao">
      <Header hideNav={true} />
      <div className="step-section">
        <div className="step1 step">
          <span>
            <i class="fa-solid fa-circle-check"></i>
          </span>
          <span>Chọn vé</span>
        </div>
        <div className="hr"></div>
        <div className="step2 step">
          <span>
            <i class="fa-regular fa-circle"></i>
          </span>
          <span>Thanh toán</span>
        </div>
      </div>
      {/* Phần 1: Thông tin sự kiện */}
      <div className="payment-event-info">
        <div className="payment-event-info-container">
          <h2 className="payment-event-title">{eventDetails?.name}</h2>
          <p className="payment-event-desc">
            <strong className="event-time">
              <i className="fa-regular fa-calendar-days"></i> Thời gian:
            </strong>{" "}
            {new Date(eventDetails?.startTime).toLocaleString()} <br />
            <strong>
              <i className="fa-solid fa-location-dot"></i> Địa điểm:
            </strong>{" "}
            {eventDetails?.location}
          </p>
        </div>
      </div>
      <div className="payment-container">
        <div className="payment-infos">
          {/* Phần 2: Hình thức thanh toán */}
          <div className="payment-method-section">
            <h2 className="payment-method-section-title payment-page-title">
              Hình thức thanh toán
            </h2>
            <div className="payment-options">
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ví MoMo"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <img src={logoMoMo} alt="Momo" className="logo-momo" />
                <span className="payment-method-title">Ví Momo</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="VN-pay"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <img
                  src={logoVNpay}
                  alt="VNpay"
                  className="logo-vnpay"
                  // style={{ width: "30px" }}
                />
                <span className="payment-method-title"> VN pay</span>
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
                  <option value=""> Chọn voucher </option>
                  {userVouchers.map((v) => (
                    <option key={v._id} value={v.code}>
                      {v.code} -{" "}
                      {v.discountType === "percentage"
                        ? `${v.discountValue}%`
                        : `${v.discountValue.toLocaleString()} VND`}
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
              <h2 className="payment-info-title payment-page-title">
                Thông tin thanh toán
              </h2>
              <div className="ticket-summary">
                {selectedTicketDetails.map((ticket, index) => (
                  <div key={index} className="ticket-summary-item">
                    <h3 className="ticket-summary-item-title">{ticket.name}</h3>
                    <p>Giá: {ticket.price.toLocaleString()} đ</p>
                    <p>Số lượng: {ticket.quantity}</p>
                    <p>
                      Tổng: {(ticket.price * ticket.quantity).toLocaleString()}{" "}
                      đ
                    </p>
                  </div>
                ))}
              </div>
              <h2 className="ticket-summary-title payment-page-title">
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

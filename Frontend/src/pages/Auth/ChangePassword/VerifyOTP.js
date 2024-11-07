// src/pages/Auth/ChangePassword/VerifyOTP.js
import React, { useState } from "react";
import { verifyOTP } from "../../../redux/apiRequest";
import { useNavigate } from "react-router-dom";

const VerifyOTP = () => {
    const [Email, setEmail] = useState("");
    const [OTP, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = verifyOTP(Email, OTP);
            //setMessage("OTP verified successfully!");
            console.log(res.data);
            navigate("/reset-password"); // Điều hướng đến trang đặt lại mật khẩu nếu OTP đúng
        } catch (error) {
            setMessage("Invalid OTP. Please try again.");
        }
    };

    return (
        <div>
            <h2>Verify OTP</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={OTP}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                />
                <button type="submit">Verify OTP</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default VerifyOTP;

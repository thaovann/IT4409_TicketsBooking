import React, { useState } from "react";
import { passwordForgot } from "../../../redux/apiRequest";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [Email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await passwordForgot(Email);
            setMessage(res.headers.message);
            console.log(res.headers.message);
            navigate("/verify-otp");
        } catch (error) {
            setMessage("Failed to send OTP. Please try again.");
        }
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your registered email"
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Send OTP</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ForgotPassword;



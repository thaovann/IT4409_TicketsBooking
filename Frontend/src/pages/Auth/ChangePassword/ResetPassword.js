// src/pages/Auth/ChangePassword/ResetPassword.js
import React, { useState } from "react";
import { resetPassword } from "../../../redux/apiRequest";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");   // new password
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        try {
            const res = resetPassword(Email, Password);
            setMessage(res.headers.message);
            navigate("/login"); // Điều hướng về trang login sau khi đặt lại mật khẩu thành công
        } catch (error) {
            setMessage("Failed to reset password. Please try again.");
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ResetPassword;

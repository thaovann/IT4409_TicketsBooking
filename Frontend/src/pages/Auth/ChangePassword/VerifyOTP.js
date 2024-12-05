// src/pages/Auth/ChangePassword/VerifyOTP.js
import React, { useState, useEffect } from "react";
import { verifyOTP, passwordForgot } from "../../../redux/apiRequest";
import { useNavigate } from "react-router-dom";
import ccimg from "../../../assets/concert.png";
import { Alert, Box, Button, Container, Grid, Typography, Snackbar } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import OTPInput from "react-otp-input";

const darkTheme = createTheme({
    palette: {
        mode: "light",
    },
});

const boxstyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "75%",
    height: "70%",
    bgcolor: "background.paper",
    boxShadow: 24,
};

// Hàm render tùy chỉnh cho từng ô nhập OTP
const renderInput = (props) => {
    return (
        <input
            {...props}
            style={{
                width: "60px", // Độ rộng của mỗi ô
                height: "60px", // Chiều cao của mỗi ô
                margin: "0 5px", // Khoảng cách giữa các ô
                fontSize: "24px", // Kích thước chữ
                textAlign: "center", // Canh giữa chữ
                border: "2px solid #FFC300", // Viền màu vàng
                borderRadius: "8px", // Bo góc
            }}
        />
    );
};

const VerifyOTP = () => {
    const email = localStorage.getItem("email");
    const [OTP, setOtp] = useState("");
    const [timeLeft, setTimeLeft] = useState(60); // 3 phút = 180 giây
    const [resendAvailable, setResendAvailable] = useState(false);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let timer;
        if (timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000); // Giảm thời gian mỗi giây
        } else {
            setResendAvailable(true); // Cho phép gửi lại OTP
        }
        return () => clearInterval(timer); // Dọn dẹp timer khi component unmount
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const handleResendOtp = async (e) => {
        e.preventDefault();
        try {
            const res = await passwordForgot(email);
            console.log("otp resend", res);
            setTimeLeft(60);
            setResendAvailable(false);
        } catch (error) {
            console.log("Failed to RESEND OTP. Please try again.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await verifyOTP(email, OTP);
        console.log(res);
        const validateErr = res.message;
        if (validateErr === "Lỗi xác thực: Thiếu hoặc thuộc tính không hợp lệ: Mã OTP phải có 4 chữ số") {
            setError('Mã OTP phải có 4 chữ số');
            setOpen(true);
        } else if (validateErr === "Auth Error: Xác thực OTP thất bại") {
            setError("OTP chưa chính xác hoặc đã quá hạn");
            setOpen(true);
        } else {
            navigate("/reset-password"); // Điều hướng đến trang đặt lại mật khẩu nếu OTP đúng
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <>
            <div
                style={{
                    //backgroundImage: `url(${bgimg})`,
                    backgroundSize: "cover",
                    height: "100vh",
                    color: "#333333",
                    backgroundColor: "#2c2c2c",
                }}
            >
                <Box sx={boxstyle}>
                    <Grid container>
                        <Grid item xs={12} sm={12} lg={6}>
                            <Box
                                style={{
                                    backgroundImage: `url(${ccimg})`,
                                    backgroundSize: "cover",
                                    height: "70vh",
                                    backgroundColor: "#FFECC8",
                                }}
                            ></Box>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={6}>
                            <Box
                                style={{
                                    backgroundSize: "cover",
                                    height: "70vh",
                                    minHeight: "500px",
                                    backgroundColor: "#FFF7D1",
                                }}
                            >
                                <ThemeProvider theme={darkTheme}>
                                    <Container>
                                        <Box height={35} />
                                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                            <Typography component="h1" variant="h4" sx={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                                                Xác thực OTP
                                            </Typography>
                                        </Box>
                                        <Box height={85} />
                                        <Box sx={{ display: 'flex', flexDirection: "column", textAlign: "center", justifyContent: 'center', alignItems: 'center', }}>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    ml: "3em",
                                                    mr: "3em",
                                                }}>
                                                Nhập 4 chữ số được gửi về email:
                                            </Typography>

                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    fontStyle: "italic",
                                                    ml: "3em",
                                                    mr: "3em",
                                                    color: "rgba(0, 0, 0, 0.6)"
                                                }}>
                                                {email}
                                            </Typography>
                                        </Box>
                                        <Box
                                            component="form"
                                            noValidate
                                            onSubmit={handleSubmit}
                                            sx={{ mt: 2 }}
                                        >
                                            <Grid container spacing={1}>
                                                <Grid item xs={12} sx={{ ml: "7.5em", mr: "3em" }}>
                                                    <OTPInput
                                                        value={OTP}
                                                        onChange={setOtp}
                                                        numInputs={4} // Số ô nhập
                                                        separator={<span>-</span>} // Ngăn cách các ô
                                                        renderInput={renderInput} // Sử dụng hàm render tùy chỉnh
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sx={{ mt: 2, ml: "3em", mr: "3em", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                                    <Typography variant="body1">
                                                        Không nhận được mã ?
                                                    </Typography>
                                                    {resendAvailable ? (
                                                        <Button
                                                            onClick={handleResendOtp}
                                                            variant="text"
                                                            sx={{
                                                                p: 0,
                                                                textTransform: 'none',
                                                                textDecoration: 'underline',
                                                                color: 'blue',
                                                                '&:hover': {
                                                                    textDecoration: 'underline',
                                                                    backgroundColor: 'transparent'
                                                                }
                                                            }}
                                                        >
                                                            Gửi lại
                                                        </Button>
                                                    ) : (
                                                        <Typography variant="body1">
                                                            {formatTime(timeLeft)}
                                                        </Typography>
                                                    )}
                                                </Grid>

                                                <Grid item xs={12} sx={{ mt: 2, ml: "5em", mr: "5em", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        fullWidth
                                                        size="large"
                                                        sx={{
                                                            mt: "10px",
                                                            borderRadius: 28,
                                                            color: "#ffffff",
                                                            minWidth: "170px",
                                                            backgroundColor: "#FFC300",
                                                        }}
                                                    >
                                                        Tiếp tục
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Container>
                                </ThemeProvider>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>
            </div>
        </>
    );
};

export default VerifyOTP;

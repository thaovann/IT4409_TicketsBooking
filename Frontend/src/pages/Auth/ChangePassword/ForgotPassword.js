import React, { useState } from "react";
import { passwordForgot } from "../../../redux/apiRequest";
import { useNavigate } from "react-router-dom";
import ccimg from "../../../assets/concert.png";
import { Avatar, Alert, Box, Button, Container, Grid, TextField, Typography, Snackbar } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

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

const ForgotPassword = () => {
    const [Email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await passwordForgot(Email);
            console.log(res);
            navigate("/verify-otp");
        } catch (error) {
            console.log("Failed to send OTP. Please try again.");
        }
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
                                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
                                            <Typography component="h1" variant="h4">
                                                Quên mật khẩu
                                            </Typography>
                                        </Box>
                                        <Box height={85} />
                                        <Box sx={{ display: 'flex', textAlign: "center", justifyContent: 'center', alignItems: 'center', }}>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    fontStyle: "italic",
                                                    ml: "3em",
                                                    mr: "3em",
                                                    color: "rgba(0, 0, 0, 0.6)"
                                                }}>
                                                Vui lòng điền email mà bạn cần đổi mật khẩu, sau đó chúng tôi sẽ gửi một mã OTP về email của bạn.
                                            </Typography>
                                        </Box>

                                        <Box
                                            component="form"
                                            noValidate
                                            onSubmit={handleSubmit}
                                            sx={{ mt: 2 }}
                                        >
                                            <Grid container spacing={1}>
                                                <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                                                    <TextField
                                                        fullWidth
                                                        placeholder="Nhập email"
                                                        value={Email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        required
                                                    />
                                                </Grid>
                                                <Box height={35} />
                                                <Grid item xs={12} sx={{ ml: "5em", mr: "5em", display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                                                        Gửi mã OTP
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
                {/* <h2>Forgot Password</h2>
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
            {message && <p>{message}</p>} */}
            </div>
        </>
    );
};

export default ForgotPassword;



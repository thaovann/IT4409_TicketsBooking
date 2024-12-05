// src/pages/Auth/ChangePassword/ResetPassword.js
import React, { useState } from "react";
import { resetPassword } from "../../../redux/apiRequest";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Container, Grid, TextField, Typography, Snackbar } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ccimg from "../../../assets/concert.png";

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

const ResetPassword = () => {
    const email = localStorage.getItem("email");
    const [Password, setPassword] = useState("");   // new password
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (Password !== confirmPassword) {
                setError('Nhập lại mật khẩu không khớp');
                setOpen(true);
            }
            else {
                const res = await resetPassword(email, Password);
                console.log("reset pass", res);
                localStorage.removeItem("email");
                navigate("/login"); // Điều hướng về trang login sau khi đặt lại mật khẩu thành công
            }
        } catch (error) {
            console.log("Failed to reset password. Please try again.");
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
                                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
                                            <Typography component="h1" variant="h4">
                                                Đổi mật khẩu
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
                                                        required
                                                        fullWidth
                                                        placeholder="Nhập mật khẩu mới"
                                                        name="newPassword"
                                                        type="password"
                                                        id="newPassword"
                                                        value={Password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                                                    <TextField
                                                        required
                                                        fullWidth
                                                        placeholder="Nhập lại mật khẩu mới"
                                                        name="confirmPassword"
                                                        type="password"
                                                        id="confirmPassword"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                    />
                                                </Grid>

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

export default ResetPassword;

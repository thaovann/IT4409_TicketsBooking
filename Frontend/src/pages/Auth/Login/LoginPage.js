import ccimg from "../../../assets/concert.png";
import { Avatar, Alert, Box, Button, Checkbox, Container, Grid, Stack, TextField, Typography, FormControlLabel, Snackbar } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../redux/apiRequest";

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

// const textFieldStyles = {
//     '& .MuiOutlinedInput-root': {
//         backgroundColor: '#ffea99', // Custom background color 
//         '& fieldset': {
//             borderColor: '#333333', // Default border color 
//         },
//         '&:hover fieldset': {
//             borderColor: '#333333', // Border color on hover 
//         },
//         '&.Mui-focused fieldset': {
//             borderColor: '#333333', // Border color when focused 
//         },
//     },
//     '& .MuiInputLabel-root': {
//         color: '#333333', // Label color 
//     },
//     '& .MuiInputBase-input': {
//         color: '#333333', // Text color 
//     },
// }

export default function LoginPage() {
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const newUser = {
            Email: Email,
            Password: Password,
        };
        const res = await loginUser(newUser, dispatch, navigate);
        //console.log(res);
        const validateErr = res.message;
        if (newUser.Email === "" || newUser.Password === "") {
            setError('Email và Mật khẩu không được trống');
            setOpen(true);
        }
        else if (validateErr === "Lỗi xác thực: Thiếu hoặc thuộc tính không hợp lệ: Email phải hợp lệ") {
            setError("Email sai định dạng");
            setOpen(true);
        } else if (validateErr === "Auth Error: Email not registered") {
            setError("Email không tồn tại");
            setOpen(true);
        } else if (validateErr === "Auth Error: Incorrect Password") {
            setError("Sai mật khẩu");
            setOpen(true);
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
                                            <Avatar sx={{ mb: "4px", bgColor: "#ffffff" }}>
                                                <LockOutlinedIcon sx={{ bgColor: '#FFC300' }} />
                                            </Avatar>
                                            <Typography component="h1" variant="h4">
                                                Đăng nhập
                                            </Typography>
                                        </Box>
                                        <Box
                                            component="form"
                                            noValidate
                                            onSubmit={handleLogin}
                                            sx={{ mt: 2 }}
                                        >
                                            <Grid container spacing={1}>
                                                <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                                                    <TextField
                                                        required
                                                        fullWidth
                                                        id="email"
                                                        label="Email"
                                                        name="email"
                                                        value={Email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    //sx={textFieldStyles}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                                                    <TextField
                                                        required
                                                        fullWidth
                                                        name="password"
                                                        label="Mật khẩu"
                                                        type="password"
                                                        id="password"
                                                        value={Password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                    //sx={textFieldStyles}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                                                    <Stack direction="row" spacing={6}>
                                                        <FormControlLabel
                                                            sx={{ width: "60%" }}
                                                            onClick={() => setRemember(!remember)}
                                                            control={
                                                                <Checkbox
                                                                    checked={remember}
                                                                    sx={{
                                                                        color: '#333333',
                                                                        '&.Mui-checked': {
                                                                            color: '#333333',
                                                                        },
                                                                    }}
                                                                />
                                                            }
                                                            label="Nhớ tài khoản"
                                                        />
                                                        <Typography
                                                            variant="body1"
                                                            component="span"
                                                            onClick={() => {
                                                                navigate("/forgot-password");
                                                            }}
                                                            style={{ marginTop: "10px", cursor: "pointer" }}
                                                        >
                                                            Quên mật khẩu?
                                                        </Typography>
                                                    </Stack>
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
                                                <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                                                    <Stack direction="row" spacing={2}>
                                                        <Typography
                                                            variant="body1"
                                                            component="span"
                                                            style={{ marginTop: "10px" }}
                                                        >
                                                            Chưa có tài khoản?{" "}
                                                            <span
                                                                style={{ color: "#beb4fb", cursor: "pointer" }}
                                                                onClick={() => {
                                                                    navigate("/register");
                                                                }}
                                                            >
                                                                Đăng ký
                                                            </span>
                                                        </Typography>
                                                    </Stack>
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
}
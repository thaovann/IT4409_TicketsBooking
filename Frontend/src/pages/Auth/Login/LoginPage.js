import ccimg from "../../../assets/concert.png";
import { Avatar, Box, Button, Checkbox, Container, Grid, Stack, TextField, Typography, FormControlLabel } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../redux/apiRequest";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
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

const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            borderColor: "#333333", // Default border color
        },
        "&:hover fieldset": {
            borderColor: "#333333", // Hover border color
        },
        "&.Mui-focused fieldset": {
            borderColor: "#333333", // Focused border color
        },
        "& input": {
            color: "#333333", // Text color
        },
    },
    "& .MuiInputLabel-root": {
        color: "#333333", // Default label color
    },
    "&:hover .MuiInputLabel-root": {
        color: "#333333", // Hover label color
    },
    "&.Mui-focused .MuiInputLabel-root": {
        color: "#333333", // Focused label color
    },
}

export default function LoginPage() {
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        const newUser = {
            Email: Email,
            Password: Password,
        };
        loginUser(newUser, dispatch, navigate);
    };

    return (
        <>
            <div
                style={{
                    //backgroundImage: `url(${bgimg})`,
                    backgroundSize: "cover",
                    height: "100vh",
                    color: "#333333",
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
                                    color: "#f5f5f5",
                                }}
                            ></Box>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={6}>
                            <Box
                                style={{
                                    backgroundSize: "cover",
                                    height: "70vh",
                                    minHeight: "500px",
                                    backgroundColor: "#ffea99",
                                }}
                            >
                                <ThemeProvider theme={darkTheme}>
                                    <Container>
                                        <Box height={35} />
                                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
                                            <Avatar sx={{ mb: "4px", bgColor: "#ffffff" }}>
                                                <LockOutlinedIcon sx={{ color: '#ffffff' }} />
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
                                                        autoComplete="email"
                                                        autoFocus
                                                        value={Email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        sx={textFieldStyles}
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
                                                        autoComplete="new-password"
                                                        value={Password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        sx={textFieldStyles}
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
                                                            backgroundColor: "#008080",
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
            </div>
        </>
    );
}
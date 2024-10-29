// import { useState } from "react";
// import "./LoginPage.css";
// import { Link, useNavigate } from "react-router-dom";
// import { loginUser } from "../../../redux/apiRequest";
// import { useDispatch } from "react-redux";

// const LoginPage = () => {
//     const [Email, setEmail] = useState("");
//     const [Password, setPassword] = useState("");
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const handleLogin = (e) => {
//         e.preventDefault();
//         const newUser = {
//             Email: Email,
//             Password: Password,
//         };
//         loginUser(newUser, dispatch, navigate);
//     }

//     return (
//         <section className="login-container">
//             <div className="login-title"> Log in</div>
//             <form onSubmit={handleLogin}>
//                 <label>EMAIL</label>
//                 <input type="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
//                 <label>PASSWORD</label>
//                 <input type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
//                 <button type="submit"> Continue </button>
//             </form>
//             <div className="login-register"> Don't have an account yet? </div>
//             <Link className="login-register-link" to="/register">Register one for free </Link>
//         </section>
//     );
// }

// export default LoginPage;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../redux/apiRequest";
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
} from "@mui/material";

const LoginPage = () => {
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
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
        <Container maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: 3,
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Typography component="h1" variant="h5" gutterBottom>
                    Log in
                </Typography>
                <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={Email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#ccc",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#888",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#4caf50",
                                },
                            },
                        }}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={Password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#ccc",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#888",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#4caf50",
                                },
                            },
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2, backgroundColor: "#4caf50", "&:hover": { backgroundColor: "#43a047" } }}
                    >
                        Continue
                    </Button>
                    <Grid container justifyContent="center">
                        <Grid item>
                            <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                                <Typography variant="body2" color="primary">
                                    Forgot password?
                                </Typography>
                            </Link>
                            <Typography variant="body2" color="textSecondary">
                                Don't have an account yet?
                            </Typography>
                            <Link to="/register" style={{ textDecoration: 'none' }}>
                                <Typography variant="body2" color="primary">
                                    Register one for free
                                </Typography>
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginPage;


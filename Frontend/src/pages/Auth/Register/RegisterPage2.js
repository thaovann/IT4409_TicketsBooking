import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ccimg from "../../../assets/concert.png";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useState } from "react";
import Stack from "@mui/material/Stack";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../redux/apiRequest";
import { useNavigate } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

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

const center = {
    position: "relative",
    top: "50%",
    left: "30%",
};

export default function Register() {
    const [FullName, setFullName] = useState('');
    const [IdCard, setIdCard] = useState('');
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [Phone, setPhone] = useState('');
    const [Role, setRole] = useState(0);  // Mặc định là 0
    const [Gender, setGender] = useState(0);  // Mặc định là 0 (Nam)
    const [DoB, setDob] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        const newUser = {
            FullName: FullName,
            IdCard: IdCard,
            Email: Email,
            Password: Password,
            Phone: Phone,
            Role: Role,
            Gender: Gender,
            DoB: DoB
        };
        registerUser(newUser, dispatch, navigate);
    }

    return (
        <>
            <div
                style={{
                    //backgroundImage: `url(${bgimg})`,
                    backgroundSize: "cover",
                    height: "100vh",
                    color: "#f5f5f5",
                }}
            >
                <Box sx={boxstyle}>
                    <Grid container>
                        <Grid item xs={12} sm={12} lg={6}>
                            <Box
                                style={{
                                    backgroundImage: `url(${ccimg})`,
                                    backgroundSize: "cover",
                                    marginTop: "40px",
                                    marginLeft: "15px",
                                    marginRight: "15px",
                                    height: "63vh",
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
                                    backgroundColor: "#3b33d5",
                                }}
                            >
                                <ThemeProvider theme={darkTheme}>
                                    <Container>
                                        <Box height={25} />
                                        <Box sx={center}>
                                            <Typography component="h1" variant="h4">
                                                Đăng ký
                                            </Typography>
                                        </Box>
                                        <Box sx={{ mt: 2 }} />
                                        <form onSubmit={handleRegister}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Fullname"
                                                        size="small"
                                                        name="username"
                                                        onChange={(e) => setFullName(e.target.value)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        id="email"
                                                        label="Email"
                                                        type="email"
                                                        name="email"
                                                        size="small"
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        fullWidth
                                                        name="password"
                                                        label="Password"
                                                        type="password"
                                                        size="small"
                                                        id="password"
                                                        autoComplete="new-password"
                                                        onChange={(e) => setPassword(e.target.value)}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        fullWidth
                                                        name="confirmpassword"
                                                        label="Confirm Password"
                                                        type="password"
                                                        size="small"
                                                        id="confirmpassword"
                                                        autoComplete="new-password"
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        fullWidth
                                                        name="mobile"
                                                        label="Contact Number"
                                                        type="number"
                                                        size="small"
                                                        onChange={(e) => setPhone(e.target.value)}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="demo-simple-select-label">
                                                            Giới tính
                                                        </InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={Gender}
                                                            label="Gender"
                                                            size="small"
                                                            onChange={(e) => setGender(e.target.value)}
                                                        >
                                                            <MenuItem value={0}>Male</MenuItem>
                                                            <MenuItem value={1}>Female</MenuItem>
                                                            <MenuItem value={2}>Other</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} sx={{ ml: "5em", mr: "5em" }}>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        fullWidth="true"
                                                        size="large"
                                                        sx={{
                                                            mt: "15px",
                                                            mr: "20px",
                                                            borderRadius: 28,
                                                            color: "#ffffff",
                                                            minWidth: "170px",
                                                            backgroundColor: "#FF9A01",
                                                        }}
                                                    >
                                                        Tạo tài khoản
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Stack direction="row" spacing={2}>
                                                        <Typography
                                                            variant="body1"
                                                            component="span"
                                                            style={{ marginTop: "10px" }}
                                                        >
                                                            Đã có tài khoản?{" "}
                                                            <span
                                                                style={{ color: "#beb4fb", cursor: "pointer" }}
                                                                onClick={() => {
                                                                    navigate("/login");
                                                                }}
                                                            >
                                                                Đăng nhập
                                                            </span>
                                                        </Typography>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </form>
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

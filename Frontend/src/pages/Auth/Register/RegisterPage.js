import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ccimg from "../../../assets/concert.png";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { InputAdornment, Tooltip } from "@mui/material";
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
import { Alert, Snackbar } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';

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

export default function Register() {
    const [FullName, setFullName] = useState('');
    const [IdCard, setIdCard] = useState('');
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [Phone, setPhone] = useState('');
    const [Role, setRole] = useState(0);  // Mặc định là 0
    const [Gender, setGender] = useState(0);  // Mặc định là 0 (Nam)
    //const [DoB, setDob] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        const newUser = {
            FullName: FullName,
            IdCard: IdCard,
            Email: Email,
            Password: Password,
            Phone: Phone,
            Role: Role,
            Gender: Gender,
            //DoB: DoB
        };
        const res = await registerUser(newUser, dispatch, navigate);
        if (res && res.message) {
            const msg = res.message;
            const parts = msg.split(':');
            const validateErr = parts[2]?.trim();
            if (newUser.FullName === "" || newUser.IdCard === "" || newUser.Email === "" || newUser.Password === "" || newUser.Phone === "") {
                setError('Cần điền tất cả các ô');
                setOpen(true);
            } else {
                setError(validateErr);
                setOpen(true);
            }
        }
    }

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
                                            <Typography component="h1" variant="h4">
                                                Đăng ký
                                            </Typography>
                                        </Box>
                                        <Box
                                            component="form"
                                            noValidate
                                            onSubmit={handleRegister}
                                            sx={{ mt: 2 }}
                                        >
                                            <Grid container spacing={1}>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        required
                                                        fullWidth
                                                        label="Họ và tên"
                                                        size="small"
                                                        name="username"
                                                        value={FullName}
                                                        onChange={(e) => setFullName(e.target.value)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        required
                                                        fullWidth
                                                        label="CCCD/CMND"
                                                        type="number"
                                                        size="small"
                                                        name="idcard"
                                                        value={IdCard}
                                                        onChange={(e) => setIdCard(e.target.value)}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <Tooltip title="CCCD/CMND gồm 12 chữ số">
                                                                        <InfoIcon />
                                                                    </Tooltip>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        required
                                                        fullWidth
                                                        id="email"
                                                        label="Email"
                                                        name="email"
                                                        size="small"
                                                        value={Email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        required
                                                        fullWidth
                                                        name="password"
                                                        label="Mật khẩu"
                                                        type="password"
                                                        size="small"
                                                        id="password"
                                                        value={Password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <Tooltip title="Mật khẩu phải chứa ít nhất một chữ số, một chữ cái viết thường, một chữ cái viết hoa và một ký tự đặc biệt">
                                                                        <InfoIcon />
                                                                    </Tooltip>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </Grid>
                                                {/* <Grid item xs={6}>
                                                    <TextField
                                                        required
                                                        fullWidth
                                                        name="confirmpassword"
                                                        label="Nhập lại mật khẩu"
                                                        type="password"
                                                        size="small"
                                                        id="confirmpassword"
                                                    />
                                                </Grid> */}
                                                <Grid item xs={6}>
                                                    <TextField
                                                        required
                                                        fullWidth
                                                        name="mobile"
                                                        label="Điện thoại"
                                                        type="number"
                                                        size="small"
                                                        value={Phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <Tooltip title="Phải là một số điện thoại hợp lệ với mã quốc gia">
                                                                        <InfoIcon />
                                                                    </Tooltip>
                                                                </InputAdornment>
                                                            ),
                                                        }}
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
                                                            <MenuItem value={0}>Nam</MenuItem>
                                                            <MenuItem value={1}>Nữ</MenuItem>
                                                            <MenuItem value={2}>Khác</MenuItem>
                                                        </Select>
                                                    </FormControl>
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
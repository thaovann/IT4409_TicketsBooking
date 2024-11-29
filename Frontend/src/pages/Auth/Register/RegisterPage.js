import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ccimg from "../../../assets/concert.png";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../redux/apiRequest";
import { useNavigate } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import * as yup from 'yup';
import { useFormik } from 'formik';

// schema xác thực thông tin mà user điền
const validationSchema = yup.object({
    FullName: yup.string().required('Ô này không được để trống'),
    IdCard: yup.string()
        .matches(/^\d{12}$/, 'CMND/CCCD phải gồm đúng 12 chữ số')
        .required('Ô này không được để trống'),
    Email: yup.string()
        .email('Email không đúng định dạng')
        .required('Ô này không được để trống'),
    Password: yup.string()
        .min(8, 'Mật khẩu phải dài ít nhất 8 ký tự')
        .matches(/[A-Z]/, 'Mật khẩu cần ít nhất 1 ký tự viết hoa')
        .matches(/\d/, 'Mật khẩu cần ít nhất 1 chữ số')
        .matches(/[@$!%*?&]/, 'Mật khẩu cần ít nhất 1 ký tự đặc biệt')
        .required('Ô này không được để trống'),
    Phone: yup.string()
        .matches(/^(\+84\d{9}|0\d{9})$/, 'Số điện thoại không hợp lệ')
        .required('Ô này không được để trống'),
    DoB: yup.date()
        .nullable()
        .required('Ô này không được để trống')
        .test('age', 'Tuổi của bạn phải trên 12 tuổi', function (value) {
            const today = new Date();
            const birthDate = new Date(value);
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();
            if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
                return age - 1 >= 12;
            }
            return age >= 12;
        }),
});

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

export default function RegisterPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            FullName: '',
            IdCard: '',
            Email: '',
            Password: '',
            Phone: '',
            Role: 0,    // mặc định 0 là role user
            Gender: 0,  // mặc định 0 là nam
            DoB: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            // Gửi dữ liệu đến backend
            registerUser(values, dispatch, navigate);
        },
    });

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
                                        <form onSubmit={formik.handleSubmit}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        required
                                                        fullWidth
                                                        label="Họ tên"
                                                        size="small"
                                                        name="FullName"     // name có vai trò như key
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.FullName}
                                                        error={formik.touched.FullName && Boolean(formik.errors.FullName)}
                                                        helperText={formik.touched.FullName && formik.errors.FullName}
                                                    />

                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        required
                                                        fullWidth
                                                        label="CMND/CCCD"
                                                        size="small"
                                                        name="IdCard"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.IdCard}
                                                        error={formik.touched.IdCard && Boolean(formik.errors.IdCard)}
                                                        helperText={formik.touched.IdCard && formik.errors.IdCard}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        required
                                                        fullWidth
                                                        label="Email"
                                                        type="email"
                                                        name="Email"
                                                        size="small"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.Email}
                                                        error={formik.touched.Email && Boolean(formik.errors.Email)}
                                                        helperText={formik.touched.Email && formik.errors.Email}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        required
                                                        fullWidth
                                                        label="Mật khẩu"
                                                        type="password"
                                                        name="Password"
                                                        size="small"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.Password}
                                                        error={formik.touched.Password && Boolean(formik.errors.Password)}
                                                        helperText={formik.touched.Password && formik.errors.Password}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        required
                                                        fullWidth
                                                        label="Điện thoại"
                                                        size="small"
                                                        name="Phone"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.Phone}
                                                        error={formik.touched.Phone && Boolean(formik.errors.Phone)}
                                                        helperText={formik.touched.Phone && formik.errors.Phone}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <FormControl fullWidth>
                                                        <InputLabel required id="demo-simple-select-label">
                                                            Giới tính
                                                        </InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            name="Gender"
                                                            label="Giới tính"
                                                            size="small"
                                                            value={formik.values.Gender}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                        >
                                                            <MenuItem value={0}>Nam</MenuItem>
                                                            <MenuItem value={1}>Nữ</MenuItem>
                                                            <MenuItem value={2}>Khác</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        required
                                                        fullWidth
                                                        label="Ngày sinh"
                                                        type="date"
                                                        name="DoB"
                                                        size="small"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.DoB}
                                                        InputLabelProps={{ shrink: true, }}
                                                        error={formik.touched.DoB && Boolean(formik.errors.DoB)}
                                                        helperText={formik.touched.DoB && formik.errors.DoB}
                                                    />
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

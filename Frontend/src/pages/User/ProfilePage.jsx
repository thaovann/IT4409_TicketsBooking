//trang hồ sơ người dùng
import React, { useState } from "react";
import { Avatar, Alert, Box, Button, IconButton, Radio, RadioGroup, TextField, Typography, Snackbar } from "@mui/material";
import { CheckCircle, Close } from "@mui/icons-material";
import avatarUser from '../../assets/img/avatar-clone-user.jpg';
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../redux/apiRequest";

function ProfilePage() {
    const user = useSelector((state) => state.auth.login.currentUser);
    const navigate = useNavigate();
    const [FullName, setFullName] = useState(user.body?._doc?.FullName || "");
    const [Phone, setPhone] = useState(user.body?._doc?.Phone || "");
    const [DoB, setDob] = useState(user.body?._doc?.DoB?.split('T')[0] || ""); // Lấy phần ngày
    const [Gender, setGender] = useState(user.body?._doc?.Gender || 0);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);

    const handleUpdate = async () => {
        const updatedData = {
            FullName: FullName,
            Phone: Phone,
            DoB: DoB,
            Gender: Gender, // Truyền gender dưới dạng số
        };

        const res = await updateUser(user.body?._doc?.UserId, updatedData);
        console.log(res);
        const validateErr = res.message;
        if (FullName !== "" || Phone !== "") {
            setError("Các ô không được trống");
            setOpen(true);
        }
        else if (validateErr === "Lỗi xác thực: Thiếu hoặc thuộc tính không hợp lệ: Người dùng phải ít nhất 12 tuổi") {
            setError("Bạn phải ít nhất 12 tuổi");
            setOpen(true);
        } else {
            Swal.fire({
                title: "Thành công!",
                text: "Thông tin của bạn đã được cập nhật.",
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "#3085d6",
            })
        }
    };

    const handleClose = () => {
        navigate("/");
    };

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    bgcolor: "#f5f5f5", // background color for the page
                }}
            >
                <Box sx={{ width: 350, p: 3, bgcolor: "white", borderRadius: 2, boxShadow: 3, position: "relative" }}>
                    {/* Close Button */}
                    <IconButton
                        onClick={handleClose}
                        sx={{ position: "absolute", top: 8, right: 8 }}
                    >
                        <Close />
                    </IconButton>
                    {/* Profile Picture */}
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                        <Avatar
                            alt="User Profile"
                            src={avatarUser}
                            sx={{ width: 80, height: 80 }}
                        />
                    </Box>

                    {/* Description */}
                    <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 3 }}>
                        Cung cấp thông tin chính xác sẽ hỗ trợ bạn trong quá trình mua vé hoặc khi cần xác thực vé
                    </Typography>

                    {/* Form Fields */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Họ và tên</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            value={FullName}
                            onChange={(e) => setFullName(e.target.value)} />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Số điện thoại</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            value={Phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Email</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            placeholder={user.body?._doc?.Email}
                            InputProps={{
                                readOnly: true,
                                endAdornment: (
                                    <IconButton size="small" disabled>
                                        <CheckCircle color="success" />
                                    </IconButton>
                                ),
                            }}
                        />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Ngày sinh</Typography>
                        <TextField
                            fullWidth
                            type="date"
                            variant="outlined"
                            size="small"
                            value={DoB}
                            onChange={(e) => setDob(e.target.value)} />
                    </Box>

                    {/* Gender Selection */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1">Giới tính</Typography>
                        <RadioGroup
                            row
                            value={Gender.toString()} // Chuyển thành string để dùng với RadioGroup
                            onChange={(e) => setGender(Number(e.target.value))}
                        >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Radio value="0" />
                                <Typography>Nam</Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                                <Radio value="1" />
                                <Typography>Nữ</Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                                <Radio value="2" />
                                <Typography>Khác</Typography>
                            </Box>
                        </RadioGroup>
                    </Box>

                    {/* Submit Button */}
                    <Button variant="contained" onClick={handleUpdate} fullWidth sx={{ borderRadius: 2, color: "black", backgroundColor: "#FFB200" }}>
                        Lưu thông tin
                    </Button>
                </Box>
            </Box>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={open} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </>
    );
}

export default ProfilePage;

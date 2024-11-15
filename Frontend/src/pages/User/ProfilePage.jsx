//trang hồ sơ người dùng
import React from "react";
import { Avatar, Box, Button, IconButton, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { CheckCircle, Close, PhotoCamera } from "@mui/icons-material";
import avatarUser from '../../assets/img/avatar-clone-user.jpg';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
    const user = useSelector((state) => state.auth.login.currentUser);
    const navigate = useNavigate();

    const handleClose = () => {
        navigate("/");
    };
    return (
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
                    <IconButton
                        aria-label="upload picture"
                        component="label"
                        sx={{
                            position: "relative",
                            top: 22,
                            left: -20,
                            bgcolor: "white",
                            //border: "1px solid #ccc",
                            borderRadius: "50%",
                            p: 1
                        }}
                    >
                        <PhotoCamera color="success" />
                        <input hidden accept="image/*" type="file" />
                    </IconButton>
                </Box>

                {/* Description */}
                <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 3 }}>
                    Cung cấp thông tin chính xác sẽ hỗ trợ bạn trong quá trình mua vé, hoặc khi cần xác thực vé
                </Typography>

                {/* Form Fields */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">Họ và tên</Typography>
                    <TextField fullWidth variant="outlined" size="small" placeholder={user.body?._doc?.FullName} sx={{ mt: 1 }} />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">Số điện thoại</Typography>
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                        {/* <TextField
                        select
                        size="small"
                        variant="outlined"
                        value="+84"
                        sx={{ width: "25%" }}
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value="+84">+84</option>
                    </TextField> */}
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            placeholder={user.body?._doc?.Phone}
                            InputProps={{
                                endAdornment: (
                                    <IconButton size="small">
                                        <Close color="error" />
                                    </IconButton>
                                ),
                            }}
                        />
                    </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">Email</Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        placeholder={user.body?._doc?.Email}
                        InputProps={{
                            endAdornment: (
                                <IconButton size="small" disabled>
                                    <CheckCircle color="success" />
                                </IconButton>
                            ),
                        }}
                        sx={{ mt: 1 }}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">Ngày sinh</Typography>
                    <TextField fullWidth variant="outlined" size="small" placeholder={user.body?._doc?.DoB} sx={{ mt: 1 }} />
                </Box>

                {/* Gender Selection */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1">Giới tính</Typography>
                    <RadioGroup row defaultValue="Nam" sx={{ mt: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Radio value="Nam" color="#ffea99" />
                            <Typography>Nam</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                            <Radio value="Nữ" color="#ffea99" />
                            <Typography>Nữ</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                            <Radio value="Khác" color="#ffea99" />
                            <Typography>Khác</Typography>
                        </Box>
                    </RadioGroup>
                </Box>

                {/* Submit Button */}
                <Button variant="contained" fullWidth sx={{ borderRadius: 2, color: "black", backgroundColor: "#ffea99" }}>
                    Hoàn thành
                </Button>
            </Box>
        </Box>
    );
}

export default ProfilePage;

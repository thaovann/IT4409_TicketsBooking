// nav bar cho trang Organizer Center
import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { logout } from '../../../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";

const settings = ['Trang cá nhân', 'Đăng xuất'];

const AppBar = styled(MuiAppBar, {
})(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
}));

function NavBar() {
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    // xu ly menu
    const handleMenuAction = (setting) => {
        handleCloseUserMenu(); // Đóng menu trước
        if (setting === "Trang cá nhân") {
            navigate("/profile");
        } else if (setting === "Đăng xuất") {
            dispatch(logout());
            navigate("/login");
        }
    };


    return (
        <AppBar position="fixed">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <BusinessCenterIcon sx={{ display: { xs: 'none', md: 'flex', color: "#FFB200" }, mr: 1 }} fontSize='large' />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.2rem',
                            color: '#FFB200',
                            textDecoration: 'none',
                            lineHeight: 1,  // giảm khoảng cách giữa các dòng
                        }}
                    >
                        ORGARNIZER<br />CENTER
                    </Typography>

                    <BusinessCenterIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} fontSize='large' />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: '#FFB200',
                            textDecoration: 'none',
                            lineHeight: 1,
                        }}
                    >
                        ORGARNIZER<br />CENTER
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {/* có thể điền tên tab vào đây */}
                    </Box>
                    <Box sx={{ flexGrow: 0, overflow: "hidden" }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="User" src="/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                            disableScrollLock   //bỏ lock thanh cuộn để tránh bị co trang
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={() => handleMenuAction(setting)}>
                                    <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default NavBar;

// Sidebar cho trang Organizer Center
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EventIcon from '@mui/icons-material/Event';
import CreateIcon from '@mui/icons-material/Create';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

export default function SideNav() {
    const navigate = useNavigate();
    const location = useLocation();

    // Hàm kiểm tra nếu tab đang được chọn
    const isActive = (path) => location.pathname === path;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        <ListItem
                            disablePadding
                            sx={{
                                display: 'block',
                            }}
                            onClick={() => navigate("/organizer/events")}
                        >
                            <ListItemButton selected={isActive("/organizer/events")} sx={{ '&.Mui-selected': { backgroundColor: 'rgba(0, 0, 0, 0.08)' }, '&.Mui-selected:hover': { backgroundColor: 'rgba(0, 0, 0, 0.12)' } }}>
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <EventIcon />
                                </ListItemIcon>
                                <ListItemText primary="Sự kiện đã tạo" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem
                            disablePadding
                            sx={{
                                display: 'block',
                            }}
                            onClick={() => navigate("/organizer/create-event")}>
                            <ListItemButton selected={isActive("/organizer/create-event")} sx={{ '&.Mui-selected': { backgroundColor: 'rgba(0, 0, 0, 0.08)' }, '&.Mui-selected:hover': { backgroundColor: 'rgba(0, 0, 0, 0.12)' } }}>
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <CreateIcon />
                                </ListItemIcon>
                                <ListItemText primary="Tạo sự kiện" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                    <Divider />
                </Box>
            </Drawer>
        </Box>
    );
}

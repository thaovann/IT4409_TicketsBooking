import { Outlet, Link } from 'react-router-dom';
import { Box, List, ListItem, ListItemText, AppBar, Toolbar, Typography } from '@mui/material';

export default function AdminLayout() {
    return (
        <Box sx={{ display: 'flex' }}>
            {/* Sidebar */}
            <Box sx={{ width: 250, height: '100vh', backgroundColor: '#f4f4f4' }}>
                <List>
                    <ListItem button component={Link} to="/admin">
                        <ListItemText primary="Dashboard" />
                    </ListItem>

                    <ListItem button component={Link} to="/admin/events">
                        <ListItemText primary="Manage Events" />
                    </ListItem>

                    <ListItem button component={Link} to="/admin/orders">
                        <ListItemText primary="Manage Orders" />
                    </ListItem>

                    <ListItem button component={Link} to="/admin/users">
                        <ListItemText primary="Manage Users" />
                    </ListItem>
                </List>
            </Box>

            {/* noi dung chinh */}
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <AppBar position='static'>
                    <Toolbar>
                        <Typography variant='h6'>Admin Panel</Typography>
                    </Toolbar>
                </AppBar>
                <Outlet />
            </Box>
        </Box>
    );
}
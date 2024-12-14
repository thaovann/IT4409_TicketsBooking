import { Avatar, Box, Card, CardContent, Typography } from '@mui/material';
import SideNav from './components/SideNav';
import AdminNavbar from './components/AdminNavbar';
import { useSelector } from "react-redux";

const DashBoard = () => {
    const user = useSelector((state) => state.auth.login.currentUser);
    const username = user.body?._doc?.FullName;
    return (
        <>
            <AdminNavbar />
            <Box height={60} />
            <Box sx={{ display: "flex" }}>
                <SideNav />
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh' }}>
                    <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4, width: '300px', height: '400px' }}>
                        <Avatar
                            alt={username}
                            src='https://example.com/avatar.jpg'
                            sx={{ width: 100, height: 100, marginRight: 2 }}
                        />
                        <CardContent>
                            <Typography variant="h4">{username}</Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </>
    )
}

export default DashBoard;
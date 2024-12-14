import React, { useEffect, useState } from 'react';
import { Button, Box, InputAdornment, Table, TableBody, TableCell, TableHead, TableRow, Container, Grid, Pagination, TextField, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import { getAllUsers, deleteUserById } from '../../redux/apiRequest';
import SideNav from './components/SideNav';
import AdminNavbar from './components/AdminNavbar';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            const response = await getAllUsers();
            if (response) {
                const userDocs = response.data.body
                    .map(user => user._doc)
                    .filter(user => user.Role === 0);
                setUsers(userDocs);
                setFilteredUsers(userDocs);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (UserId) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (confirm.isConfirmed) {
            try {
                await deleteUserById(UserId);
                const updatedUsers = users.filter(user => user.UserId !== UserId);
                const updatedFilteredUsers = filteredUsers.filter(user => user.UserId !== UserId);

                setUsers(updatedUsers); // Cập nhật danh sách users
                setFilteredUsers(updatedFilteredUsers); // Cập nhật danh sách đang hiển thị

                Swal.fire('Deleted!', 'The user has been deleted.', 'success');
            } catch (error) {
                Swal.fire('Error!', 'Failed to delete the user.', 'error');
            }
        }
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
        const filtered = users.filter(user =>
            user.UserId.toString().includes(value) ||
            user.Email.toLowerCase().includes(value)
        );
        setFilteredUsers(filtered);
    };

    const displayedUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

    return (
        <>
            <AdminNavbar />
            <Box height={60} />
            <Box sx={{ display: "flex" }}>
                <SideNav />
                <Container sx={{ p: 3, height: '100vh' }}>
                    {/* <Grid container spacing={2}> */}
                    <Typography variant="h4" gutterBottom>Quản lý người dùng</Typography>
                    <TextField
                        //label="Tìm kiếm theo ID hoặc Email"
                        placeholder="Tìm kiếm theo ID hoặc Email"
                        variant="outlined"
                        fullWidth
                        value={searchTerm}
                        onChange={handleSearch}
                        size='small'
                        sx={{ marginBottom: '1rem' }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Grid item xs={9}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Họ tên</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>CCCD/CMND</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Điện thoại</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Giới tính</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Ngày sinh</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Hành động</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {displayedUsers.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell>{user.UserId}</TableCell>
                                        <TableCell>{user.FullName}</TableCell>
                                        <TableCell>{user.IdCard}</TableCell>
                                        <TableCell>{user.Email}</TableCell>
                                        <TableCell>{user.Phone}</TableCell>
                                        <TableCell>{user.Gender === 0 ? "Male" : "Female"}</TableCell>
                                        <TableCell>{new Date(user.DoB).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Button
                                                color="error"
                                                onClick={() => handleDelete(user.UserId)}>
                                                <DeleteIcon />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <Pagination
                            count={Math.ceil(filteredUsers.length / usersPerPage)}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                            sx={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}
                        />
                    </Grid>
                    {/* </Grid> */}
                </Container>
            </Box>
        </>
    );
}

export default ManageUsers;

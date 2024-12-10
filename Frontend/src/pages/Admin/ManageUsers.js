import React, { useEffect, useState } from 'react';
import { Button, Box, Table, TableBody, TableCell, TableHead, TableRow, Container, Grid, Pagination } from '@mui/material';
import Swal from 'sweetalert2';
import { getAllUsers, deleteUserById } from '../../redux/apiRequest';
import SideNav from './components/SideNav';
import AdminNavbar from './components/AdminNavbar';

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 7;

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

    const displayedUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

    return (
        <>
            <AdminNavbar />
            <Box height={60} />
            <Box sx={{ display: "flex" }}>
                <SideNav />
                <Container sx={{ padding: '2rem', height: '100vh' }}>
                    {/* <Grid container spacing={2}> */}
                    <Grid item xs={9}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Full Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>ID Card</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Gender</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Date of Birth</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {displayedUsers.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell>{user.FullName}</TableCell>
                                        <TableCell>{user.IdCard}</TableCell>
                                        <TableCell>{user.Email}</TableCell>
                                        <TableCell>{user.Phone}</TableCell>
                                        <TableCell>{user.Role === 0 ? "User" : "Admin"}</TableCell>
                                        <TableCell>{user.Gender === 0 ? "Male" : "Female"}</TableCell>
                                        <TableCell>{new Date(user.DoB).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Button
                                                color="error"
                                                onClick={() => handleDelete(user.UserId)}
                                                sx={{ backgroundColor: '#ffea99', borderRadius: '8px' }}>
                                                Delete
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

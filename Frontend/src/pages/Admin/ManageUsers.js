import React, { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Container, Grid, Pagination, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Swal from 'sweetalert2';
import { getAllUsers, deleteUserById } from '../../redux/apiRequest';

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [roleFilter, setRoleFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            const response = await getAllUsers();
            if (response) {
                const userDocs = response.data.body.map(user => user._doc);
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
            await deleteUserById(UserId);
            const updatedUsers = users.filter(user => user.UserId !== UserId);
            setUsers(updatedUsers);
            applyFilter(roleFilter, updatedUsers);
            Swal.fire('Deleted!', 'The user has been deleted.', 'success');
        }
    };

    const applyFilter = (role, userList = users) => {
        if (role === 'all') {
            setFilteredUsers(userList);
        } else {
            setFilteredUsers(userList.filter(user => user.Role === (role === 'user' ? 0 : 1)));
        }
    };

    const handleRoleFilterChange = (event) => {
        const selectedRole = event.target.value;
        setRoleFilter(selectedRole);
        applyFilter(selectedRole);
        setCurrentPage(1);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const displayedUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

    return (
        <Container sx={{ padding: '2rem', height: '100vh' }}>
            {/* <Grid container spacing={2}> */}
            <Grid item xs={9}>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Filter by Role</InputLabel>
                    <Select
                        value={roleFilter}
                        label="Filter by Role"
                        onChange={handleRoleFilterChange}
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                </FormControl>

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
    );
}

export default ManageUsers;

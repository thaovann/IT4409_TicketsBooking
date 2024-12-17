import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Pagination,
    TextField,
    Typography
} from '@mui/material';
import Swal from 'sweetalert2';
import { getAllOrders, deleteOrders } from '../../redux/apiRequest';
import SideNav from './components/SideNav';
import AdminNavbar from './components/AdminNavbar';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [sortDirection, setSortDirection] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(5); // Số lượng đơn hàng trên mỗi trang
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getAllOrders();
                setOrders(response.body);
            } catch (error) {
                console.error('Failed to fetch all orders:', error);
            }
        };

        fetchOrders();
    }, []);

    const handleDelete = async (orderId) => {
        const confirm = await Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: 'Hành động này sẽ xóa đơn hàng khỏi danh sách!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        });

        if (confirm.isConfirmed) {
            try {
                await deleteOrders(orderId);
                setOrders(orders.filter(order => order._id !== orderId));
                Swal.fire('Đã xóa!', 'Đơn hàng đã được xóa.', 'success');
            } catch (error) {
                Swal.fire('Lỗi!', 'Không thể xóa đơn hàng.', 'error');
            }
        }
    };

    const handleDetails = (order) => {
        setSelectedOrder(order);
        setOpenModal(true);
    };

    const closeModal = () => {
        setSelectedOrder(null);
        setOpenModal(false);
    };

    const handleSort = () => {
        const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        setSortDirection(newDirection);
        setOrders((prevOrders) => {
            return [...prevOrders].sort((a, b) => {
                const dateA = new Date(a.orderDate);
                const dateB = new Date(b.orderDate);
                return newDirection === 'asc' ? dateA - dateB : dateB - dateA;
            });
        });
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset pagination when filtering
    };

    // Filter orders based on searchQuery
    const filteredOrders = orders.filter((order) =>
        order._id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };


    return (
        <>
            <AdminNavbar />
            <Box height={60} />
            <Box sx={{ display: "flex" }}>
                <SideNav />
                <Box sx={{ padding: 3, width: "100%" }}>
                    <Typography variant="h4" gutterBottom>Quản lý Đơn đặt vé</Typography>
                    {/* Search Bar */}
                    <Box mb={2}>
                        <TextField
                            size='small'
                            placeholder="Tìm kiếm theo Mã đơn hàng"
                            variant="outlined"
                            fullWidth
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </Box>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mã đơn hàng</TableCell>
                                    <TableCell>Mã người dùng</TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={true}
                                            direction={sortDirection}
                                            onClick={handleSort}
                                        >
                                            Ngày đặt
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell>Hành động</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentOrders.map((order) => (
                                    <TableRow key={order._id}>
                                        <TableCell>{order._id}</TableCell>
                                        <TableCell>{order.userId}</TableCell>
                                        <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{order.state}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => handleDetails(order)}
                                            >
                                                Chi tiết
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                onClick={() => handleDelete(order._id)}
                                                style={{ marginLeft: 8 }}
                                            >
                                                Xóa
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box display="flex" justifyContent="center" marginTop={2}>
                        <Pagination
                            count={Math.ceil(filteredOrders.length / ordersPerPage)}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>

                    {/* Order Details Modal */}
                    {selectedOrder && (
                        <Dialog open={openModal} onClose={closeModal} fullWidth maxWidth="sm">
                            <DialogTitle>Chi tiết đơn đặt vé</DialogTitle>
                            <DialogContent>
                                <Typography variant="body1">Mã đơn hàng: {selectedOrder._id}</Typography>
                                <Typography variant="body1">Ngày đặt hàng: {new Date(selectedOrder.orderDate).toLocaleDateString()}</Typography>
                                <Typography variant="body1">Thành tiền: {selectedOrder.finalPrice} VND</Typography>
                                <Typography variant="body1">Trạng thái: {selectedOrder.state}</Typography>
                                <Typography variant="body1">Vé:</Typography>
                                <Box component="ul">
                                    {selectedOrder.tickets.map((ticket, index) => (
                                        <li key={index}>
                                            Số lượng: {ticket.quantity}, Danh mục vé:
                                            <ul>
                                                {ticket.ticketCategories.map((category, i) => (
                                                    <li key={i}>
                                                        ID hạng vé: {category.ticketCategoryId}, Chi tiết vé:
                                                        <ul>
                                                            {category.ticketDetails.map((detail, j) => (
                                                                <li key={j}>ID vé: {detail.ticketId}</li>
                                                            ))}
                                                        </ul>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    ))}
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={closeModal} color="primary">Đóng</Button>
                            </DialogActions>
                        </Dialog>
                    )}
                </Box>
            </Box>
        </>
    );
};

export default ManageOrders;

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

    return (
        <>
            <AdminNavbar />
            <Box height={60} />
            <Box sx={{ display: "flex" }}>
                <SideNav />
                <Box sx={{ padding: 3, width: "100%" }}>
                    <Typography variant="h4" gutterBottom>Quản lý Đơn đặt vé</Typography>
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
                                {orders.map((order) => (
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

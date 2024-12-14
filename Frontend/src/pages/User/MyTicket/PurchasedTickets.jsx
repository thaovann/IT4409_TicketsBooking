import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Divider,
} from "@mui/material";
import { useSelector } from "react-redux";
import { getUserOrders } from "../../../redux/apiRequest";
import Header from "../../../components/common/Header";
import Footer from "../../../components/common/Footer";

const PurchasedTickets = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null); // Lưu order được chọn để hiển thị trong modal
    const user = useSelector((state) => state.auth.login.currentUser);
    const userId = user.body?._doc?.UserId;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getUserOrders(userId);
                setOrders(response.body || []);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId]);

    const handleOpenModal = (order) => {
        setSelectedOrder(order); // Lưu thông tin order được chọn
    };

    const handleCloseModal = () => {
        setSelectedOrder(null); // Đóng modal
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh", // Đảm bảo toàn bộ chiều cao viewport
                backgroundColor: "#2c2c2c", // Màu nền tối
                color: "#f5f5f5", // Màu văn bản sáng
            }}
        >
            <Header hideNav={true} />
            <Box
                sx={{
                    p: 3,
                    mt: "95px",
                    mx: "164px",
                    flex: 1,
                }}
            >
                <Typography variant="h4" gutterBottom sx={{ color: "#e0e0e0" }}>
                    Vé đã mua
                </Typography>
                {orders.map((orderGroup, index) => (
                    <Card key={index} sx={{ mb: 3, backgroundColor: "#3a3a3a", color: "#f5f5f5", borderRadius: 3 }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom sx={{ color: "#ffffff" }}>
                                {orderGroup.eventName}
                            </Typography>
                            <Typography variant="body1" sx={{ color: "#bdbdbd" }}>
                                Thời gian: {new Date(orderGroup.event.event_startTime).toLocaleString()} -{" "}
                                {new Date(orderGroup.event.event_endTime).toLocaleString()}
                            </Typography>
                            <Divider sx={{ my: 2, borderColor: "#4a4a4a" }} />
                            {orderGroup.orders.map((order) => (
                                <Box key={order.orderId} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <Typography variant="body1" sx={{ color: "#e0e0e0" }}>
                                        Mã đơn hàng: {order.orderId} | Thành tiền: {order.finalPrice.toLocaleString()} VND
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            ml: "auto",
                                            backgroundColor: "#ff9800",
                                            color: "#2c2c2c",
                                            "&:hover": { backgroundColor: "#e68900" },
                                        }}
                                        onClick={() => handleOpenModal(order)}
                                    >
                                        Xem vé
                                    </Button>
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                ))}

                {/* Dialog for ticket details */}
                <Dialog
                    open={!!selectedOrder}
                    onClose={handleCloseModal}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{
                        sx: { backgroundColor: "#3a3a3a", color: "#f5f5f5" },
                    }}
                >
                    <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                    <DialogContent>
                        {selectedOrder && (
                            <Box>
                                <Typography variant="h6">Mã đơn hàng: {selectedOrder.orderId}</Typography>
                                <Typography variant="body1">
                                    Ngày đặt vé: {new Date(selectedOrder.orderDate).toLocaleString()}
                                </Typography>
                                <Typography variant="body1">
                                    Thành tiền: {selectedOrder.finalPrice.toLocaleString()} VND
                                </Typography>
                                <Divider sx={{ my: 2, borderColor: "#4a4a4a" }} />
                                {selectedOrder.tickets.map((ticket, ticketIndex) => (
                                    <Box key={ticketIndex} sx={{ mb: 3 }}>
                                        <Typography variant="h6">Vé #{ticketIndex + 1}</Typography>
                                        <Grid container spacing={2}>
                                            {ticket.ticketCategories.map((category) => (
                                                <Grid item xs={12} sm={6} key={category.ticketCategoryId}>
                                                    <Box>
                                                        <Typography variant="body1">Hạng vé: {category.ticketCategoryName}</Typography>
                                                        <Typography variant="body2" sx={{ color: "#bdbdbd" }}>
                                                            Giá: {category.ticketCategoryPrice.toLocaleString()} VND
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: "#bdbdbd" }}>
                                                            Số serial: {category.ticketDetails[0]?.serialNumber}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>
                                        <Divider sx={{ my: 1, borderColor: "#4a4a4a" }} />
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleCloseModal}
                            variant="contained"
                            sx={{
                                backgroundColor: "#ff5252",
                                color: "#f5f5f5",
                                "&:hover": { backgroundColor: "#e53935" },
                            }}
                        >
                            Đóng
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <Footer />
        </Box>
    );
};

export default PurchasedTickets;

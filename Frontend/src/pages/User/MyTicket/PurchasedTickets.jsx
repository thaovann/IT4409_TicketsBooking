import React, { useState } from "react";
import { Box, Tab, Tabs, Button, Typography } from "@mui/material";
import Header from "../../../components/common/Header";
import Footer from "../../../components/common/Footer";

const PurchasedTickets = () => {
    const [selectedMainTab, setSelectedMainTab] = useState(0); // Tab chính
    const [selectedSubTab, setSelectedSubTab] = useState(0); // Tab phụ

    // Dữ liệu giả lập
    const ticketsData = [
        { id: 1, status: "success", name: "Vé 1", subStatus: "upcoming" },
        { id: 2, status: "success", name: "Vé 2", subStatus: "ended" },
        { id: 3, status: "processing", name: "Vé 3" },
        { id: 4, status: "canceled", name: "Vé 4" },
    ];

    // Trạng thái tab chính
    const mainTabs = ["all", "success", "processing", "canceled"];
    const subTabs = ["upcoming", "ended"]; // Tabs phụ

    // Lọc dữ liệu cho tab chính
    const filteredTickets =
        selectedMainTab === 0
            ? ticketsData
            : ticketsData.filter((ticket) => ticket.status === mainTabs[selectedMainTab]);

    // Lọc dữ liệu cho tab phụ (chỉ khi có tabs phụ)
    const subFilteredTickets =
        selectedSubTab === 0
            ? filteredTickets.filter((ticket) => ticket.subStatus === "upcoming")
            : filteredTickets.filter((ticket) => ticket.subStatus === "ended");

    // Hàm thay đổi tab chính
    const handleMainTabChange = (event, newValue) => {
        setSelectedMainTab(newValue);
        setSelectedSubTab(0); // Reset tab phụ
    };

    // Hàm thay đổi tab phụ
    const handleSubTabChange = (event, newValue) => {
        setSelectedSubTab(newValue);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header hideNav={true} />
            <Box sx={{
                minHeight: "calc(100vh - 80px - 80px)", // Tổng chiều cao trừ Header (60px) và Footer (80px)
                marginTop: "80px", // Offset chiều cao của Header
                paddingBottom: "80px", // Offset chiều cao của Footer
                backgroundColor: "#f9f9f9", // Tùy chọn màu nền 
                textAlign: "center"
            }}>
                {/* Tabs chính */}
                <Tabs
                    value={selectedMainTab}
                    onChange={handleMainTabChange}
                    centered
                    indicatorColor="primary"
                    textColor="inherit"
                >
                    <Tab label="Tất cả" />
                    <Tab label="Thành công" />
                    <Tab label="Đang xử lý" />
                    <Tab label="Đã hủy" />
                </Tabs>

                {/* Tabs phụ chỉ hiển thị khi ở tab "Tất cả" hoặc "Thành công" */}
                {(selectedMainTab === 0 || selectedMainTab === 1) && (
                    <Tabs
                        value={selectedSubTab}
                        onChange={handleSubTabChange}
                        centered
                        sx={{ mt: 2 }}
                        indicatorColor="secondary"
                        textColor="inherit"
                    >
                        <Tab label="Sắp diễn ra" />
                        <Tab label="Đã kết thúc" />
                    </Tabs>
                )}

                {/* Nội dung vé */}
                <Box sx={{ mt: 5 }}>
                    {filteredTickets.length === 0 || (selectedMainTab !== 0 && selectedMainTab !== 1 && filteredTickets.length === 0) ? (
                        <Box>
                            <img
                                src="https://via.placeholder.com/200" // Thay bằng hình ảnh của bạn
                                alt="No Tickets"
                                style={{ marginBottom: "20px" }}
                            />
                            <Typography variant="h6" color="textSecondary">
                                Bạn chưa có vé nào
                            </Typography>
                            <Button
                                variant="contained"
                                color="success"
                                sx={{ mt: 2 }}
                                onClick={() => alert("Mua vé ngay")}
                            >
                                Mua vé ngay
                            </Button>
                        </Box>
                    ) : (
                        // Hiển thị danh sách vé khi có dữ liệu
                        (selectedMainTab === 0 || selectedMainTab === 1
                            ? subFilteredTickets
                            : filteredTickets
                        ).map((ticket) => (
                            <Box
                                key={ticket.id}
                                sx={{
                                    p: 2,
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    mb: 2,
                                    textAlign: "left",
                                }}
                            >
                                <Typography variant="h6">{ticket.name}</Typography>
                                <Typography variant="body2">Trạng thái: {ticket.status}</Typography>
                                {ticket.subStatus && (
                                    <Typography variant="body2">
                                        Trạng thái phụ: {ticket.subStatus}
                                    </Typography>
                                )}
                            </Box>
                        ))
                    )}
                </Box>
            </Box>
            <Footer />
        </Box>
    );
};

export default PurchasedTickets;

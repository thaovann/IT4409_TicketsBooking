import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Typography, Card, CardContent, CardMedia, Chip, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { getEventByUserId } from "../../../../redux/apiRequest";
import NavBar from "../components/NavBar";
import SideNav from "../components/SideNav";

const MyEvents = () => {
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // state lưu giá trị lọc tìm kiếm
    const [filterState, setFilterState] = useState(""); // state lưu giá trị lọc theo trạng thái
    const user = useSelector((state) => state.auth.login.currentUser);
    const userId = user.body?._doc?._id;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const fetchedEvents = await getEventByUserId(userId);
                setEvents(fetchedEvents);
            } catch (error) {
                console.error("Error fetching events by userId :", error);
            }
        };

        fetchEvents();
    }, [userId]);

    // lọc sự kiện
    const filteredEvents = events.filter((event) => {
        const matchedSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchedState = filterState ? event.state === filterState : true;

        return matchedSearch && matchedState;
    });

    return (
        <>
            <NavBar />
            <Box height={60} />
            <Box sx={{ display: "flex" }}>
                <SideNav />
                <Box sx={{ padding: 3, width: "100%" }}>
                    <Typography variant="h4" gutterBottom>
                        Sự kiện đã tạo
                    </Typography>
                    {/* Thanh tìm kiếm */}
                    <Box sx={{ display: "flex", gap: 2, marginBottom: 3 }}>
                        <TextField
                            sx={{ flex: 1 }}
                            label="Tìm kiếm sự kiện"
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Nhập tên sự kiện..."
                        />
                        <FormControl sx={{ minWidth: 180 }}>
                            <InputLabel>Trạng thái</InputLabel>
                            <Select
                                value={filterState}
                                onChange={(e) => setFilterState(e.target.value)}
                                label="Trạng thái"
                            >
                                <MenuItem value="">Tất cả</MenuItem>
                                <MenuItem value="approved">Đã phê duyệt</MenuItem>
                                <MenuItem value="under review">Chưa phê duyệt</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Grid container spacing={3}>
                        {filteredEvents.length > 0 ? (
                            filteredEvents.map((event) => (
                                <Grid item xs={12} sm={6} md={4} key={event._id}>
                                    <Card sx={{ maxWidth: 345, cursor: "pointer" }} onClick={() => navigate(`/organizer/events/${event._id}`)}>
                                        <CardMedia
                                            component="img"
                                            height="180"
                                            image={`http://localhost:3001/api/event/images/${event.imageBackground}`}
                                            alt={event.name}
                                        />
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                {event.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Ngày tổ chức:</strong> {event.startTime}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Địa điểm:</strong> {event.location}
                                            </Typography>
                                            <Box sx={{ marginTop: 2 }}>
                                                <Chip
                                                    label={event.state === "approved" ? "Đã phê duyệt" : "Chưa phê duyệt"}
                                                    color={event.state === "approved" ? "success" : "warning"}
                                                    size="small"
                                                />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            // thông báo khi không tìm thấy sự kiện
                            <Grid item xs={12}>
                                <Typography variant="h6" color="text.secondary" textAlign="center">
                                    Không tìm thấy kết quả
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </Box>
        </>
    )
}

export default MyEvents;
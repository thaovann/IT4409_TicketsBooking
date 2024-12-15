import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Typography, Card, CardContent, CardMedia, Chip, InputAdornment, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { getAllEvents, updateEvent } from '../../redux/apiRequest';
import SideNav from './components/SideNav';
import AdminNavbar from './components/AdminNavbar';
import SearchIcon from '@mui/icons-material/Search';

const ManageEvents = () => {
    const [events, setEvents] = useState([]);   // tất cả event
    const [searchTerm, setSearchTerm] = useState(""); // state lưu giá trị lọc tìm kiếm
    const [filterState, setFilterState] = useState(""); // state lưu giá trị lọc theo trạng thái
    const navigate = useNavigate();


    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const fetchedEvents = await getAllEvents();
                setEvents(fetchedEvents);
            } catch (error) {
                console.error("Error fetching all events :", error);
            }
        };
        fetchEvents();
    }, []);

    const handleEventState = async (eventId, newState) => {
        try {
            // Gọi API để cập nhật trạng thái
            await updateEvent(eventId, { state: newState });

            // Cập nhật danh sách sự kiện trong state
            setEvents((prevEvents) =>
                prevEvents.map((event) =>
                    event._id === eventId ? { ...event, state: newState } : event
                )
            );
        } catch (error) {
            console.error(`Error updating event state to ${newState}:`, error);
        }
    };

    const filteredEvents = events.filter((event) => {
        const matchedSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchedState = filterState ? event.state === filterState : true;
        return matchedSearch && matchedState;
    });

    return (
        <>
            <AdminNavbar />
            <Box height={60} />
            <Box sx={{ display: "flex" }}>
                <SideNav />
                <Box sx={{ padding: 3, width: "100%" }}>
                    {/* Thanh tìm kiếm */}
                    <Typography variant="h4" gutterBottom>Quản lý sự kiện</Typography>
                    <Box sx={{ display: "flex", gap: 2, marginBottom: 3 }}>
                        <TextField
                            sx={{
                                flex: 1,
                            }}
                            //label="Tìm kiếm sự kiện"
                            variant="outlined"
                            value={searchTerm}
                            size='small'
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Nhập tên sự kiện..."
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <FormControl
                            sx={{
                                minWidth: 180,
                            }}
                            size='small'>
                            <InputLabel>Trạng thái</InputLabel>
                            <Select
                                value={filterState}
                                onChange={(e) => setFilterState(e.target.value)}
                                label="Trạng thái"
                                MenuProps={{
                                    disableScrollLock: true, // Ngăn việc khóa cuộn khi menu mở
                                }}
                            >
                                <MenuItem value="">Tất cả</MenuItem>
                                <MenuItem value="approved">Đã phê duyệt</MenuItem>
                                <MenuItem value="under review">Chờ phê duyệt</MenuItem>
                                <MenuItem value="not approved">Không được duyệt</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Grid container spacing={2}>
                        {filteredEvents.length > 0 ? (
                            filteredEvents.map((event) => (
                                <Grid item xs={12} sm={6} md={4} key={event._id}>
                                    <Card
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            height: "100%",
                                            width: "100%",
                                            cursor: "pointer",
                                            '&:hover': {
                                                boxShadow: 6,
                                                transform: 'scale(1.05)',
                                                transition: 'transform 0.3s ease-in-out',
                                            }
                                        }}
                                        onClick={() => navigate(`/admin/manage-events/${event._id}`)}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="180"
                                            // image={`http://localhost:3001/api/event/images/${event.imageBackground}`}
                                            image={`https://it4409-ticketsbooking-1.onrender.com/api/event/images/${event.imageBackground}`}
                                            alt={event.name}
                                        />
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" gutterBottom>
                                                {event.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Đơn vị tổ chức:</strong> {event.organizerName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Ngày tổ chức:</strong> {new Date(event.startTime).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Địa điểm:</strong> {event.location}
                                            </Typography>
                                            <Box sx={{ marginTop: 2 }}>
                                                <Chip
                                                    label={
                                                        event.state === "approved"
                                                            ? "Đã phê duyệt"
                                                            : event.state === "not approved"
                                                                ? "Không được duyệt"
                                                                : "Chờ phê duyệt"
                                                    }
                                                    color={
                                                        event.state === "approved"
                                                            ? "success"
                                                            : event.state === "not approved"
                                                                ? "error"
                                                                : "warning"
                                                    }
                                                    size="small"
                                                />
                                                {event.state === 'under review' && (
                                                    <Box sx={{ marginTop: 2 }}>
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            size='small'
                                                            sx={{ marginRight: 1 }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEventState(event._id, "approved");
                                                            }}
                                                        >
                                                            Duyệt
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            color="error"
                                                            size='small'
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEventState(event._id, "not approved");
                                                            }} >
                                                            Không duyệt
                                                        </Button>
                                                    </Box>
                                                )}
                                            </Box>
                                            {/* buttons */}

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
    );
};

export default ManageEvents;

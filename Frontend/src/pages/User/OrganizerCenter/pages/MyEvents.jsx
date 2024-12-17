import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Grid, Typography, Card, CardContent, CardMedia, Chip, Dialog, DialogContent, DialogTitle, IconButton, TextField, FormControl, InputAdornment, InputLabel, Select, MenuItem } from "@mui/material";
import { getEventByUserId } from "../../../../redux/apiRequest";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import NavBar from "../components/NavBar";
import SideNav from "../components/SideNav";
import CreateEventForm from "../../../EventManager/CreateEventForm";
import Swal from "sweetalert2";
import { deleteEvent } from "../../../../redux/apiRequest";

const theme = createTheme({
    palette: {
        mode: "dark",
        background: {
            default: "#222831",
            paper: "#393E46"
        },
        text: {
            primary: "#EEEEEE",
            secondary: "#B0BEC5"
        },
        primary: {
            main: "#00ADB5"
        },
        secondary: {
            main: "#FF5722"
        }
    },
    typography: {
        fontFamily: "Roboto, sans-serif"
    }
});

const MyEvents = () => {
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // state lưu giá trị lọc tìm kiếm
    const [filterState, setFilterState] = useState(""); // state lưu giá trị lọc theo trạng thái
    const [openModal, setOpenModal] = useState(false); // state mở modal
    const [selectedEvent, setSelectedEvent] = useState(null); // state lưu event được chọn
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

    const handleEdit = (event) => {
        setSelectedEvent(event);
        setOpenModal(true);
    };

    // đóng modal
    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedEvent(null);
    };

    const handleDelete = async (eventId) => {
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa sự kiện này?',
            text: 'Hành động này không thể hoàn tác!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        });

        if (result.isConfirmed) {
            try {
                await deleteEvent(eventId); // Gọi API xóa sự kiện
                setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId)); // Cập nhật danh sách sự kiện
                Swal.fire('Đã xóa!', 'Sự kiện đã được xóa thành công.', 'success');
            } catch (error) {
                console.error('Lỗi khi xóa sự kiện:', error);
                Swal.fire('Lỗi!', 'Không thể xóa sự kiện. Vui lòng thử lại sau.', 'error');
            }
        }
    };


    // lọc sự kiện
    const filteredEvents = events.filter((event) => {
        const matchedSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchedState = filterState ? event.state === filterState : true;
        return matchedSearch && matchedState;
    });

    return (
        <ThemeProvider theme={theme}>
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
                            sx={{
                                flex: 1,
                            }}
                            //label="Tìm kiếm sự kiện"
                            variant="outlined"
                            size="small"
                            value={searchTerm}
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
                            size="small">
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
                                        onClick={() => navigate(`/organizer/events/${event._id}`)}
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
                                                <strong>Ngày tổ chức:</strong> {new Date(event.startTime).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}

                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Địa điểm:</strong> {event.location}
                                            </Typography>
                                            <Box sx={{ marginTop: 2, display: 'flex', alignItems: 'center' }}>
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
                                                <IconButton
                                                    color="primary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit(event);
                                                    }
                                                    }>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(event._id)
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
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
            </Box >
            {/* Modal hiển thị form sửa */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
                <DialogTitle>Chỉnh sửa sự kiện</DialogTitle>
                <DialogContent>
                    {selectedEvent && <CreateEventForm event={selectedEvent} />}
                </DialogContent>
            </Dialog>

        </ThemeProvider>
    )
}

export default MyEvents;
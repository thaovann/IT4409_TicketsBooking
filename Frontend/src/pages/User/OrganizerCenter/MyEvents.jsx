import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Grid, Typography, Card, CardContent, CardMedia, Chip } from "@mui/material";
import { getEventByUserId } from "../../../redux/apiRequest";
import NavBar from "./components/NavBar";
import SideNav from "./components/SideNav";

const MyEvents = () => {
    const [events, setEvents] = useState([]);
    const user = useSelector((state) => state.auth.login.currentUser);
    const userId = user.body?._doc?._id;

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

    return (
        <>
            <NavBar />
            <Box height={60} />
            <Box sx={{ display: "flex" }}>
                <SideNav />
                <Box sx={{ padding: 3 }}>
                    <Typography variant="h4" gutterBottom>
                        Các sự kiện của bạn
                    </Typography>
                    <Grid container spacing={3}>
                        {events.map((event) => (
                            <Grid item xs={12} sm={6} md={4} key={event._id}>
                                <Card sx={{ maxWidth: 345 }}>
                                    <CardMedia
                                        component="img"
                                        height="180"
                                        image="https://source.unsplash.com/random/345x180" // Placeholder nếu không có ảnh
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
                        ))}
                    </Grid>
                </Box>
            </Box>
        </>
    )
}

export default MyEvents;
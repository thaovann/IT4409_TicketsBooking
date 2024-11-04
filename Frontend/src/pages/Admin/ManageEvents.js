import React, { useState, useEffect } from 'react';
import { Grid, Tab, Tabs, Box, Typography, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Swal from 'sweetalert2';
import { getAllEvents, updateEvent } from '../../redux/apiRequest';
import { useDispatch } from "react-redux";

const ManageEvents = () => {
    const [selectedTab, setSelectedTab] = useState('all');
    const [events, setEvents] = useState([]);   // tất cả event
    const [filteredEvents, setFilteredEvents] = useState([]);   // event lọc theo state
    const dispatch = useDispatch();

    useEffect(() => {
        // Fetch events from backend
        const fetchEvents = async () => {
            try {
                const response = await getAllEvents();
                setEvents(response || []);
                setFilteredEvents(response || []);
            } catch (error) {
                console.error('Error fetching events:', error);
                setEvents([]); // Đảm bảo là mảng rỗng nếu có lỗi xảy ra (lỗi map)
                setFilteredEvents([]);
            }
        };

        fetchEvents();
    }, []);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
        filterEvents(newValue);
    };

    const filterEvents = (tabIndex) => {
        const statusMap = ['all', 'held', 'approved', 'under review', 'not approved', 'canceled'];
        const status = statusMap[tabIndex];
        if (status === 'all') {
            setFilteredEvents(events);
        } else {
            setFilteredEvents(events.filter(event => event.state === status));
        }
    };

    // xử lý khi nhấn duyệt
    const handleApprove = async (eventId) => {
        //dispatch(updateEventStatus({ eventId, updatedData: { status: 'approved' } }));
        try {
            // Call the API to update the event status to 'approved'
            await updateEvent(eventId, { state: 'approved' });

            setFilteredEvents((prevEvents) =>
                prevEvents.filter(event => event._id !== eventId)       // Xóa event vừa duyệt khỏi tab 'CHỜ DUYỆT'
            );

            // Thêm event đó vào tab 'ĐÃ DUYỆT', tuy nhiên cách này vẫn hiển thị event bên tab 'CHỜ DUYỆT'
            const approvedEvent = events.find(event => event._id === eventId);
            if (approvedEvent) {
                approvedEvent.state = 'approved';
                setFilteredEvents((prevEvents) => [...prevEvents, approvedEvent]);
            }
            // Thế nên xóa lần nữa
            setFilteredEvents((prevEvents) =>
                prevEvents.filter(event => event._id !== eventId)
            );
            Swal.fire({
                icon: 'success',
                title: 'Event approved successfully!',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Event approved failed!',
                text: 'Cannot approve the event',
            });
        }
    };

    return (
        <Grid>
            <Box>
                <Tabs value={selectedTab} onChange={handleTabChange}>
                    <Tab label="All" />
                    <Tab label="ĐANG DIỄN RA" />
                    <Tab label="ĐÃ DUYỆT" />
                    <Tab label="CHỜ DUYỆT" />
                    <Tab label="KHÔNG ĐƯỢC DUYỆT" />
                    <Tab label="ĐÃ HỦY" />
                </Tabs>

                <Box sx={{ padding: 2 }}>
                    <Grid container spacing={2}>
                        {filteredEvents.map(event => (
                            <Grid item xs={12} sm={6} md={4} key={event.id}>
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography variant="h6">{event.name}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant="body2">
                                            <strong>Start Time:</strong> {new Date(event.startTime).toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>End Time:</strong> {new Date(event.endTime).toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Location:</strong> {event.location}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Description:</strong> {event.description}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Organizer:</strong> {event.organizerName}
                                        </Typography>
                                        {selectedTab === 3 && (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleApprove(event._id)}
                                                sx={{ marginTop: 2 }}
                                            >
                                                Duyệt
                                            </Button>
                                        )}
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        </Grid>
    );
};

export default ManageEvents;

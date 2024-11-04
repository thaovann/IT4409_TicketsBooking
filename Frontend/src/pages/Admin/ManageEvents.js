import React, { useState, useEffect } from 'react';
import { Grid, Tab, Tabs, Box, Typography, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Swal from 'sweetalert2';
import { getAllEvents } from '../../redux/apiRequest';

const ManageEvents = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);

    useEffect(() => {
        // Fetch events from backend
        const fetchEvents = async () => {
            try {
                const response = await getAllEvents();
                setEvents(response || []); // Adjust as per your API response structure
                setFilteredEvents(response || []);
            } catch (error) {
                console.error('Error fetching events:', error);
                setEvents([]); // Đảm bảo là mảng rỗng nếu có lỗi xảy ra
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
        const statusMap = ['All', 'held', 'approved', 'under review', 'not approved', 'canceled'];
        const status = statusMap[tabIndex];
        if (status === 'All') {
            setFilteredEvents(events);
        } else {
            setFilteredEvents(events.filter(event => event.state === status));
        }
    };

    const handleApprove = (eventId) => {
        setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event._id === eventId && event.state === 'under review'
                    ? { ...event, state: 'approved' }
                    : event
            )
        );
        Swal.fire({
            icon: 'success',
            title: 'Event approved successfully!',
            showConfirmButton: false,
            timer: 1500,
        });
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

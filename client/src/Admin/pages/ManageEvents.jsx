import { useState, useEffect } from 'react';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    TextField, Grid,
    Table, TableBody, TableCell, TableHead, TableRow
} from '@mui/material';
import axios from 'axios';

export default function ManageEvents() {
    const [events, setEvents] = useState([]);
    const [open, setOpen] = useState(false);    // State to control modal visibility
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        location: '',
    });     // state for form data

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:3001/events');
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }

    // open modal
    const handleOpen = () => setOpen(true);
    // close modal
    const handleClose = () => setOpen(false);
    // handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/events', formData);
            setEvents((prevEvents) => [...prevEvents, response.data]);  // Update state with new event
            console.log('Event added:', response.data);
            handleClose();
        } catch (error) {
            console.error('Error adding event', error);
        }
    }

    return (
        <div>
            <Button variant='contained' color='primary' onClick={handleOpen} sx={{ marginBottom: 2 }}>
                Add new event
            </Button>

            {/* Modal dialog */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add new event</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Event title"
                                    name='title'
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    type='date'
                                    label="Event date"
                                    name='date'
                                    value={formData.date}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Event location"
                                    name='location'
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>

                {/* Submit and cancel */}
                <DialogActions>
                    <Button onClick={handleClose} color='secondary'>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} variant='contained' color='primary'>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {events.map((event) => (
                        <TableRow key={event.id}>
                            <TableCell>{event.title}</TableCell>
                            <TableCell>{event.date}</TableCell>
                            <TableCell>{event.location}</TableCell>
                            <TableCell>
                                <Button color='primary'>Edit</Button>
                                <Button color='error'>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
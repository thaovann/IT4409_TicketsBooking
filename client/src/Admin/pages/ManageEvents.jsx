import { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import axios from 'axios';

export default function ManageEvents() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/events').then((res) => setEvents(res.data));
    }, []);

    return (
        <div>
            <Button variant='contained' color='primary' sx={{ marginBottom: 2 }}>
                Add new event
            </Button>
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
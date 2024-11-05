import React, { useState, useEffect } from 'react';
import { TextField, Typography, Box, Card, CardContent, Button, Grid, AppBar, Toolbar, Tabs, Tab, List, ListItem, ListItemText } from '@mui/material';
import { Search } from '@mui/icons-material';
import { Link } from 'react-router-dom';

function OrganizerEvents() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Replace with your API call to fetch events
    fetch('/api/events')
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error('Error fetching events:', error));
  }, []);

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box display="flex" bgcolor="black" minHeight="100vh"> {/* Main container */}
      <Box
        width="200px" // Set the width for the left navbar
        bgcolor="#222" // Darker background for the sidebar
        color="white" // Text color for the sidebar
        p={2}
      >
        <Typography variant="h6">Quản lý sự kiện</Typography>
        <List>
          <ListItem button component={Link} to="/created-events">
            <ListItemText primary="Sự kiện đã tạo" />
          </ListItem>
          <ListItem button component={Link} to="organizer/create-event">
            <ListItemText primary="Tạo sự kiện" />
          </ListItem>
          <ListItem button component={Link} to="/organizer-terms">
            <ListItemText primary="Điều khoản của ban tổ chức" />
          </ListItem>
        </List>
      </Box>

      <Box flexGrow={1} p={3}> {/* Main content area */}
        <AppBar position="static" sx={{ bgcolor: 'black', boxShadow: 'none' }}> {/* AppBar for navigation */}
          <Toolbar>
            <Tabs textColor="inherit">
              <Tab component={Link} to="/events" label="Tất cả" />
              <Tab component={Link} to="/upcoming" label="Sắp diễn ra" />
              <Tab component={Link} to="/past" label="Đã qua" />
              <Tab component={Link} to="/pending" label="Chờ duyệt" />
              <Tab component={Link} to="/drafts" label="Nháp" />
            </Tabs>
          </Toolbar>
        </AppBar>
        
        <Typography variant="h4" gutterBottom color="white"> {/* Set text color to white */}
          Sự kiện đã tạo
        </Typography>
        <Box mb={2} display="flex" alignItems="center">
          <TextField
            variant="outlined"
            placeholder="Tìm kiếm sự kiện"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: <Search style={{ color: 'white' }} />, // Icon color
            }}
            sx={{ bgcolor: 'white' }} // Optional: Set background color of the text field to white
          />
        </Box>
        <Grid container spacing={2}>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <Card sx={{ bgcolor: 'white', border: '1px solid #ffea99' }}> {/* White card with border color #ffea99 */}
                  <CardContent>
                    <Typography variant="h6" component={Link} to={`/events/${event.id}`} color="primary">
                      {event.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {event.date}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      to={`/events/${event.id}`}
                      sx={{ mt: 2, bgcolor: '#ffea99', color: 'black' }} // Button color
                    >
                      Xem chi tiết
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Box display="flex" justifyContent="center" width="100%" mt={4}>
              <Typography variant="body1" color="white"> {/* Set color to white */}
                No data
              </Typography>
            </Box>
          )}
        </Grid>
      </Box>
    </Box>
  );
}

export default OrganizerEvents;

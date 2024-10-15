const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes.js');
// const eventRoutes = require('./routes/eventRoutes');
// const ticketRoutes = require('./routes/ticketRoutes');

const app = express();
app.use(bodyParser.json());

app.use('/api/users', userRoutes);
// app.use('/api/events', eventRoutes);
// app.use('/api/tickets', ticketRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
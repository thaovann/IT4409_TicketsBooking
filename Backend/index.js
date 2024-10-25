const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors")
require("dotenv").config();
require("dotenv").config(); 


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//middleware
app.use(express.json());

app.use(cors());

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

const eventRoutes = require("./routes/eventRoutes");
app.use("/api/event", eventRoutes);


const ticketRoutes = require("./routes/ticketRoutes");
app.use("/api/ticket", ticketRoutes);



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

const mongoose = require("mongoose");
const queryString = process.env.MONGODB_URI;

//configure mongoose
mongoose.connect(queryString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Database connected successfully!"));
mongoose.connection.on('error', (err) => {
    console.log('MongoDB connection error:', err.message);
})
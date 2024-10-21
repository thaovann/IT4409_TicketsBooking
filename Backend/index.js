const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config(); 

const app = express();
app.use(bodyParser.json());

//middleware
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

const eventRoutes = require("./routes/eventRoutes"); 
app.use("/api/events", eventRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

const mongoose = require("mongoose");
const queryString = process.env.MONGODB_URI;

//configure mongoose
mongoose.connect( queryString, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Database connected successfully!"));
mongoose.connection.on('error', (err) => {
    console.log('MongoDB connection error:', err.message);
})
const express = require("express");
const dotenv = require('dotenv');
const app = express();

//middleware
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/", authRoutes);

app.listen(3001, ()=>{
    console.log("Server is running on port 3001");
});

module.exports = app;

const mongoose = require("mongoose");
dotenv.config();
const queryString = process.env.MONGODB_URI;

//configure mongoose
mongoose.connect( queryString, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected!'));
mongoose.connection.on('error', (err) => {
    console.log('MongoDB connection error:', err.message);
})
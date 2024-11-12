const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Middleware
app.use(express.json());
app.use(cors());

// Route imports
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/user", userRoutes);

const eventRoutes = require("./routes/eventRoutes");
app.use("/api/event", eventRoutes);

const ticketRoutes = require("./routes/ticketRoutes");
app.use("/api/ticket", ticketRoutes);

const orderRoutes = require("./routes/orderRoutes");
app.use("/order", orderRoutes);

const voucherRoutes = require("./routes/voucherRoutes");
app.use("/voucher", voucherRoutes);

// Server setup
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export app for testing or other purposes
module.exports = app;

// Mongoose setup
const mongoose = require("mongoose");
const queryString = process.env.MONGODB_URI;

mongoose
  .connect(queryString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected successfully!"))
  .catch((err) => console.log("MongoDB connection error:", err.message));
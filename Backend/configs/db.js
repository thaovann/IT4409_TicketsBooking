const express = require("express");
const mongoose = require("mongoose");
const eventController = require("../controllers/eventController");
const router = express.Router();

const query =
  "mongodb+srv://lethithaovan2711:pusrmHtnJpkmMNAB@cluster0.uhim5.mongodb.net/TicketBookingService";

async function connectDB() {
  try {
    await mongoose.connect(query, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Error connecting to the database: " + error);
  }
}

connectDB();

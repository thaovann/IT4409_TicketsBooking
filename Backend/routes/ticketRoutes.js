const express = require("express");
const mongoose = require("mongoose");
const eventController = require("../controllers/ticketController");
const router = express.Router();


router.post("/create", eventController.createEvent);
router.get("/allEvents", eventController.getAllEvents);
router.get("/getEventByEventId/:eventId", eventController.getEventByEventId);
router.get("/getEventByTypeId/:typeId", eventController.getEventsByTypeId);
router.get(
  "/getEventByCustomerId/:customerId",
  eventController.getEventsByCustomerId
);
router.delete("/delete/:eventId", eventController.deleteEvent);
router.put("/update/:eventId", eventController.updateEvent);
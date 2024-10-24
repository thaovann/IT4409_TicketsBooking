const express = require("express");
const mongoose = require("mongoose"); 
const eventController = require("../controllers/eventController");
const router = express.Router();


router.post(
  "/create",
  eventController.uploadImagesAndVideo,
  eventController.createEvent
);

router.get("/allEvents", eventController.getAllEvents);
router.get("/getEventByEventId/:eventId", eventController.getEventByEventId);
router.get("/getEventByTypeId/:typeId", eventController.getEventsByTypeId);
router.get("/getEventByCustomerId/:customerId", eventController.getEventsByCustomerId);
router.delete("/delete/:eventId", eventController.deleteEvent);
router.put(
  "/update/:eventId",
  eventController.uploadImagesAndVideo, 
  eventController.updateEvent 
);

// EventTypes ----------------------------------------------------------------
router.post("/createEventType", eventController.createEventType);
router.get("/allEventTypes", eventController.getAllEventTypes);
router.get("/eventType/:eventTypeId", eventController.getEventTypeById);
router.put("/eventType/:eventTypeId", eventController.updateEventType);
router.delete("/eventType/:eventTypeId", eventController.deleteEventType);
module.exports = router;

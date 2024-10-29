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
router.get("/getEventById/:id", eventController.getEventById);
router.get("/getEventByTypeId/:eventTypeId", eventController.getEventsByTypeId);
router.get("/getEventByUserId/:userId", eventController.getEventsByCustomerId);
router.delete("/delete/:id", eventController.deleteEvent);
router.put(
  "/update/:id",
  eventController.uploadImagesAndVideo, 
  eventController.updateEvent 
);
router.get("/images/:id", eventController.getImageById);


// EventTypes ----------------------------------------------------------------
router.post("/createEventType", eventController.createEventType);
router.get("/allEventTypes", eventController.getAllEventTypes);
router.get("/eventType/:id", eventController.getEventTypeById);
router.put("/eventType/:id", eventController.updateEventType);
router.delete("/eventType/:id", eventController.deleteEventType);
module.exports = router;

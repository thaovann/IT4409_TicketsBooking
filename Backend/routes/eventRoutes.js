const express = require("express");
const eventController = require("../controllers/eventController");
const router = express.Router();

router.post("/", eventController.createEvent);
router.get("/:id", eventController.getEvent);
router.get("/", eventController.getAllEvents);
router.get("/search", eventController.searchEvents);
router.delete("/:id", eventController.deleteEvent);

module.exports = router;

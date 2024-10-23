const express = require("express");
const path = require("path");
const multer = require("multer");
const Event = require("../models/Event");
const mongoose = require("mongoose");

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

exports.createEvent = [
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        customerId,
        typeId,
        name,
        description,
        location,
        startTime,
        endTime,
        numberOfTickets,
        video,
      } = req.body;

    
      if (
        !customerId ||
        !typeId ||
        !name ||
        !location ||
        !startTime ||
        !endTime ||
        numberOfTickets === undefined
      ) {
        return res.status(400).send("Missing required fields");
      }

      const image = req.file ? req.file.path : null;

      const newEvent = new Event({
        customerId,
        typeId,
        name,
        description,
        location,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        image, 
        numberOfTickets,
        video,
        state: "under review",
        averageRating: 0,
      });

    
      await newEvent.save();
      res.status(201).json({
        message: "Event created successfully",
        event: newEvent,
      });
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).send("Error creating event");
    }
  },
];


exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).send("Error fetching events");
  }
};

exports.getEventByEventId = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findOne({ eventId: eventId });

    if (!event) {
      return res.status(404).send("Event not found");
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("Error retrieving event:", error);
    res.status(500).send("Error retrieving event");
  }
};

exports.getEventsByTypeId = async (req, res) => {
  try {
    const { typeId } = req.params;
    const events = await Event.find({ typeId: typeId });

    if (events.length === 0) {
      return res.status(404).send("No events found for the given type ID");
    }

    res.status(200).json(events);
  } catch (error) {
    console.error("Error retrieving events by type ID:", error);
    res.status(500).send("Error retrieving events");
  }
};

exports.getEventsByCustomerId = async (req, res) => {
  try {
    const { customerId } = req.params;

    const events = await Event.find({ customerId: customerId });
    if (events.length === 0) {
      return res.status(404).send("No events found for the given customer ID");
    }

    res.status(200).json(events);
  } catch (error) {
    console.error("Error retrieving events by customer ID:", error);
    res.status(500).send("Error retrieving events");
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const deletedEvent = await Event.findOneAndDelete({
      eventId: eventId,
    });

    if (!deletedEvent) {
      return res.status(404).send("Event not found");
    }

    res.status(200).send("Event deleted successfully");
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).send("Error deleting event");
  }
};

exports.getEventsByType = async (req, res) => {
  try {
    const eventType = req.query.type;
    const events = await Event.find({ type: eventType });

    if (!events || events.length === 0) {
      return res.status(404).send("No events found for this type");
    }

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events by type:", error);
    res.status(500).send("Error fetching events");
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const updatedData = req.body;
    const eventObjectId = new mongoose.Types.ObjectId(eventId);

    const updatedEvent = await Event.findOneAndUpdate(
      { eventId: eventObjectId },
      updatedData,
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).send("Event not found");
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).send("Error updating event");
  }
};

// EventType ----------------------------------------------------------------

exports.createEventType = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).send("Event Type name is required");
    }

    const newEventType = new EventType({ name });

    await newEventType.save();
    res.status(201).send("Event type created successfully");
  } catch (error) {
    console.error("Error creating event type:", error);
    res.status(500).send("Error creating event type");
  }
};

exports.getAllEventTypes = async (req, res) => {
  try {
    const eventTypes = await EventType.find();
    res.status(200).json(eventTypes);
  } catch (error) {
    console.error("Error retrieving event types:", error);
    res.status(500).send("Error retrieving event types");
  }
};

exports.getEventTypeById = async (req, res) => {
  try {
    const { eventTypeId } = req.params;
    const eventType = await EventType.findOne({ eventTypeId: eventTypeId });

    if (!eventType) {
      return res.status(404).send("Event Type not found");
    }

    res.status(200).json(eventType);
  } catch (error) {
    console.error("Error retrieving event type:", error);
    res.status(500).send("Error retrieving event type");
  }
};

exports.updateEventType = async (req, res) => {
  try {
    const { eventTypeId } = req.params;
    const updatedData = req.body;

    if (!Object.keys(updatedData).length) {
      return res.status(400).send("No data provided for update");
    }

    const updatedEventType = await EventType.findOneAndUpdate(
      { eventTypeId: eventTypeId },
      updatedData,
      { new: true }
    );

    if (!updatedEventType) {
      return res.status(404).send("Event Type not found");
    }

    res.status(200).json(updatedEventType);
  } catch (error) {
    console.error("Error updating event type:", error);
    res.status(500).send("Error updating event type");
  }
};

// Delete an EventType by eventTypeId
exports.deleteEventType = async (req, res) => {
  try {
    const { eventTypeId } = req.params; // Use 'eventTypeId' as the route parameter

    // Use findOneAndDelete to delete by a custom field
    const deletedEventType = await EventType.findOneAndDelete({
      eventTypeId: eventTypeId,
    });

    if (!deletedEventType) {
      return res.status(404).send("Event Type not found");
    }

    res.status(200).send("Event Type deleted successfully");
  } catch (error) {
    console.error("Error deleting event type:", error);
    res.status(500).send("Error deleting event type");
  }
};

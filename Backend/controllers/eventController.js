const mongoose = require("mongoose");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const path = require("path");
const sharp = require("sharp");
const EventType = require("../models/eventType");
const Event = require("../models/Event");

const mongoURI =
  "mongodb+srv://lethithaovan2711:pusrmHtnJpkmMNAB@cluster0.uhim5.mongodb.net/TicketBookingService";

const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfs;
let gridfsBucket;

conn.once("open", () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });
  gfs = gridfsBucket; 
});

const storage = new GridFsStorage({
  url: mongoURI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = Date.now() + path.extname(file.originalname);
      const fileInfo = {
        filename: filename,
        bucketName: "uploads",
      };
      resolve(fileInfo);
    });
  },
});

const upload = multer({ storage });

exports.uploadImagesAndVideo = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "background", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

const getFileBuffer = (gridfsBucket, fileId) => {
  return new Promise((resolve, reject) => {
    const readStream = gridfsBucket.openDownloadStream(fileId);
    const chunks = [];

    readStream.on("data", (chunk) => {
      chunks.push(chunk);
    });
    readStream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    readStream.on("error", (error) => {
      reject(error);
    });
  });
};

exports.createEvent = async (req, res) => {
  try {
    const {
      customerId,
      eventTypeId,
      name,
      description,
      location,
      startTime,
      endTime,
      eventTypeLocation,
      tags,
    } = req.body;

    if (
      !customerId ||
      !eventTypeId ||
      !name ||
      !startTime ||
      !endTime ||
      !eventTypeLocation ||
      !req.files.logo ||
      !req.files.background
    ) {
      return res
        .status(400)
        .json({ message: "Missing required fields in event" });
    }

    const eventType = await EventType.findOne({ eventTypeId: eventTypeId });

    if (!eventType) {
      return res.status(404).send("Event Type not found");
    }

    if (eventTypeLocation === "offline" && !location) {
      return res
        .status(400)
        .json({ message: "Location is required for offline events" });
    }

    const logoFile = req.files.logo ? req.files.logo[0] : null;
    const backgroundFile = req.files.background
      ? req.files.background[0]
      : null;
    const videoFile = req.files.video ? req.files.video[0] : null;

    const logoBuffer = await getFileBuffer(gridfsBucket, logoFile.id);
    const logoMetadata = await sharp(logoBuffer).metadata();

    if (logoMetadata.width !== 720 || logoMetadata.height !== 958) {
      return res.status(400).json({
        message: "Logo image dimensions must be 720x958",
      });
    }

    const backgroundBuffer = await getFileBuffer(
      gridfsBucket,
      backgroundFile.id
    );
    const backgroundMetadata = await sharp(backgroundBuffer).metadata();

    if (
      backgroundMetadata.width !== 1280 ||
      backgroundMetadata.height !== 720
    ) {
      return res.status(400).json({
        message: "Background image dimensions must be 1280x720",
      });
    }

    if (videoFile && videoFile.size > 50 * 1024 * 1024) {
      return res.status(400).json({ message: "Video size must be under 50MB" });
    }


    
    if (endTime <= startTime) {
      console.log("Validation Error: End time must be after start time");
      return res
        .status(400)
        .json({ message: "End time must be after the start time." });
    }
    
    const newEvent = new Event({
      customerId,
      eventTypeId,
      name,
      description,
      location: eventTypeLocation === "offline" ? location : null,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      video: videoFile ? videoFile.id : null,
      imageBackground: backgroundFile.id,
      imageLogo: logoFile.id,
      state: "under review",
      averageRating: 0,
      eventTypeLocation,
      tags,
    });

    await newEvent.save();

    res.status(201).json({
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Error creating event" });
  }
};

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
    const { eventTypeId } = req.params;
    const events = await Event.find({ eventTypeId: eventTypeId });

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
    const updatedData = { ...req.body };

    // Convert incoming string dates to Date objects
    if (updatedData.startTime) {
      updatedData.startTime = new Date(updatedData.startTime);
    }
    if (updatedData.endTime) {
      updatedData.endTime = new Date(updatedData.endTime);
    }

    if (updatedData.startTime && updatedData.endTime) {
      if (updatedData.endTime <= updatedData.startTime) {
        console.log("Validation Error: End time must be after start time");
        return res
          .status(400)
          .json({ message: "End time must be after the start time." });
      }
    }

    // Update the event in the database
    const updatedEvent = await Event.findOneAndUpdate(
      { eventId: eventId },
      updatedData,
      { new: true, runValidators: true }
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
      return res.status(400).json({ message: "Event type name is required" });
    }

    const existingEventType = await EventType.findOne({ name });
    if (existingEventType) {
      return res.status(400).json({ message: "Event type already exists" });
    }

    const newEventType = new EventType({ name });
    await newEventType.save();

    res.status(201).json({
      message: "Event type created successfully",
      eventType: newEventType,
    });
  } catch (error) {
    console.error("Error creating event type:", error);
    res.status(500).json({ message: "Error creating event type" });
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

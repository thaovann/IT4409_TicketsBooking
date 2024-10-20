const Event = require("../models/Event");
const EventType = require("../models/eventType");
const mongoose = require("mongoose"); 

// Event ----------------------------------------------------------------
exports.createEvent = async (req, res) => {
  try {
    const {
      customerId,
      typeId,
      name,
      description,
      location,
      startTime,
      endTime,
      image,
      numberOfTickets,
      video,
    } = req.body;
    if (
      !typeId ||
      !name ||
      !location ||
      !startTime ||
      !endTime ||
      !image ||
      !numberOfTickets
    ) {
      return res.status(400).send("Missing required fields");
    }

    const newEvent = new Event({
      customerId: customerId,
      typeId: typeId,
      name: name,
      description: description,
      location: location,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      image: image,
      numberOfTickets: numberOfTickets,
      video: video,
      state: "under review",
    });

    await newEvent.save();
    res.status(201).send("Event created successfully");
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).send("Error creating event");
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
    const { typeID } = req.params; 
    const events = await Event.find({ typeId: typeID }); 

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
    const { customerId } = req.params; // Get the customerId from the URL parameters

    const events = await Event.find({ customerId: customerId }); // Adjust this based on your Event schema

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
    // Update the event based on eventId
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

// Create a new EventType
exports.createEventType = async (req, res) => {
  try {
    const { eventTypeId, name } = req.body;

    // Validation to ensure required fields are present
    if (!eventTypeId || !name) {
      return res.status(400).send("Missing required fields");
    }

    const newEventType = new EventType({
      eventTypeId,
      name,
    });

    await newEventType.save();
    res.status(201).send("Event type created successfully");
  } catch (error) {
    console.error("Error creating event type:", error);
    res.status(500).send("Error creating event type");
  }
};

// Get all EventTypes
exports.getAllEventTypes = async (req, res) => {
  try {
    const eventTypes = await EventType.find();
    res.status(200).json(eventTypes);
  } catch (error) {
    console.error("Error retrieving event types:", error);
    res.status(500).send("Error retrieving event types");
  }
};

// Get EventType by ID
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

// Update an EventType
exports.updateEventType = async (req, res) => {
  try {
    const { eventTypeId } = req.params;
    const updatedData = req.body;

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

exports.deleteEventType = async (req, res) => {
  try {
    const { eventTypeId } = req.params;

    const deletedEventType = await EventType.findOneAndDelete({ eventTypeId: eventTypeId });

    if (!deletedEventType) {
      return res.status(404).send("Event Type not found");
    }

    res.status(200).send("Event Type deleted successfully");
  } catch (error) {
    console.error("Error deleting event type:", error);
    res.status(500).send("Error deleting event type");
  }
};

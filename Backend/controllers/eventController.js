const Event = require("../models/Event");

exports.createEvent = (req, res) => {
  const { name, description, location, date } = req.body;

  if (!name || !location || !date) {
    return res.status(400).send("Missing required fields");
  }

  Event.create({ name, description, location, date }, (err, result) => {
    if (err) {
      return res.status(500).send("Error creating event");
    }
    res.status(201).send("Event created successfully");
  });
};

exports.updateEvent = (req, res) => {
  const eventId = req.params.id;
  const updatedData = req.body;
  Event.update(eventId, updatedData, (err, result) => {
    if (err) return res.status(500).send("Error updating event");
    res.send("Event updated successfully");
  });
};

exports.getEvent = (req, res) => {
  const eventId = req.params.id;

  Event.findById(eventId, (err, event) => {
    if (err) {
      return res.status(500).send("Error fetching event");
    }
    if (!event) {
      return res.status(404).send("Event not found");
    }
    res.json(event);
  });
};

exports.getAllEvents = (req, res) => {
  Event.findAll((err, events) => {
    if (err) {
      return res.status(500).send("Error fetching events");
    }
    res.json(events);
  });
};

exports.searchEvents = (req, res) => {
  const keyword = req.query.keyword;

  if (!keyword) {
    return res.status(400).send("Keyword is required");
  }

  Event.searchByKeyword(keyword, (err, events) => {
    if (err) {
      return res.status(500).send("Error searching events");
    }
    res.json(events);
  });
};


exports.deleteEvent = (req, res) => {
  const eventId = req.params.id;

  Event.deleteById(eventId, (err, result) => {
    if (err) {
      return res.status(500).send("Error deleting event");
    }
    if (result.affectedRows === 0) {
      return res.status(404).send("Event not found");
    }
    res.send("Event deleted successfully");
  });
};

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventTypeSchema = new Schema({
  eventTypeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
});

module.exports = mongoose.model("EventType", EventTypeSchema, "eventTypes");

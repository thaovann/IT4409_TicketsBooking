const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventTypeSchema = new Schema(
  {
    eventTypeId: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
      unique: true,
    },
    name: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EventType", EventTypeSchema, "eventTypes");
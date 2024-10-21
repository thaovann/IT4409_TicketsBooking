const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema(
  {
    eventId: {
      type: String,
      required: true,
      default: () => new mongoose.Types.ObjectId().toString(),
      unique: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },
    typeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EventType",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    startTime: { type: Date, required: true },
    endTime: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.startTime;
        },
        message: "End time must be after the start time.",
        validator: function (value) {
          return value > new Date();
        },
        message: "End time must be in the future.",
      },
    },
    location: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    image: { type: String, trim: true },
    numberOfTickets: { type: Number, min: 0, required: true },
    video: { type: String, trim: true },
    state: {
      type: String,
      enum: ["under review", "approved","not approved", "canceled", "held", "postponed"],
      default: "under review",
    },
    tags: [{ type: String, trim: true }],
    averageRating: { type: Number, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema, "events");

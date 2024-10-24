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
    eventTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EventType",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    startTime: { type: Date, required: true },
    endTime: {
      type: Date,
      required: true,
      // validate: {
      //   validator: function (value) {
      //     return value > this.startTime;
      //   },
      //   message: "End time must be after the start time in model.",
      // },
    },
    location: {
      type: String,
      trim: true,
      required: function () {
        // Location is required only if eventType is "offline"
        return this.eventType === "offline";
      },
    },
    description: { type: String, trim: true },
    imageBackground: { type: String, trim: true },
    imageLogo: { type: String, trim: true },
    video: { type: String, trim: true },
    state: {
      type: String,
      enum: [
        "under review",
        "approved",
        "not approved",
        "canceled",
        "held",
        "postponed",
      ],
      default: "under review",
    },
    tags: [{ type: String, trim: true }],
    averageRating: { type: Number, min: 0 },
    eventTypeLocation: {
      type: String,
      enum: ["online", "offline"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema, "events");

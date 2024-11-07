const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    eventTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "eventTypes",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    startTime: { type: Date, required: true },
    endTime: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      trim: true,
      required: function () {
        return this.eventTypeLocation === "offline";
      },
    },
    description: { type: String, trim: true },

    imageBackground: { type: String, trim: true },
    imageLogo: { type: String, trim: true },
    video: { type: String, trim: true },

    organizerLogo: { type: String, trim: true },
    organizerName: { type: String, required: true, trim: true },
    organizerInfor: { type: String, required: true, trim: true },

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

    bankName: { type: String, trim: true },
    bankNumber: { type: String, trim: true },
    accountHolderName: { type: String, trim: true },

    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema, "events");

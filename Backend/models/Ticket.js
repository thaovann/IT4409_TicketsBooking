const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TicketSchema = new Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TicketCategory",
      required: true,
    },
    seat: { type: String, trim: true },
    serialNumber: { type: String, unique: true, required: true, trim: true },
    purchaseDate: { type: Date },
    state: {
      type: String,
      enum: ["available", "sold", "reserved"],
      default: "available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", TicketSchema, "tickets");
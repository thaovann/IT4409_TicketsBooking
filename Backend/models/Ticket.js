const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TicketSchema = new Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TicketCategory",
      required: true,
    },
    seat: { type: String, trim: true },
    serialNumber: { type: String, unique: true, trim: true },
    purchaseDate: {
      type: Date,
      validate: {
        validator: function (v) {
          return v <= new Date();
        },
        message: "Purchase date cannot be in the future!",
      },
    },
    state: {
      type: String,
      enum: ["available", "sold", "reserved"],
      default: "available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", TicketSchema, "tickets");
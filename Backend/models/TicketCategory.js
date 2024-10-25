const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TicketCategorySchema = new Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    free: {
      type: Boolean,
      default: false,
    },
    totalQuantity: {
      type: Number,
      required: true,
      min: 1,
    },
    minPerOrder: {
      type: Number,
      required: true,
      min: 1,
    },
    maxPerOrder: {
      type: Number,
      required: true,
      min: 1,
    },
    saleStartTime: {
      type: Date,
      required: true,
    },
    saleEndTime: {
      type: Date,
      required: true,
      // validate: {
      //   validator: async function (v) {
      //     // Fetch the event to get its start time
      //     const event = await mongoose.model("Event").findById(this.eventId);
      //     if (!event) return false; 
      //     return v > this.saleStartTime && v < event.startTime;
      //   },
      //   message:
      //     "Sale end time must be after sale start time and before event start time!",
      // },
    },

    description: {
      type: String,
      trim: true,
      maxLength: 1000,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "TicketCategory",
  TicketCategorySchema,
  "ticketCategories"
);

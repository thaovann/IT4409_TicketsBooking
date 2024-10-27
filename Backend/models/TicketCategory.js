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
    leftQuantity: {
      type: Number,
      required: true,
      min: 0, // Minimum can be 0, as the tickets can be sold out.
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
    },
    description: {
      type: String,
      trim: true,
      maxLength: 1000,
    },
  },
  { timestamps: true }
);

// Pre-save hook to set leftQuantity to totalQuantity if not provided
TicketCategorySchema.pre("save", function (next) {
  if (this.isNew && !this.leftQuantity) {
    this.leftQuantity = this.totalQuantity;
  }
  next();
});

module.exports = mongoose.model(
  "TicketCategory",
  TicketCategorySchema,
  "ticketCategories"
);

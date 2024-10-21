const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    ticketDetails: [
      {
        ticketCategoryId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "TicketCategory",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 }, // Quantity of tickets for each category
      },
    ],
    purchaseDate: { type: Date, required: true, default: Date.now },
    totalPrice: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    finalPrice: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema, "orders");

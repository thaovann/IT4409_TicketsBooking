const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  userId: {
    type: Number,
    ref: "User",
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  tickets: [{
    ticketCategories: [{
      ticketCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TicketCategory",
        required: true,
      },
      ticketDetails: [{
        ticketId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Ticket",
          required: true,
        }
      }]
    }],
    quantity: {
      type: Number,
      required: true,
      min: 1,
    }
  }],
  orderDate: { type: Date, required: true, default: Date.now },
  totalPrice: { type: Number, required: true, min: 0 },
  voucherCode: {
    type: String,
    ref: "Voucher",
  },
  finalPrice: { type: Number, required: true, min: 0 },
  state: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema, "orders");
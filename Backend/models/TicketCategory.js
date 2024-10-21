const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const TicketCategorySchema = new Schema(
  {
    name: { type: String, trim: true }, 
    expirationDate: { type: Date },
    description: { type: String, trim: true },
    effectiveDate: { type: Date },
    price: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "TicketCategory",
  TicketCategorySchema,
  "ticketCategories"
);

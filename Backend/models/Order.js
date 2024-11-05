const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// exports.findAllByUser = async (id, params = {}) => {
//   let sql = `SELECT booking_id, show_id, price, seat_row,
//   seat_number, booking_status, booking_datetime, title, poster_url,
//   start_time, date, show_type FROM ${tables.Bookings}
//   NATURAL JOIN ${tables.Shows}
//   NATURAL JOIN ${tables.Movies}
//   WHERE user_id = ?`;

//   if (!Object.keys(params).length) {
//     return await DBService.query(sql, [id]);
//   }

//   const { filterSet, filterValues } = multipleFilterSet(params);
//   sql += ` AND ${filterSet}`;

//   return await DBService.query(sql, [id, ...filterValues]);
// }

const OrderSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  tickets: [{
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    }
  }],
  orderDate: { type: Date, required: true, default: Date.now },
  totalPrice: { type: Number, required: true, min: 0 },
  voucherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Voucher",
    required: true,
  },
  finalPrice: { type: Number, required: true, min: 0 },
  state: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema, "orders");
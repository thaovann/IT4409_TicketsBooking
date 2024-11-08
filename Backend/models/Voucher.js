const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VoucherSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    discount: { type: Number, required: true, min: 0, max: 100 },
    quantity: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Voucher", VoucherSchema, "vouchers");

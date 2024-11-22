const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VoucherSchema = new Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true, min: 0 },
  minOrderValue: { type: Number, default: 0, min: 0 }, // Minimum order value for voucher application
  maxDiscountAmount: { type: Number, min: 0 }, // Maximum discount for percentage-type vouchers
  isActive: { type: Boolean, default: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  minTotalSpend: { type: Number, default: 0, min: 0 }, // Minimum total spending requirement for user
  minOrderCount: { type: Number, default: 0, min: 0 } // Minimum order count requirement for user
});

module.exports = mongoose.model("Voucher", VoucherSchema, "vouchers");
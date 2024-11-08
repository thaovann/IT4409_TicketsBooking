const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VoucherSchema = new Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  minOrderValue: { type: Number, default: 0 }, // Minimum order value for voucher application
  maxDiscountAmount: { type: Number }, // Maximum discount for percentage-type vouchers
  usageLimit: { type: Number }, // Maximum usage count
  usedCount: { type: Number, default: 0 }, // Tracks how many times it has been used
  isActive: { type: Boolean, default: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  minTotalSpend: { type: Number, default: 0 }, // Minimum total spending requirement for user
  minOrderCount: { type: Number, default: 0 } // Minimum order count requirement for user
});

module.exports = mongoose.model("Voucher", VoucherSchema, "vouchers");
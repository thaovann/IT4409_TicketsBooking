const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "successed", "failed"],
        default: "pending",
    },
    paymentMethod: {
        type: String,
        enum: ["bank_transfer", "QR_code", "credit_card"],
        required: true,
    },
    qrCodeUrl: {
        type: String,
        trim: true,
    },
    transactionId: {
        type: String,
        trim: true,
    },
    transactionDate: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

module.exports = mongoose.model("Payment", PaymentSchema, "payments");
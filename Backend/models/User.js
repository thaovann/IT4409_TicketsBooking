const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AutoIncrement = require('mongoose-sequence')(mongoose); // Import plugin

const UserSchema = new Schema({
    UserId: Number,
    FullName: String,
    IdCard: String,
    Email: String,
    Phone: String,
    Password: String,
    Role: Number,
    Gender: Number,
    DoB: Date,
    Vouchers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Voucher' }],

    totalSpend: { type: Number, default: 0 }, // Total spending by the user
    orderCount: { type: Number, default: 0 } // Number of successed orders placed by the user
});

UserSchema.plugin(AutoIncrement, { inc_field: 'UserId' });

module.exports = mongoose.model("User", UserSchema, "users");
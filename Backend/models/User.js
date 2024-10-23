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
    Events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    Vouchers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Voucher' }]
});

UserSchema.plugin(AutoIncrement, { inc_field: 'UserId' });

module.exports = mongoose.model("User", UserSchema, "users");

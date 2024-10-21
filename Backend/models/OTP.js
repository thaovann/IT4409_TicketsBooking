const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OTPSchema = new Schema({
    UserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    Email: String,
    OTP: String,
    ExpirationDatetime: Date
});

module.exports = mongoose.model('OTP', OTPSchema, 'otps');

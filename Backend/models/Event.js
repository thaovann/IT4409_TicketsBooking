const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const EventSchema = new Schema({
  eventId: {
    type: String,
    required: true,
    default: () => new mongoose.Types.ObjectId().toString(),
    unique: true, 
  },
  customerId: { type: String, ref: "customers" , required: true},
  typeId: { type: String, ref: "eventTypes" },
  name: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  location: { type: String, required: true },
  description: String,
  image: String,
  numberOfTickets: Number,
  video: String,
  state: { type: String, default: "under review" }, 
});

module.exports = mongoose.model("Event", EventSchema, "events");

const multer = require("multer");
const path = require("path");
const TicketCategory = require("../models/TicketCategory");
const Ticket = require("../models/Ticket");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

exports.createTicketCategory = [
  async (req, res) => {
    try {
      const {
        eventId,
        name,
        price,
        free,
        totalQuantity,
        minPerOrder,
        maxPerOrder,
        saleStartTime,
        saleEndTime,
        description,
      } = req.body;

      // Check for required fields
      if (
        !eventId ||
        !name ||
        price === undefined || // Check for undefined price
        !totalQuantity ||
        !minPerOrder ||
        !maxPerOrder ||
        !saleStartTime ||
        !saleEndTime
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Fetch the event using the provided eventId
      const event = await mongoose
        .model("Event")
        .findOne({ eventId: eventId });
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Validate that saleEndTime is after saleStartTime and before the event's start time
      const startTime = new Date(saleStartTime);
      const endTime = new Date(saleEndTime);
      if (endTime <= startTime || endTime >= new Date(event.startTime)) {
        return res.status(400).json({
          message:
            "Sale end time must be after sale start time and before event start time!",
        });
      }

      const existingCategory = await TicketCategory.findOne({ eventId, name });
       if (existingCategory) {
         return res
           .status(400)
           .json({
             message: "Ticket category name already exists for this event",
           });
       }

      // Create the new ticket category
      const newTicketCategory = new TicketCategory({
        eventId,
        name,
        price,
        free: free || false,
        totalQuantity,
        minPerOrder,
        maxPerOrder,
        saleStartTime: startTime,
        saleEndTime: endTime,
        description,
      });

      await newTicketCategory.save();
      res.status(201).json({
        message: "Ticket category created successfully",
        ticketCategory: newTicketCategory,
      });
    } catch (error) {
      console.error("Error creating ticket category:", error);
      res.status(500).json({
        message: "Error creating ticket category",
        error: error.message,
      });
    }
  },
];

exports.getTicketCategoriesByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }
    const ticketCategories = await TicketCategory.find({ eventId });

    if (!ticketCategories || ticketCategories.length === 0) {
      return res
        .status(404)
        .json({ message: "No ticket categories found for this event" });
    }
    res.status(200).json({
      message: "Ticket categories retrieved successfully",
      ticketCategories,
    });
  } catch (error) {
    console.error("Error retrieving ticket categories by eventId:", error);
    res.status(500).json({
      message: "Error retrieving ticket categories",
      error: error.message,
    });
  }
};

exports.getAllTicketCategories = [
  async (req, res) => {
    try {
      const ticketCategories = await TicketCategory.find().populate("eventId"); // Populate eventId if you want to get event details
      res.status(200).json({
        message: "Ticket categories retrieved successfully",
        ticketCategories,
      });
    } catch (error) {
      console.error("Error fetching ticket categories:", error);
      res
        .status(500)
        .json({
          message: "Error fetching ticket categories",
          error: error.message,
        });
    }
  },
];
exports.updateTicketCategory = [
  async (req, res) => {
    try
    {
      const { id } = req.params;
      const updatedData = req.body;

      const updatedTicketCategory = await TicketCategory.findByIdAndUpdate(id, updatedData, {
        new: true, 
        runValidators: true, 
      });

      if (!updatedTicketCategory)
      {
        return res.status(404).json({ message: 'Ticket category not found' });
      }

      res.status(200).json({
        message: 'Ticket category updated successfully',
        ticketCategory: updatedTicketCategory,
      });
    } catch (error)
    {
      console.error('Error updating ticket category:', error);
      res.status(500).json({ message: 'Error updating ticket category', error: error.message });
    }
  },
];


exports.deleteTicketCategory = [
  async(req, res) => {
    try {
      const { id } = req.params;

      const deletedTicketCategory = await TicketCategory.findByIdAndDelete(id);

      if(!deletedTicketCategory) {
        return res.status(404).json({ message: 'Ticket category not found' });
      }

    res.status(200).json({
        message: 'Ticket category deleted successfully',
        ticketCategory: deletedTicketCategory,
      });
    } catch(error) {
      console.error('Error deleting ticket category:', error);
      res.status(500).json({ message: 'Error deleting ticket category', error: error.message });
    }
  }
];



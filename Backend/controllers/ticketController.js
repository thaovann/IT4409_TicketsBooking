const express = require("express");
const router = express.Router();
const TicketCategory = require("./TicketCategory"); // Adjust the path as necessary
const Ticket = require("./Ticket"); // Your Ticket model
const Event = require("./Event"); // Your Event model

exports.createTicketCategory = async (req, res) => {
  try {
    const {
      eventId,
      name,
      price,
      totalQuantity,
      minPerOrder,
      maxPerOrder,
      saleStartTime,
      saleEndTime,
      description,
      image,
    } = req.body;

    // Validate that the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(400).send("Event not found!");
    }

    // Create a new TicketCategory
    const newTicketCategory = new TicketCategory({
      eventId,
      name,
      price,
      totalQuantity,
      minPerOrder,
      maxPerOrder,
      saleStartTime,
      saleEndTime,
      description,
      image,
    });

    // Save the TicketCategory to the database
    await newTicketCategory.save();

    // Generate and save tickets
    const tickets = [];
    for (let i = 0; i < totalQuantity; i++) {
      const ticket = new Ticket({
        categoryId: newTicketCategory._id,
        seat: null, // You can assign seats here if needed
        serialNumber: `${newTicketCategory._id}-${i + 1}`, // Generate a unique serial number
        purchaseDate: null, // Set this when the ticket is actually purchased
        state: "available",
      });
      tickets.push(ticket);
    }

    // Save all tickets to the database
    await Ticket.insertMany(tickets);

    res.status(201).send({
      message: "Ticket category and tickets created successfully!",
      ticketCategory: newTicketCategory,
      tickets: tickets.length,
    });
  } catch (error) {
    console.error("Error creating ticket category and tickets:", error);
    res.status(500).send("Internal server error.");
  }
};

// Example route for creating ticket category
router.post("/ticket-category", exports.createTicketCategory);

module.exports = router;

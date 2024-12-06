const express = require("express");
const ticketController = require("../controllers/ticketController");
const router = express.Router();

router.post("/createTicketCategory", ticketController.createTicketCategory);
router.get("/getTicketCategoriesByEvent/:eventId", ticketController.getTicketCategoriesByEvent);
router.get("/getAllTicketCategories", ticketController.getAllTicketCategories);
router.put("/updateTicketCategory/:id", ticketController.updateTicketCategory);
router.delete(
  "/deleteTicketCategory/:categoryId",
  ticketController.deleteTicketCategory
);
router.get(
  "/getAllTicketsByCategory/:ticketCategoryId",
  ticketController.getAllTicketsByCategory
);

router.get("/getAvailableTicket/:ticketCategoryId",ticketController.getAvailableTicket)

module.exports = router;

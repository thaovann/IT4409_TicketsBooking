const multer = require("multer");
const path = require("path");
const TicketCategory = require("../models/TicketCategory");
const Ticket = require("../models/Ticket");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/tickets/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

exports.createTicketCategory = [
  upload.single("image"),
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
        !price ||
        !totalQuantity ||
        !minPerOrder ||
        !maxPerOrder ||
        !saleStartTime ||
        !saleEndTime
      ) {
        return res.status(400).send("Missing required fields for ticket category");
      }

      // Get the image path if an image was uploaded
      const image = req.file ? req.file.path : null;

      // Create a new ticket category with the provided details
      const newTicketCategory = new TicketCategory({
        eventId,
        name,
        price,
        free: free || false,
        totalQuantity,
        minPerOrder,
        maxPerOrder,
        saleStartTime: new Date(saleStartTime),
        saleEndTime: new Date(saleEndTime),
        description,
        image,
      });

      await newTicketCategory.save();
      res.status(201).json({
        message: "Ticket category created successfully",
        ticketCategory: newTicketCategory,
      });
    } catch (error) {
      console.error("Error creating ticket category:", error);
      res.status(500).send("Error creating ticket category");
    }
  },
];

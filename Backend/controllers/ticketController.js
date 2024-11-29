const multer = require("multer");
const path = require("path");
const TicketCategory = require("../models/TicketCategory");
const Ticket = require("../models/Ticket");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

exports.createTicketCategory = [
    async(req, res) => {
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
            if (!eventId ||
                !name ||
                price === undefined || // Check for undefined price
                !totalQuantity ||
                !minPerOrder ||
                !maxPerOrder ||
                !saleStartTime ||
                !saleEndTime
            ) {
                return res.status(400).json({ message: "Thiếu các trường bắt buộc" });
            }

            // Fetch the event using the provided eventId
            const event = await mongoose.model("Event").findById(eventId);
            if (!event) {
                return res.status(404).json({ message: "Không tìm thấy sự kiện" });
            }

            // Validate that saleEndTime is after saleStartTime and before the event's start time
            const startTime = new Date(saleStartTime);
            const endTime = new Date(saleEndTime);
            if (endTime <= startTime || endTime >= new Date(event.startTime)) {
                return res.status(400).json({
                    message: "Thời gian kết thúc bán vé phải sau thời gian bắt đầu bán vé và trước thời gian bắt đầu sự kiện!",
                });
            }

            const existingCategory = await TicketCategory.findOne({ eventId, name });
            if (existingCategory) {
                return res.status(400).json({
                    message: "Tên Ticket category đã tồn tại cho sự kiện này",
                });
            }

            const leftQuantity = totalQuantity;

            // Create the new ticket category
            const newTicketCategory = new TicketCategory({
                eventId,
                name,
                price,
                free: free || false,
                totalQuantity,
                leftQuantity,
                minPerOrder,
                maxPerOrder,
                saleStartTime: startTime,
                saleEndTime: endTime,
                description,
            });

            await newTicketCategory.save();

            // Create tickets based on totalQuantity
            const tickets = [];
            for (let i = 1; i <= totalQuantity; i++) {
                const ticket = {
                    categoryId: newTicketCategory._id,
                    serialNumber: `${newTicketCategory._id}-${i}`, // Create a unique serial number for each ticket
                    state: "available",
                };
                tickets.push(ticket);
            }

            // Save all tickets to the database
            await Ticket.insertMany(tickets);

            res.status(201).json({
                message: "Ticket category và tickets đã tạo thành công",
                ticketCategory: newTicketCategory,
            });
        } catch (error) {
            console.error("Lỗi khi tạo ticket category:", error);
            res.status(500).json({
                message: "Lỗi khi tạo ticket category",
                error: error.message,
            });
        }
    },
];


exports.getTicketCategoriesByEvent = async(req, res) => {
    try {
        const { eventId } = req.params;
        if (!eventId) {
            return res.status(400).json({ message: "Event ID là bắt buộc" });
        }
        const ticketCategories = await TicketCategory.find({ eventId });

        if (!ticketCategories || ticketCategories.length === 0) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy ticket categories sự kiện này" });
        }
        res.status(200).json({
            message: "Ticket categories đã được lấy thành công",
            ticketCategories,
        });
    } catch (error) {
        console.error("Lỗi khi lấy ticket categories theo eventId:", error);
        res.status(500).json({
            message: "Lỗi khi lấy ticket categories",
            error: error.message,
        });
    }
};

exports.getAllTicketCategories = [
    async(req, res) => {
        try {
            const ticketCategories = await TicketCategory.find().populate("eventId"); // Populate eventId if you want to get event details
            res.status(200).json({
                message: "Ticket categories đã được lấy thành công",
                ticketCategories,
            });
        } catch (error) {
            console.error("Lỗi khi lấy ticket categories:", error);
            res
                .status(500)
                .json({
                    message: "Lỗi khi lấy ticket categories",
                    error: error.message,
                });
        }
    },
];
exports.updateTicketCategory = [
    async(req, res) => {
        try {
            const { id } = req.params;
            const updatedData = req.body;

            const updatedTicketCategory = await TicketCategory.findByIdAndUpdate(id, updatedData, {
                new: true,
                runValidators: true,
            });

            if (!updatedTicketCategory) {
                return res.status(404).json({ message: 'Không tìm thấy ticket category' });
            }

            res.status(200).json({
                message: 'Cập nhật ticket category thành công',
                ticketCategory: updatedTicketCategory,
            });
        } catch (error) {
            console.error('Lỗi khi cập nhật ticket category:', error);
            res.status(500).json({ message: 'Lỗi khi cập nhật ticket category', error: error.message });
        }
    },
];

exports.deleteTicketCategory = [
    async(req, res) => {
        const { categoryId } = req.params;

        try {

            const ticketCategory = await TicketCategory.findById(categoryId);
            if (!ticketCategory) {
                return res.status(404).json({ message: "Không tìm thấy ticket category" });
            }

            await Ticket.deleteMany({ categoryId: categoryId });
            await TicketCategory.findByIdAndDelete(categoryId);

            res
                .status(200)
                .json({
                    message: "Ticket category và các tickets liên quan đã được xóa thành công",
                });
        } catch (error) {
            console.error("Lỗi khi xóa ticket category:", error);
            res
                .status(500)
                .json({
                    message: "Lỗi khi xóa ticket category",
                    error: error.message,
                });
        }
    },
];
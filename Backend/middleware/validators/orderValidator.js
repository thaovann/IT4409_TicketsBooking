const { body, query } = require('express-validator');
const mongoose = require('mongoose');
const OrderState = require('../../utils/enums/orderState');

// Validator for creating a new order
exports.orderGetFiltersSchema = [
    query('_id')
        .optional()
        .trim()
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage('Invalid Order ID format'),

    query('userId')
        .optional()
        .trim()
        .isInt({ min: 1 })
        .withMessage('Invalid UserID found'),

    query('eventId')
        .optional()
        .trim()
        .custom(value => mongoose.Types.ObjectId.isValid(value))
        .withMessage('Invalid EventID format'),

    query('orderDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid order date format. Use ISO8601 format (YYYY-MM-DD)'),

    query('voucherCode')
        .optional()
        .isString()
        .withMessage('Voucher code must be a string')
        .notEmpty()
        .withMessage('Voucher code cannot be empty'),

    query('state')
        .optional()
        .trim()
        .isIn([...Object.values(OrderState)])
        .withMessage('Invalid order state'),

    query()
        .custom(value => {
            const filters = Object.keys(value);
            const allowedFilters = ['_id', 'userId', 'eventId', 'orderDate', 'voucherId', 'state'];
            return filters.every(filter => allowedFilters.includes(filter));
        })
        .withMessage('Invalid query filters!')
];

exports.createOrderSchema = [
    body('userId')
        .trim()
        .exists()
        .withMessage('UserID is required')
        .isInt({ min: 1 })
        .withMessage('Invalid UserID'),
    body('eventId')
        .trim()
        .exists()
        .withMessage('EventID is required')
        .custom(value => mongoose.Types.ObjectId.isValid(value))
        .withMessage('Invalid EventID format'),
    body('tickets')
        .exists()
        .withMessage('Tickets are required')
        .isArray({ min: 1 })
        .withMessage('Tickets should be a non-empty array'),
    body('tickets.*.ticketCategories')
        .isArray({ min: 1 })
        .withMessage('Each ticket should have ticket categories as an array'),
    body('tickets.*.ticketCategories.*.ticketCategoryId')
        .exists()
        .withMessage('TicketCategoryId is required')
        .custom(value => mongoose.Types.ObjectId.isValid(value))
        .withMessage('Invalid TicketCategoryId format'),
    body('tickets.*.ticketCategories.*.ticketDetails')
        .isArray({ min: 1 })
        .withMessage('TicketDetails should be a non-empty array'),
    body('tickets.*.ticketCategories.*.ticketDetails.*.ticketId')
        .exists()
        .withMessage('TicketId is required')
        .custom(value => mongoose.Types.ObjectId.isValid(value))
        .withMessage('Invalid TicketId format'),
    body('tickets.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be a valid whole number greater than 0')
        .custom((quantity, { req }) => {
            return req.body.tickets.every(ticket => {
                return ticket.ticketCategories.every(category => {
                    return category.ticketDetails.length === ticket.quantity;
                });
            });
        })
        .withMessage('Quantity should match the number of TicketIds for each category'),
    body('orderDate')
        // .optional()
        .exists()
        .withMessage('Order date is required')
        .isISO8601()
        .withMessage('Order date should be a valid date format (ISO8601)')
        .custom(value => new Date(value) <= new Date())
        .withMessage('Order date cannot be in the future'),
    body('totalPrice')
        .exists()
        .withMessage('Total price is required')
        .isFloat({ min: 0 })
        .withMessage('Total price should be a valid number greater than or equal to 0'),
    body('finalPrice')
        .exists()
        .withMessage('Final price is required')
        .isFloat({ min: 0 })
        .withMessage('Final price should be a valid number greater than or equal to 0'),
    body('state')
        .exists()
        .withMessage('Order state is required')
        .isIn(Object.values(OrderState))
        .withMessage('Invalid order state'),
    body('voucherCode')
        .optional()
        .isString()
        .withMessage('Voucher code must be a string')
        .notEmpty()
        .withMessage('Voucher code cannot be empty'),
];

exports.updateOrderSchema = [
    body('state')
        .optional()
        .trim()
        .isIn([...Object.values(OrderState)])
        .withMessage('Invalid order status'),
    body()
        .custom(value => {
            return Object.keys(value).length !== 0;
        })
        .withMessage('Please provide required fields to update')
        .custom(value => {
            const updates = Object.keys(value);
            const allowUpdates = ['state'];
            return updates.every(update => allowUpdates.includes(update));
        })
        .withMessage('Invalid updates!')
];
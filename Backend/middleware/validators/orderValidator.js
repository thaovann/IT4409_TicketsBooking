const { body, query } = require('express-validator');
const mongoose = require('mongoose');

// Validator for creating a new order
exports.orderGetFiltersSchema = [
    query('orderId')
        .optional()
        .trim()
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage('Invalid Order ID format'),

    query('userId')
        .optional()
        .trim()
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage('Invalid UserID format'),

    query('ticketCategoryId')
        .optional()
        .trim()
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage('Invalid Ticket Category ID format'),

    query('orderDate')
        .optional()
        .isISO8601()
        .withMessage('Order date should be a valid date in ISO8601 format'),

    query()
        .custom(value => {
            const filters = Object.keys(value);
            const allowedFilters = ['userId', 'ticketCategoryId', 'orderDate'];
            return filters.every(filter => allowedFilters.includes(filter));
        })
        .withMessage('Invalid query filters!'),
];
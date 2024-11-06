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

    query('voucherId')
        .optional()
        .custom(value => mongoose.Types.ObjectId.isValid(value))
        .withMessage('Invalid VoucherID format'),

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
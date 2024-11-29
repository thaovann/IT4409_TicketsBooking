const { body, query } = require('express-validator');
const mongoose = require('mongoose');
const OrderState = require('../../utils/enums/orderState');

// Validator for creating a new order
exports.orderGetFiltersSchema = [
    query('_id')
    .optional()
    .trim()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Định dạng Order ID không hợp lệ'),

    query('userId')
    .optional()
    .trim()
    .isInt({ min: 1 })
    .withMessage('Không tìm thấy UserID hợp lệ'),

    query('eventId')
    .optional()
    .trim()
    .custom(value => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Định dạng EventID không hợp lệ'),

    query('orderDate')
    .optional()
    .isISO8601()
    .withMessage('Định dạng orderDate không hợp lệ. Vui lòng sử dụng định dạng ISO8601 (YYYY-MM-DD).'),

    query('voucherCode')
    .optional()
    .isString()
    .withMessage('Mã voucher phải là một chuỗi ký tự'),

    query('state')
    .optional()
    .trim()
    .isIn([...Object.values(OrderState)])
    .withMessage('Trạng thái đơn hàng không hợp lệ'),

    query()
    .custom(value => {
        const filters = Object.keys(value);
        const allowedFilters = ['_id', 'userId', 'eventId', 'orderDate', 'voucherId', 'state'];
        return filters.every(filter => allowedFilters.includes(filter));
    })
    .withMessage('Bộ lọc truy vấn không hợp lệ!')
];

exports.createOrderSchema = [
    body('userId')
    .trim()
    .exists()
    .withMessage('UserID là bắt buộc')
    .isInt({ min: 1 })
    .withMessage('UserID không hợp lệ'),
    body('eventId')
    .trim()
    .exists()
    .withMessage('EventID là bắt buộc')
    .custom(value => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Định dạng EventID không hợp lệ'),
    body('tickets')
    .exists()
    .withMessage('Tickets là bắt buộc')
    .isArray({ min: 1 })
    .withMessage('Tickets phải là một mảng không rỗng'),
    body('tickets.*.ticketCategories')
    .isArray({ min: 1 })
    .withMessage('Mỗi ticket phải có ticket categories dưới dạng một mảng'),
    body('tickets.*.ticketCategories.*.ticketCategoryId')
    .exists()
    .withMessage('TicketCategoryId là bắt buộc')
    .custom(value => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Định dạng TicketCategoryId không hợp lệ'),
    body('tickets.*.ticketCategories.*.ticketDetails')
    .isArray({ min: 1 })
    .withMessage('TicketDetails phải là một mảng không rỗng'),
    body('tickets.*.ticketCategories.*.ticketDetails.*.ticketId')
    .exists()
    .withMessage('TicketId là bắt buộc')
    .custom(value => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Định dạng TicketId không hợp lệ'),
    body('tickets.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity phải là một số nguyên hợp lệ lớn hơn 0')
    .custom((quantity, { req }) => {
        return req.body.tickets.every(ticket => {
            return ticket.ticketCategories.every(category => {
                return category.ticketDetails.length === ticket.quantity;
            });
        });
    })
    .withMessage('Quantity phải khớp với số lượng TicketIds cho mỗi category'),
    body('orderDate')
    // .optional()
    .exists()
    .withMessage('Order date là bắt buộc')
    .isISO8601()
    .withMessage('Order date nên sử dụng định dạng ngày hợp lệ (ISO8601)')
    .custom(value => new Date(value) <= new Date())
    .withMessage('Order date không thể là ngày trong tương lai'),
    body('totalPrice')
    .exists()
    .withMessage('Total price là bắt buộc')
    .isFloat({ min: 0 })
    .withMessage('Total price nên là một số hợp lệ lớn hơn hoặc bằng 0'),
    body('finalPrice')
    .exists()
    .withMessage('Final price là bắt buộc')
    .isFloat({ min: 0 })
    .withMessage('Final price nên là một số hợp lệ lớn hơn hoặc bằng 0'),
    body('state')
    .exists()
    .withMessage('Order state là bắt buộc')
    .isIn(Object.values(OrderState))
    .withMessage('Trạng thái đơn hàng không hợp lệ'),
    body('voucherCode')
    .optional()
    .isString()
    .withMessage('Mã voucher phải là một chuỗi ký tự'),
];

exports.updateOrderSchema = [
    body('state')
    .optional()
    .trim()
    .isIn([...Object.values(OrderState)])
    .withMessage('Trạng thái đơn hàng không hợp lệ'),
    body()
    .custom(value => {
        return Object.keys(value).length !== 0;
    })
    .withMessage('Vui lòng cung cấp các trường bắt buộc để cập nhật')
    .custom(value => {
        const updates = Object.keys(value);
        const allowUpdates = ['state'];
        return updates.every(update => allowUpdates.includes(update));
    })
    .withMessage('Cập nhật không hợp lệ!')
];
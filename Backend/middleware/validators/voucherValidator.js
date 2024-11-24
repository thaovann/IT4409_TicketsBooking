const { body, param } = require('express-validator');

exports.createVoucherSchema = [
    body('code')
    .isString()
    .withMessage('Mã voucher phải là một chuỗi ký tự')
    .notEmpty()
    .withMessage('Mã voucher là bắt buộc'),
    body('discountType')
    .isIn(['percentage', 'fixed'])
    .withMessage('Loại discount không hợp lệ')
    .notEmpty()
    .withMessage('Discount type là bắt buộc'),
    body('discountValue')
    .isNumeric()
    .withMessage('Discount value phải là một số')
    .notEmpty()
    .withMessage('Discount value là bắt buộc'),
    body('minOrderValue')
    .optional()
    .isNumeric()
    .withMessage('Minimum order value phải là một số'),
    body('maxDiscountAmount')
    .optional()
    .isNumeric()
    .withMessage('Maximum discount amount phải là một số'),
    body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive phải là kiểu boolean'),
    body('startDate')
    .isISO8601()
    .withMessage('Start date phải là một ngày hợp lệ')
    .notEmpty()
    .withMessage('Start date là bắt buộc'),
    body('endDate')
    .isISO8601()
    .withMessage('End date phải là một ngày hợp lệ')
    .notEmpty()
    .withMessage('End date là bắt buộc'),
    body('minTotalSpend')
    .optional()
    .isNumeric()
    .withMessage('Minimum total spend phải là một số'),
    body('minOrderCount')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Minimum order count phải là một số nguyên không âm')
];

exports.updateVoucherSchema = [
    body('discountType')
    .optional()
    .isIn(['percentage', 'fixed']).withMessage('Loại discount không hợp lệ'),
    body('discountValue')
    .optional()
    .isNumeric().withMessage('Discount value phải là một số'),
    body('minOrderValue')
    .optional()
    .isNumeric().withMessage('Minimum order value phải là một số'),
    body('maxDiscountAmount')
    .optional()
    .isNumeric().withMessage('Maximum discount amount phải là một số'),
    body('isActive')
    .optional()
    .isBoolean().withMessage('isActive phải là kiểu boolean'),
    body('startDate')
    .optional()
    .isISO8601().withMessage('Start date phải là một ngày hợp lệ'),
    body('endDate')
    .optional()
    .isISO8601().withMessage('End date phải là một ngày hợp lệ'),
    body('minTotalSpend')
    .optional()
    .isNumeric().withMessage('Minimum total spend phải là một số'),
    body('minOrderCount')
    .optional()
    .isInt({ min: 0 }).withMessage('Minimum order count phải là một số nguyên không âm'),
    body()
    .custom(value => Object.keys(value).length !== 0)
    .withMessage('Vui lòng cung cấp các trường bắt buộc để cập nhật')
    .custom(value => {
        const updates = Object.keys(value);
        const allowUpdates = ['discountType', 'discountValue', 'minOrderValue', 'maxDiscountAmount', 'isActive', 'startDate', 'endDate', 'minTotalSpend', 'minOrderCount'];
        // ensures that every field in the request body is part of the allowed fields.
        return updates.every(update => allowUpdates.includes(update));
    })
    .withMessage('Cập nhật không hợp lệ!')
];
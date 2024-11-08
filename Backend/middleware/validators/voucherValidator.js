const { body, param } = require('express-validator');

exports.createVoucherSchema = [
    body('code')
        .isString()
        .withMessage('Voucher code must be a string')
        .notEmpty()
        .withMessage('Voucher code is required'),
    body('discountType')
        .isIn(['percentage', 'fixed'])
        .withMessage('Invalid discount type')
        .notEmpty()
        .withMessage('Discount type is required'),
    body('discountValue')
        .isNumeric()
        .withMessage('Discount value must be a number')
        .notEmpty()
        .withMessage('Discount value is required'),
    body('minOrderValue')
        .optional()
        .isNumeric()
        .withMessage('Minimum order value must be a number'),
    body('maxDiscountAmount')
        .optional()
        .isNumeric()
        .withMessage('Maximum discount amount must be a number'),
    body('usageLimit')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Usage limit must be an integer greater than 0'),
    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean'),
    body('startDate')
        .isISO8601()
        .withMessage('Start date must be a valid date')
        .notEmpty()
        .withMessage('Start date is required'),
    body('endDate')
        .isISO8601()
        .withMessage('End date must be a valid date')
        .notEmpty()
        .withMessage('End date is required'),
    body('minTotalSpend')
        .optional()
        .isNumeric()
        .withMessage('Minimum total spend must be a number'),
    body('minOrderCount')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Minimum order count must be a non-negative integer')
];

exports.validateVoucherUpdate = [
    param('code')
        .isString().withMessage('Voucher code must be a string')
        .notEmpty().withMessage('Voucher code is required in the URL'),
    body('discountType')
        .optional()
        .isIn(['percentage', 'fixed']).withMessage('Invalid discount type'),
    body('discountValue')
        .optional()
        .isNumeric().withMessage('Discount value must be a number'),
    body('minOrderValue')
        .optional()
        .isNumeric().withMessage('Minimum order value must be a number'),
    body('maxDiscountAmount')
        .optional()
        .isNumeric().withMessage('Maximum discount amount must be a number'),
    body('usageLimit')
        .optional()
        .isInt({ min: 1 }).withMessage('Usage limit must be an integer greater than 0'),
    body('isActive')
        .optional()
        .isBoolean().withMessage('isActive must be a boolean'),
    body('startDate')
        .optional()
        .isISO8601().withMessage('Start date must be a valid date'),
    body('endDate')
        .optional()
        .isISO8601().withMessage('End date must be a valid date'),
    body('minTotalSpend')
        .optional()
        .isNumeric().withMessage('Minimum total spend must be a number'),
    body('minOrderCount')
        .optional()
        .isInt({ min: 0 }).withMessage('Minimum order count must be a non-negative integer')
];
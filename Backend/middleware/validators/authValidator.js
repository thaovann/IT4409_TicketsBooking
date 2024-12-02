const { body } = require('express-validator');
const { OTPRegex } = require('../../utils/common.utils');
const EmailValidator = require('deep-email-validator');


exports.forgotPWSchema = [
    body('Email')
    .trim()
    .exists()
    .withMessage('Email là bắt buộc')
    .isEmail()
    .withMessage('Email phải hợp lệ')
    .custom(async(Email) => {
        const { valid } = await EmailValidator.validate(Email);
        return valid;
    })
    .withMessage('Không nhận diện được email')
    .normalizeEmail()
];

exports.changePWSchema = [
    body('Email')
    .trim()
    .exists()
    .withMessage('Email là bắt buộc')
    .isEmail()
    .withMessage('Email phải hợp lệ')
    .custom(async(Email) => {
        const { valid } = await EmailValidator.validate(Email);
        return valid;
    })
    .withMessage('Không nhận diện được email')
    .normalizeEmail(),
    body('Password')
    .trim()
    .exists()
    .withMessage('Mật khẩu là bắt buộc')
    .notEmpty()
    .withMessage('Mật khẩu phải được điền đầy đủ'),
    body('NewPassword')
    .trim()
    .exists()
    .withMessage('Mật khẩu mới là bắt buộc')
    .notEmpty()
    .withMessage('Mật khẩu mới phải được điền đầy đủ')
    .custom((value, { req }) => value !== req.body.Password)
    .withMessage(`Mật khẩu mới không thể giống mật khẩu cũ`)
];

exports.resetPWSchema = [
    body('Email')
    .trim()
    .exists()
    .withMessage('Email là bắt buộc')
    .isEmail()
    .withMessage('Email phải hợp lệ')
    .custom(async(Email) => {
        const { valid } = await EmailValidator.validate(Email);
        return valid;
    })
    .withMessage('Không nhận diện được email')
    .normalizeEmail(),
    body('Password')
    .trim()
    .exists()
    .withMessage('Mật khẩu là bắt buộc')
    .notEmpty()
    .withMessage('Mật khẩu phải được điền đầy đủ')
];

exports.verifyOTPSchema = [
    body('Email')
    .trim()
    .exists()
    .withMessage('Email là bắt buộc')
    .isEmail()
    .withMessage('Email phải hợp lệ')
    .custom(async(Email) => {
        const { valid } = await EmailValidator.validate(Email);
        return valid;
    })
    .withMessage('Không nhận diện được email')
    .normalizeEmail(),
    body('OTP')
    .trim()
    .exists()
    .withMessage('Mã OTP là bắt buộc')
    .matches(OTPRegex)
    .withMessage('Mã OTP phải có 4 chữ số')
    // .isString()
    // .withMessage('Mã OTP phải là một chuỗi ký tự')
];

exports.validateLogin = [
    body('Email')
    .trim()
    .exists()
    .withMessage('Email là bắt buộc')
    .isEmail()
    .withMessage('Email phải hợp lệ')
    .custom(async(Email) => {
        const { valid } = await EmailValidator.validate(Email);
        return valid;
    })
    .withMessage('Không nhận diện được email')
    .normalizeEmail(),
    body('Password')
    .trim()
    .exists()
    .withMessage('Mật khẩu là bắt buộc')
    .notEmpty()
    .withMessage('Mật khẩu phải được điền đầy đủ')
];

exports.validateRefresh = [
    body('Email')
    .trim()
    .exists()
    .withMessage('Email là bắt buộc')
    .isEmail()
    .withMessage('Email phải hợp lệ')
    .custom(async(Email) => {
        const { valid } = await EmailValidator.validate(Email);
        return valid;
    })
    .withMessage('Không nhận diện được email')
    .normalizeEmail(),
    body('Password')
    .trim()
    .exists()
    .withMessage('Mật khẩu là bắt buộc')
    .notEmpty()
    .withMessage('Mật khẩu phải được điền đầy đủ'),
    body('oldToken')
    .trim()
    .exists()
    .withMessage('Old token là bắt buộc để làm mới')
    .isJWT()
    .withMessage('Định dạng token không hợp lệ')
];
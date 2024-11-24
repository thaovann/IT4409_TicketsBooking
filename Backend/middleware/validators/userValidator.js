const { body } = require('express-validator');
const UserRole = require('../../utils/enums/userRoles');
const UserGender = require('../../utils/enums/userGenders');
const EmailValidator = require('deep-email-validator');
const UserModel = require('../../models/User');
const moment = require('moment');

exports.createUserSchema = [
    body('FullName')
    .trim()
    .exists()
    .withMessage('Full name là bắt buộc'),
    body('IdCard')
    .trim()
    .exists()
    .withMessage('ID Card là bắt buộc')
    .isLength({ min: 12, max: 12 })
    .withMessage('ID Card phải chính xác 12 chữ số')
    .matches(/^\d{12}$/)
    .withMessage('ID Card chỉ được chứa các chữ số'),
    body('Email')
    .trim()
    .exists()
    .withMessage('Email là bắt buộc')
    .isEmail()
    .withMessage('Phải là một email hợp lệ')
    .custom(async(Email) => {
        // Use an email validator to check the validity of the email
        const result = await EmailValidator.validate(Email);

        const { regex, typo, disposable } = result.validators;
        if (regex.valid && typo.valid && disposable.valid) {
            return true; // Email is considered valid without SMTP
        }

        throw new Error('Email không được nhận diện');
    })
    .custom(async(Email) => {
        // Check if the email already exists in the database
        const user = await UserModel.findOne({ Email });
        if (user) {
            throw new Error('Email đã được đăng ký');
        }
        return true;
    })
    .normalizeEmail(),
    body('Password')
    .trim()
    .exists()
    .withMessage('Password là bắt buộc')
    .isLength({ min: 8 })
    .withMessage('Password phải có ít nhất 8 ký tự')
    .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])/)
    .withMessage('Password phải chứa ít nhất một chữ số, một chữ cái viết thường, một chữ cái viết hoa và một ký tự đặc biệt'),
    body('Phone')
    .trim()
    .exists()
    .withMessage('Phone là bắt buộc')
    .isMobilePhone()
    .withMessage('Phải là một số điện thoại hợp lệ với mã quốc gia'),
    body('Role')
    .trim()
    .exists()
    .withMessage('Role là bắt buộc')
    .isIn([...Object.values(UserRole)])
    .withMessage('Loại UserRole không hợp lệ'),
    body('Gender')
    .trim()
    .exists()
    .withMessage('Gender là bắt buộc')
    .isIn([...Object.values(UserGender)])
    .withMessage('Loại UserGender không hợp lệ'),
    body('DoB')
    .optional()
    .trim()
    .isDate()
    .withMessage('Phải là một ngày hợp lệ')
    .custom((DoB) => {
        const currentDate = moment();
        const userDoB = moment(DoB, 'YYYY-MM-DD');
        const age = currentDate.diff(userDoB, 'years');
        return age >= 12;
    })
    .withMessage('Người dùng phải ít nhất 12 tuổi')
];

exports.updateUserSchema = [
    body('FullName')
    .optional()
    .trim()
    .exists()
    .withMessage('Full name là bắt buộc'),
    body('IdCard')
    .optional()
    .trim()
    .exists()
    .withMessage('ID Card là bắt buộc')
    .isLength({ min: 12, max: 12 })
    .withMessage('ID Card phải chính xác 12 chữ số')
    .matches(/^\d{12}$/)
    .withMessage('ID Card chỉ được chứa các chữ số'),
    body('Phone')
    .optional()
    .trim()
    .exists()
    .withMessage('Phone là bắt buộc')
    .isMobilePhone()
    .withMessage('Phải là một số điện thoại hợp lệ với mã quốc gia'),
    body('Gender')
    .optional()
    .trim()
    .exists()
    .withMessage('Gender là bắt buộc')
    .isIn([...Object.values(UserGender)])
    .withMessage('Loại UserGender không hợp lệ'),
    body('DoB')
    .optional()
    .trim()
    .isDate()
    .withMessage('Phải là một ngày hợp lệ')
    .custom((DoB) => {
        const currentDate = moment();
        const userDoB = moment(DoB, 'YYYY-MM-DD');
        const age = currentDate.diff(userDoB, 'years');
        return age >= 12;
    })
    .withMessage('Người dùng phải ít nhất 12 tuổi'),
    body()
    .custom(value => Object.keys(value).length !== 0)
    .withMessage('Vui lòng cung cấp các trường bắt buộc để cập nhật')
    .custom(value => {
        const updates = Object.keys(value);
        const allowUpdates = ['FullName', 'Gender', 'Phone', 'IdCard', 'DoB'];
        // ensures that every field in the request body is part of the allowed fields.
        return updates.every(update => allowUpdates.includes(update));
    })
    .withMessage('Cập nhật không hợp lệ!')
];
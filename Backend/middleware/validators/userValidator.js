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
        .withMessage('Your full name is required'),
    body('IdCard')
        .trim()
        .exists()
        .withMessage('ID Card is required')
        .isLength({ min: 12, max: 12 })
        .withMessage('ID Card must be exactly 12 digits')
        .matches(/^\d{12}$/)
        .withMessage('ID Card must contain only digits'),
    body('Email')
        .trim()
        .exists()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Must be a valid email')
        .custom(async (Email) => {
            // Use an email validator to check the validity of the email
            const result = await EmailValidator.validate(Email);
            
            const { regex, typo, disposable } = result.validators;
            if (regex.valid && typo.valid && disposable.valid) {
                return true; // Email is considered valid without SMTP
            }

            throw new Error('Email unrecognized');
        })
        .custom(async (Email) => {
            // Check if the email already exists in the database
            const user = await UserModel.findOne({ Email });
            if (user) {
                throw new Error('Email already registered');
            }
            return true;
        })
        .normalizeEmail(),
    body('Password')
        .trim()
        .exists()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])/)
        .withMessage('Password must contain at least one number, one lowercase letter, one uppercase letter, and one special character'),
    body('Phone')
        .trim()
        .exists()
        .withMessage('Contact is required')
        .isMobilePhone()
        .withMessage('Must be a valid mobile number with country code'),
    body('Role')
        .trim()
        .exists()
        .withMessage('Role is required')
        .isIn([...Object.values(UserRole)])
        .withMessage('Invalid UserRole type'),
    body('Gender')
        .trim()
        .exists()
        .withMessage('Gender is required')
        .isIn([...Object.values(UserGender)])
        .withMessage('Invalid UserGender type'),
    body('DoB')
        .optional()
        .trim()
        .isDate()
        .withMessage('Must be a valid date')
        .custom((DoB) => {
            const currentDate = moment();
            const userDoB = moment(DoB, 'YYYY-MM-DD');
            const age = currentDate.diff(userDoB, 'years');
            return age >= 12;
        })
        .withMessage('User must be at least 12 years old')
];

// exports.updateUserSchema = [
//     body('FullName')
//         .optional()
//         .trim()
//         .isLength({ min: 1 })
//         .withMessage('Must be at least 1 char long'),
//     body('IdCard')
//         .optional()
//         .trim(),
//     body('Email')
//         .optional()
//         .trim()
//         .isEmail()
//         .withMessage('Must be a valid email')
//         .custom(async (Email) => {
//             const { valid } = await EmailValidator.validate(Email);
//             return valid;
//         })
//         .withMessage('Email unrecognized')
//         .normalizeEmail(),
//     body('Phone')
//         .optional()
//         .trim()
//         .isMobilePhone('en-PK', { strictMode: true })
//         .withMessage('Must be a valid Pakistan mobile number along with country code'),
//     body()
//         .custom(value => Object.keys(value).length !== 0)
//         .withMessage('Please provide required field to update')
//         .custom(value => {
//             const updates = Object.keys(value);
//             const allowUpdates = ['FullName', 'Email', 'Phone', 'IdCard', 'Role'];
//             // ensures that every field in the request body is part of the allowed fields.
//             return updates.every(update => allowUpdates.includes(update));
//         })
//         .withMessage('Invalid updates!')
// ];

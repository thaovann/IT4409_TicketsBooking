const { validationResult } = require('express-validator');
const { InvalidPropertiesException } = require('../utils/exceptions/validation');

exports.checkValidation = (req) => {
    const data = validationResult(req);
    console.log(data);
    console.log('Request body:', req.body); // Kiểm tra dữ liệu từ client
    console.log('Validation errors:', data.errors); // Log các lỗi validation

    if (!data.isEmpty()) {
        throw new InvalidPropertiesException(`Missing or invalid properties:\n${data.errors[0].msg}`, { data: data.errors });
    }
}
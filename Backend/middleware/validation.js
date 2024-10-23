const { validationResult } = require('express-validator');
const { InvalidPropertiesException } = require('../utils/exceptions/validation');

exports.checkValidation = (req) => {
    const data = validationResult(req);
    console.log(data);
    if (!data.isEmpty()) {
        throw new InvalidPropertiesException('Missing or invalid properties', {data: data.errors});
    }
}
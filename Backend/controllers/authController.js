const { checkValidation } = require('../middleware/validation');

const { 
    registerUser,
    userLogin 
} = require('../services/authServices');

exports.registerUser = async (req, res, next) => {
    checkValidation(req);
    const response = await registerUser(req.body);
    res.send(response);
};

exports.userLogin = async (req, res, next) => {
    checkValidation(req);
    const response = await userLogin(req.body.Email, req.body.Password);
    res.send(response);
};

// refreshToken = async (req, res, next) => {
//     checkValidation(req);
//     const response = await AuthRepository.refreshToken(req.body);
//     res.send(response);
// };

// forgotPassword = async (req, res, next) => {
//     checkValidation(req);
//     const response = await AuthRepository.forgotPassword(req.body);
//     res.send(response);
// }

// verifyOTP = async (req, res, next) => {
//     checkValidation(req);
//     const response = await AuthRepository.verifyOTP(req.body);
//     res.send(response);
// }

// changePassword = async (req, res, next) => {
//     checkValidation(req);
//     const response = await AuthRepository.changePassword(req.body);
//     res.send(response);
// };

// resetPassword = async (req, res, next) => {
//     checkValidation(req);
//     const response = await AuthRepository.resetPassword(req.body);
//     res.send(response);
// }
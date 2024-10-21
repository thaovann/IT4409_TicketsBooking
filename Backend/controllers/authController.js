const { checkValidation } = require('../middleware/validation');

const { 
    registerUser,
    userLogin,
    refreshToken,
    forgotPassword
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

exports.refreshToken = async (req, res, next) => {
    checkValidation(req);
    const response = await refreshToken(req.body);
    res.send(response);
};

exports.forgotPassword = async (req, res, next) => {
    checkValidation(req);
    const response = await forgotPassword(req.body);
    res.send(response);
}

// verifyOTP = async (req, res, next) => {
//     checkValidation(req);
//     const response = await verifyOTP(req.body);
//     res.send(response);
// }

// changePassword = async (req, res, next) => {
//     checkValidation(req);
//     const response = await changePassword(req.body);
//     res.send(response);
// };

// resetPassword = async (req, res, next) => {
//     checkValidation(req);
//     const response = await resetPassword(req.body);
//     res.send(response);
// }
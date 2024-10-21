const express = require("express");
const router = express.Router();

const {
    registerUser,
    userLogin,
    // refreshToken,
    // forgotPassword,
    // verifyOTP,
    // resetPassword,
    // changePassword
} = require("../controllers/authController");

const { createUserSchema } = require("../middleware/validators/userValidator");
const {
    validateLogin,
//     forgotPWScheme,
//     resetPWSchema,
//     changePWSchema,
//     verifyOTPSchema,
//     validateRefresh
} = require("../middleware/validators/authValidator");

const awaitHandlerFactory = require("../middleware/awaitHandlerFactory");

router.post("/register", createUserSchema, awaitHandlerFactory(registerUser));
router.post("/login", validateLogin, awaitHandlerFactory(userLogin));
// router.post("/token", validateRefresh, awaitHandlerFactory(refreshToken));

// router.post("/Password/forgot", forgotPWScheme, awaitHandlerFactory(forgotPassword));
// router.post("/Password/otp", verifyOTPSchema, awaitHandlerFactory(verifyOTP));
// router.post("/Password/reset", resetPWSchema, awaitHandlerFactory(resetPassword));
// router.post("/Password/change", changePWSchema, awaitHandlerFactory(changePassword));

module.exports = router;

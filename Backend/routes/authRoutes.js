const express = require("express");
const router = express.Router();

const {
    registerUser,
    userLogin,
    refreshToken,
    forgotPassword,
    verifyOTP,
    resetPassword,
    changePassword
} = require("../controllers/authController");

const { createUserSchema } = require("../middleware/validators/userValidator");
const {
    validateLogin,
    forgotPWSchema,
    resetPWSchema,
    changePWSchema,
    verifyOTPSchema,
    validateRefresh
} = require("../middleware/validators/authValidator");

const awaitHandlerFactory = require("../middleware/awaitHandlerFactory");

router.post("/register", createUserSchema, awaitHandlerFactory(registerUser));
router.post("/login", validateLogin, awaitHandlerFactory(userLogin));
router.post("/token", validateRefresh, awaitHandlerFactory(refreshToken));

router.post("/password/forgot", forgotPWSchema, awaitHandlerFactory(forgotPassword));
router.post("/password/otp", verifyOTPSchema, awaitHandlerFactory(verifyOTP));
router.post("/password/reset", resetPWSchema, awaitHandlerFactory(resetPassword));
router.post("/password/change", changePWSchema, awaitHandlerFactory(changePassword));

module.exports = router;

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory');

const {
    createPayment,
    callback,
    checkStatusTransaction,
    createPaymentVnpay,
    vnpayReturn,
    vnpayIPN
} = require('../controllers/paymentController');
const UserRole = require('../utils/enums/userRoles');

router.post('/create-payment', auth(), awaitHandlerFactory(createPayment));
router.post('/callback', auth(), awaitHandlerFactory(callback));
router.post('/check-status-transaction', auth(), awaitHandlerFactory(checkStatusTransaction));
router.post('/create-payment-vnpay', auth(), awaitHandlerFactory(createPaymentVnpay));
router.get('/vnpay_return', auth(), awaitHandlerFactory(vnpayReturn));
router.get('/vnpay_ipn', auth(), awaitHandlerFactory(vnpayIPN));

module.exports = router;
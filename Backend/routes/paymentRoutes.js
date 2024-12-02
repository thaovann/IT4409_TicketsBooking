const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory');

const {
    createPayment,
    callback,
    checkStatusTransaction
} = require('../controllers/paymentController');
const UserRole = require('../utils/enums/userRoles');

router.post('/create-payment', auth(), awaitHandlerFactory(createPayment));
router.post('/callback', auth(), awaitHandlerFactory(callback));
router.post('/check-status-transaction', auth(), awaitHandlerFactory(checkStatusTransaction));

module.exports = router;
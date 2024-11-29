const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory');

const {
    createVoucher,
    getAllVouchers,
    getVoucherByCode,
    getUserVouchers,
    updateVoucher,
    deleteVoucher
} = require('../controllers/voucherController');
const UserRole = require('../utils/enums/userRoles');
const {
    createVoucherSchema,
    updateVoucherSchema
} = require('../middleware/validators/voucherValidator');

router.post('/', auth(UserRole.Admin), createVoucherSchema, awaitHandlerFactory(createVoucher));
router.get('/', auth(), awaitHandlerFactory(getAllVouchers));
router.get('/code/:code', auth(), awaitHandlerFactory(getVoucherByCode));
router.get('/users/:id', auth(), awaitHandlerFactory(getUserVouchers));
router.patch('/id/:id', auth(UserRole.Admin), updateVoucherSchema, awaitHandlerFactory(updateVoucher));
router.delete('/id/:id', auth(UserRole.Admin), awaitHandlerFactory(deleteVoucher));

module.exports = router;
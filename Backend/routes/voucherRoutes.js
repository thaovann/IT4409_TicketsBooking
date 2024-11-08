const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory');

const {
    createVoucher,
    getAllVouchers,
    getVoucherByCode,
    updateVoucher,
    deleteVoucher
} = require('../controllers/voucherController');
const UserRole = require('../utils/enums/userRoles');
const {
    createVoucherSchema,
    updateVoucherSchema
} = require('../middleware/validators/voucherValidator');

router.post('/', auth(UserRole.Admin), createVoucherSchema, awaitHandlerFactory(createVoucher));
// router.get('/', auth(UserRole.Admin), awaitHandlerFactory(getAllVouchers));
// router.get('code/:code', auth(UserRole.Admin), awaitHandlerFactory(getVoucherByCode));
// router.put('/code/:code', auth(UserRole.Admin), updateVoucherSchema, awaitHandlerFactory(updateVoucher));
// router.delete('/code/:code', auth(UserRole.Admin), awaitHandlerFactory(deleteVoucher));

module.exports = router;
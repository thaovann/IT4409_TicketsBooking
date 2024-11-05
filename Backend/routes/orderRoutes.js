const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory');

const {
    getAllOrders,
    getOrderById,
    getFilteredOrders,
    // getUserOrders,
    // getShowOrders,
    // createOrder,
    // updateOrder,
    // deleteOrder
} = require('../controllers/orderController');
const UserRole = require('../utils/enums/userRoles.utils');
const {
    createOrderSchema,
    updateOrderSchema,
    orderGetFiltersSchema
} = require('../middleware/validators/OrderValidator');

router.get('/', auth(), awaitHandlerFactory(getAllOrders));
router.get('/id/:id', auth(), awaitHandlerFactory(getOrderById));
router.get('/filters', auth(), orderGetFiltersSchema, awaitHandlerFactory(getFilteredOrders));
// router.get('/users/:id', auth(), awaitHandlerFactory(getUserOrders));
// router.get('/shows/:id', auth(), awaitHandlerFactory(getShowOrders));
// router.post('/', auth(), createOrderSchema, awaitHandlerFactory(createOrder));
// router.patch('/id/:id', auth(UserRole.Admin), updateOrderSchema, awaitHandlerFactory(updateOrder));
// router.delete('/id/:id', auth(UserRole.Admin), awaitHandlerFactory(deleteOrder));

module.exports = router;
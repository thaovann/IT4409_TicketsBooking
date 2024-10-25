const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory');

const {
    getAllUsers,
    getUserById,
    updateUser,
} = require('../controllers/userController');
const UserRole = require('../utils/enums/userRoles');
const { updateUserSchema } = require('../middleware/validators/userValidator');

router.get('/', auth(), awaitHandlerFactory(getAllUsers));
router.get('/id/:id', auth(), awaitHandlerFactory(getUserById));
router.patch('/id/:id', auth(), updateUserSchema, awaitHandlerFactory(updateUser));
// router.delete('/id/:id', auth(UserRole.Admin), awaitHandlerFactory(deleteUser)); 

module.exports = router;
const { checkValidation } = require('../middleware/validation');

const {
    findAll,
    findOne,
    updateOne,
    // deleteOne
} = require('../services/userServices');

exports.getAllUsers = async (req, res, next) => {
    const response = await findAll();
    res.send(response);
};

exports.getUserById = async (req, res, next) => {
    const response = await findOne({ UserId: req.params.id });
    res.send(response);
};

exports.updateUser = async (req, res, next) => {
    checkValidation(req);
    const response = await updateOne(req.body, { UserId: req.params.id });
    res.send(response);
};

// exports.deleteUser = async (req, res, next) => {
//     const response = await deleteOne(req.params.id);
//     res.send(response);
// };
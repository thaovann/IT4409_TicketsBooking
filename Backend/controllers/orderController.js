const { checkValidation } = require('../middleware/validation');
const { Types } = require('mongoose');

const {
    findAll,
    findOne,
    findAllByUser,
    findAllByEvent,
    create,
    update,
    del
} = require('../services/orderServices');

exports.getAllOrders = async(req, res, next) => {
    const response = await findAll();
    res.send(response);
};

exports.getOrderById = async(req, res, next) => {
    const response = await findOne({ _id: req.params.id });
    res.send(response);
};

exports.getFilteredOrders = async(req, res, next) => {
    checkValidation(req);

    if (req.query.orderDate) {
        req.query.orderDate = new Date(req.query.orderDate);
        if (isNaN(req.query.orderDate.getTime())) {
            return res.status(400).json({ error: 'Định dạng ngày không hợp lệ cho orderDate' });
        }
    }

    const response = await findAll(req.query);
    res.send(response);
};

exports.getUserOrders = async(req, res, next) => {
    const response = await findAllByUser(req.params.id, req.query);
    res.send(response);
};

exports.getEventOrders = async(req, res, next) => {
    const response = await findAllByEvent(req.params.id, req.query);
    res.send(response);
};

exports.createOrder = async(req, res, next) => {
    checkValidation(req);
    const response = await create(req.body);
    res.status(201).send(response);
};

exports.updateOrder = async(req, res, next) => {
    checkValidation(req);
    const response = await update(req.body, req.params.id);
    res.send(response);
};

exports.deleteOrder = async(req, res, next) => {
    const response = await del(req.params.id);
    res.send(response);
};
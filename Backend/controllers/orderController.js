const { checkValidation } = require('../middleware/validation');
const mongoose = require("mongoose");

const {
    findAll,
    findOne,
    findAllByUser
} = require('../services/orderServices');

exports.getAllOrders = async (req, res, next) => {
    const response = await findAll();
    res.send(response);
};

exports.getOrderById = async (req, res, next) => {
    const response = await findOne({ _id: req.params.id });
    res.send(response);
};

exports.getFilteredOrders = async (req, res, next) => {
    checkValidation(req);
    const response = await findAll(req.query);
    res.send(response);
};

exports.getUserOrders = async (req, res, next) => {
    const response = await findAllByUser(req.params.id, req.query);
    res.send(response);
};
const { checkValidation } = require('../middleware/validation');
const { Types } = require('mongoose');

const {
    findAll,
    findOne,
    findAllByUser,
    create,
    update,
    del
} = require('../services/voucherServices');

exports.getAllVouchers = async (req, res, next) => {
    const response = await findAll();
    res.send(response);
};

exports.getVoucherByCode = async (req, res, next) => {
    const response = await findOne({ code: req.params.code });
    res.send(response);
};

exports.getUserVouchers = async (req, res, next) => {
    const response = await findAllByUser(req.params.id, req.query);
    res.send(response);
};

exports.createVoucher = async (req, res, next) => {
    checkValidation(req);
    const response = await create(req.body);
    res.status(201).send(response);
};

exports.updateVoucher = async (req, res, next) => {
    checkValidation(req);
    const response = await update(req.body, req.params.id);
    res.send(response);
};

exports.deleteVoucher = async (req, res, next) => {
    const response = await del(req.params.id);
    res.send(response);
};
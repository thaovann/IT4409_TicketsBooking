const { structureResponse } = require('../utils/common.utils');

const VoucherModel = require('../models/Voucher');
const UserModel = require('../models/User');

const {
    NotFoundException,
    CreateFailedException,
    UnexpectedException,
    UpdateFailedException
} = require('../utils/exceptions/database');
const { default: mongoose } = require('mongoose');

exports.findAll = async (params = {}) => {
    const hasParams = Object.keys(params).length !== 0;
    let vouchers = await VoucherModel.find(hasParams ? params : {});
    if (!vouchers.length) {
        throw new NotFoundException('Vouchers not found');
    }

    return structureResponse(vouchers, 1, "Success");
};

exports.findOne = async (params) => {
    let voucher = await VoucherModel.findOne(params);
    if (!voucher) {
        throw new NotFoundException('Voucher not found');
    }

    return structureResponse(voucher, 1, "Success");
}

// Create a new voucher
exports.create = async (voucherBody) => {
    if (new Date(voucherBody.startDate) >= new Date(voucherBody.endDate)) {
        throw new CreateFailedException('startDate must be earlier than endDate');
    }

    if (voucherBody.discountType === 'fixed' && voucherBody.maxDiscountAmount != null) {
        throw new CreateFailedException('maxDiscountAmount should not be provided for fixed discount type');
    }

    voucherBody.isActive = true;

    const result = await VoucherModel.create(voucherBody);

    if (!result) {
        throw new CreateFailedException('Voucher failed to be created');
    }

    await updateUserVouchers(result);

    return structureResponse(result, 1, 'Voucher was created!');
};


// Update an existing voucher
exports.update = async (voucherBody, query) => {
    const updatedVoucher = await Voucher.findOneAndUpdate(query, voucherBody, { new: true });

    if (updatedVoucher) {
        // Update users' vouchers if criteria change
        await updateUserVouchers(updatedVoucher);
    }

    return updatedVoucher;
};

// Delete a voucher by query (e.g., code)
exports.delete = async (query) => {
    const voucherToDelete = await Voucher.findOne(query);
    if (!voucherToDelete) return null;

    // Remove the voucher from users before deletion
    await removeVoucherFromUsers(voucherToDelete._id);

    return await Voucher.deleteOne(query);
};

const updateUserVouchers = async (voucher) => {
    const qualifiedUsers = await UserModel.find({
        totalSpend: { $gte: voucher.minTotalSpend },
        orderCount: { $gte: voucher.minOrderCount },
    });

    await Promise.all(qualifiedUsers.map(async (user) => {
        if (!user.Vouchers.includes(voucher._id)) {
            user.Vouchers.push(voucher._id);
            await user.save();
        }
    }));
}

// Helper function to remove a voucher from all users when it is deleted
async function removeVoucherFromUsers(voucherId) {
    await User.updateMany({ Vouchers: voucherId }, { $pull: { Vouchers: voucherId } });
}
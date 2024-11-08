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

    if (voucherBody.discountType === 'percentage' && voucherBody.discountValue === undefined) {
        throw new CreateFailedException('discountValue should be provided for percentage discount type');
    }

    if (voucherBody.discountType === 'percentage' && voucherBody.discountValue > 80) {
        throw new CreateFailedException('discountValue should not be greater than 80%');
    }

    const result = await VoucherModel.create(voucherBody);

    if (!result) {
        throw new CreateFailedException('Voucher failed to be created');
    }

    if (voucherBody.isActive === false) {
        return structureResponse(result, 1, 'Voucher was created!');
    }

    await updateUserVouchers(result);

    return structureResponse(result, 1, 'Voucher was created!');
};


// Update an existing voucher
exports.update = async (voucherBody, id) => {
    if (new Date(voucherBody.startDate) >= new Date(voucherBody.endDate)) {
        throw new UpdateFailedException('startDate must be earlier than endDate');
    }

    if (voucherBody.discountType === 'fixed' && voucherBody.maxDiscountAmount != null) {
        throw new UpdateFailedException('maxDiscountAmount should not be provided for fixed discount type');
    }

    if (voucherBody.discountType === 'percentage' && voucherBody.discountValue === undefined) {
        throw new UpdateFailedException('discountValue should be provided for percentage discount type');
    }

    if (voucherBody.discountType === 'percentage' && voucherBody.discountValue > 80) {
        throw new UpdateFailedException('discountValue should not be greater than 80%');
    }

    if (voucherBody.discountType === 'fixed') {
        voucherBody.maxDiscountAmount = null;
    }

    const updatedVoucher = await VoucherModel.findByIdAndUpdate(id, voucherBody, { new: true, runValidators: true });

    if (!updatedVoucher) throw new UnexpectedException('Something went wrong with updating the voucher');

    if (voucherBody.isActive === false) {
        await removeVoucherFromUsers(id);
    } else {
        await updateUserVouchers(updatedVoucher);
    }

    return structureResponse(updatedVoucher, 1, 'Voucher was created!');
};

// Delete a voucher by query (e.g., code)
exports.del = async (query) => {
    const voucherToDelete = await Voucher.findOne(query);
    if (!voucherToDelete) return null;

    // Remove the voucher from users before deletion
    await removeVoucherFromUsers(voucherToDelete._id);

    return await Voucher.deleteOne(query);
};

exports.del = async (id) => {
    const existingVoucher = await VoucherModel.findById(id);
    if (!existingVoucher) throw new NotFoundException('Voucher not found');

    const result = await VoucherModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Voucher not found');

    await removeVoucherFromUsers(id);

    return structureResponse({}, 1, 'Voucher has been deleted and removed from all users');
};

const updateUserVouchers = async (voucher) => {
    const result = await UserModel.updateMany({
        totalSpend: { $gte: voucher.minTotalSpend },
        orderCount: { $gte: voucher.minOrderCount },
        Vouchers: { $ne: voucher._id } // Ensure the voucher is not already present
    }, {
        $addToSet: { Vouchers: voucher._id } // Adds voucher ID to the array only if it's not already present
    });

    console.log(`${result.modifiedCount} users updated with new voucher.`);
};


// Helper function to remove a voucher from all users when it is deleted
const removeVoucherFromUsers = async (voucherId) => {
    await UserModel.updateMany({ Vouchers: voucherId }, { $pull: { Vouchers: voucherId } });
}
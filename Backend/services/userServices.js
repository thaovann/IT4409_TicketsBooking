const { structureResponse } = require('../utils/common.utils');

const UserModel = require('../models/User');
const {
    NotFoundException,
} = require('../utils/exceptions/database');

exports.findAll = async (params = {}) => {
    let userList = await UserModel.find();
    if (!userList.length) {
        throw new NotFoundException('Users not found');
    }

    userList = userList.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });

    return structureResponse(userList, 1, "Success");
};

exports.findOne = async (params) => {
    const user = await UserModel.findOne(params);
    if (!user) {
        throw new NotFoundException('User not found');
    }

    const { password, ...userWithoutPassword } = user;

    return structureResponse(userWithoutPassword, 1, "Success");
};
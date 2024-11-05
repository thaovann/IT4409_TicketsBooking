const { structureResponse, parseTime } = require('../utils/common.utils');

const OrderModel = require('../models/Order');
const {
    NotFoundException
} = require('../utils/exceptions/database');

exports.findAll = async (params = {}) => {
    const hasParams = Object.keys(params).length !== 0;
    let orders = await OrderModel.find(hasParams ? params : {});
    if (!orders.length) {
        throw new NotFoundException('Orders not found');
    }

    return structureResponse(orders, 1, "Success");
}

exports.findOne = async (params) => {
    let order = await OrderModel.findOne(params);
    if (!order) {
        throw new NotFoundException('Order not found');
    }

    return structureResponse(order, 1, "Success");
}

// exports.findAllByUser = async (id, query = {}) => {
//     let bookingDuplicates = await BookingModel.findAllByUser(id, query);
//     if (!bookingDuplicates.length) {
//         throw new NotFoundException('Bookings for this user not found');
//     }

//     let bookingList = {};

//     for (let booking of bookingDuplicates) {
//         const { title, poster_url, show_id, start_time, date, show_type, ...bookingDetails } = booking;
//         if (!bookingList[show_id]) {
//             bookingList[show_id] = { title, poster_url };
//             const show_datetime = `${date} ${parseTime(start_time)}`;
//             bookingList[show_id].show = { show_id, show_type, show_datetime };
//             bookingList[show_id].bookings = [];
//         }
//         bookingList[show_id].bookings.push(bookingDetails);
//     }

//     bookingList = Object.values(bookingList);

//     return structureResponse(bookingList, 1, "Success");
// }
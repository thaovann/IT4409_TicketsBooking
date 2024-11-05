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

exports.findAllByUser = async (id, query = {}) => {
    let orderDuplicates = await orderFindAllByUser(id, query);
    if (!orderDuplicates.length) {
        throw new NotFoundException('Orders for this user not found');
    }

    let orderList = {};

    for (let order of orderDuplicates) {
        // seat, serialNumber
        const { eventImageBackground, eventName, eventId, eventTypeId, startTime, endTime, voucherName, voucherDiscount, ...orderDetails } = order;
        if (!orderList[eventId]) {
            orderList[eventId] = { eventName, eventImageBackground };
            const show_startTime = `${startTime}`;
            const show_endTime = `${endTime}`;
            orderList[eventId].event = { eventId, eventTypeId, show_startTime, show_endTime };
            orderList[eventId].voucher = { voucherName, voucherDiscount };
            orderList[eventId].orders = [];
        }
        orderList[eventId].orders.push(orderDetails);
    }

    orderList = Object.values(orderList);

    return structureResponse(orderList, 1, "Success");
}

const orderFindAllByUser = async (userId, params = {}) => {
    try {
        const orders = await OrderModel.find({ userId, ...params })
            .populate({
                path: 'eventId',
                select: 'imageBackground name _id eventTypeId startTime endTime',
            })
            .populate({
                path: 'tickets.ticketId',
                select: 'seat serialNumber categoryId',
                populate: {
                    path: 'categoryId',
                    model: 'TicketCategory',
                    select: 'name price',
                },
            })
            .populate({
                path: 'voucherId',
                select: 'name discount',
            });

        return orders.map(order => ({
            orderId: order._id,
            userId: order.userId,
            eventId: order.eventId ? order.eventId._id : null,
            eventName: order.eventId ? order.eventId.name : null,
            eventImageBackground: order.eventId ? order.eventId.imageBackground : null,
            eventTypeId: order.eventId ? order.eventId.eventTypeId : null,
            startTime: order.eventId ? order.eventId.startTime : null,
            endTime: order.eventId ? order.eventId.endTime : null,
            voucherName: order.voucherId ? order.voucherId.name : null,
            voucherDiscount: order.voucherId ? order.voucherId.discount : null,
            tickets: order.tickets.map(ticket => ({
                ticketId: ticket.ticketId ? ticket.ticketId._id : null,
                seat: ticket.ticketId ? ticket.ticketId.seat : null,
                serialNumber: ticket.ticketId ? ticket.ticketId.serialNumber : null,
                ticketCategoryName: ticket.ticketId && ticket.ticketId.categoryId ?
                    ticket.ticketId.categoryId.name : null,
                ticketCategoryPrice: ticket.ticketId && ticket.ticketId.categoryId ?
                    ticket.ticketId.categoryId.price : null,
                quantity: ticket.quantity,
            })),
            orderDate: order.orderDate,
            totalPrice: order.totalPrice,
            finalPrice: order.finalPrice,
            state: order.state,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        }));
    } catch (error) {
        console.error("Error fetching orders for user:", error);
        throw error;
    }
};
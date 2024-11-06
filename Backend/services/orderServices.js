const { structureResponse, parseTime } = require('../utils/common.utils');

const OrderModel = require('../models/Order');
const TicketModel = require('../models/Ticket');
const {
    NotFoundException,
    CreateFailedException
} = require('../utils/exceptions/database');
const { default: mongoose } = require('mongoose');

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
            const event_startTime = `${startTime}`;
            const event_endTime = `${endTime}`;
            orderList[eventId].event = { eventId, eventTypeId, event_startTime, event_endTime };
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
                path: 'tickets.ticketCategories.ticketCategoryId',
                select: 'name price',
            })
            .populate({
                path: 'tickets.ticketCategories.ticketDetails.ticketId',
                select: 'seat serialNumber',
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
                ticketCategories: ticket.ticketCategories.map(category => ({
                    ticketCategoryId: category.ticketCategoryId ? category.ticketCategoryId._id : null,
                    ticketCategoryName: category.ticketCategoryId ? category.ticketCategoryId.name : null,
                    ticketCategoryPrice: category.ticketCategoryId ? category.ticketCategoryId.price : null,
                    ticketDetails: category.ticketDetails.map(detail => ({
                        ticketId: detail.ticketId ? detail.ticketId._id : null,
                        seat: detail.ticketId ? detail.ticketId.seat : null,
                        serialNumber: detail.ticketId ? detail.ticketId.serialNumber : null,
                    })),
                })),
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

exports.findAllByEvent = async (id, params = {}) => {
    const seatsList = await orderFindAllByEvent(id, params);

    if (!seatsList.length) {
        throw new NotFoundException('No orders found');
    }

    return structureResponse(seatsList, 1, "Success");
}

const orderFindAllByEvent = async (eventId, params = {}) => {
    try {
        const eventObjectId = new mongoose.Types.ObjectId(eventId);

        const orders = await OrderModel.find({ eventId: eventObjectId, ...params })
            .populate({
                path: 'eventId',
                select: 'name startTime endTime',
            })
            .populate({
                path: 'tickets.ticketCategories.ticketCategoryId',
                select: 'name',
            })
            .populate({
                path: 'tickets.ticketCategories.ticketDetails.ticketId',
                select: 'seat serialNumber',
            });

        // console.log(orders);
        // Collect event information and consolidate tickets into a single list with the order state
        const result = [];
        orders.forEach(order => {
            const eventInfo = order.eventId ? {
                eventName: order.eventId.name,
                startTime: order.eventId.startTime,
                endTime: order.eventId.endTime,
            } : null;

            const seats = [];
            order.tickets.forEach(ticket => {
                ticket.ticketCategories.forEach(category => {
                    category.ticketDetails.forEach(detail => {
                        seats.push({
                            seat: detail.ticketId ? detail.ticketId.seat : null,
                            serialNumber: detail.ticketId ? detail.ticketId.serialNumber : null,
                            ticketCategoryName: category.ticketCategoryId ? category.ticketCategoryId.name : null,
                        });
                    });
                });
            });

            result.push({
                state: order.state,
                event: eventInfo,
                seats,
            });
        });

        return result;
    } catch (error) {
        console.error("Error fetching orders for event:", error);
        throw error;
    }
};

exports.create = async (orderBody) => {
    const ticketIds = [];
    orderBody.tickets.forEach(ticket => {
        ticket.ticketCategories.forEach(category => {
            category.ticketDetails.forEach(detail => {
                ticketIds.push(detail.ticketId);
            });
        });
    });

    const availableTickets = await TicketModel.find({
        _id: { $in: ticketIds },
        state: 'available'
    });

    if (availableTickets.length !== ticketIds.length) {
        throw new CreateFailedException('One or more tickets are not available');
    }

    await TicketModel.updateMany({ _id: { $in: ticketIds } }, { $set: { state: 'reserved' } });

    const result = await OrderModel.create(orderBody);

    if (!result) {
        await TicketModel.updateMany({ _id: { $in: ticketIds } }, { $set: { state: 'available' } });

        throw new CreateFailedException('Order failed to be created');
    }

    return structureResponse(result, 1, 'Order was created!');
};
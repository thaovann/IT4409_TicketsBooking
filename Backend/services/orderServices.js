const { structureResponse, parseTime } = require('../utils/common.utils');

const OrderModel = require('../models/Order');
const TicketModel = require('../models/Ticket');
const VoucherModel = require('../models/Voucher');
const TicketCategoryModel = require('../models/TicketCategory');
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

    let totalPrice = 0;
    for (const ticket of orderBody.tickets) {
        for (const category of ticket.ticketCategories) {
            const ticketCategory = await TicketCategoryModel.findById(category.ticketCategoryId);
            if (!ticketCategory) {
                throw new CreateFailedException(`Ticket category ${category.ticketCategoryId} not found`);
            }
            totalPrice += (ticketCategory.price * ticket.quantity);
            // console.log(totalPrice);
        }
    }

    // Initialize discount-related variables
    let discount = 0;

    if (orderBody.voucherCode) {
        const voucher = await VoucherModel.findOne({ code: orderBody.voucherCode, isActive: true });

        // Check if the voucher exists, is active, and is within the valid date range
        if (!voucher || voucher.startDate > orderBody.orderDate || voucher.endDate < orderBody.orderDate) {
            throw new CreateFailedException('Voucher is invalid or expired');
        }

        // Check if the voucher meets usage limits
        if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
            throw new CreateFailedException('Voucher usage limit has been reached');
        }

        // Check if the total price meets the minimum order value for this voucher
        if (voucher.minOrderValue && totalPrice < voucher.minOrderValue) {
            throw new CreateFailedException(`Order must be at least ${voucher.minOrderValue} to apply this voucher`);
        }

        const user = await UserModel.findOne({ UserId: orderBody.userId, isActive: true });
        // Check user's minimum spending and order count if necessary
        if (voucher.minTotalSpend && user.totalSpend < voucher.minTotalSpend) {
            throw new CreateFailedException(`User must have spent at least ${voucher.minTotalSpend} to use this voucher`);
        }
        if (voucher.minOrderCount && user.orderCount < voucher.minOrderCount) {
            throw new CreateFailedException(`User must have at least ${voucher.minOrderCount} orders to use this voucher`);
        }

        // Apply discount based on discount type
        if (voucher.discountType === 'percentage') {
            discount = totalPrice * (voucher.discountValue / 100);
            // If there's a maximum discount amount, cap the discount
            if (voucher.maxDiscountAmount && discount > voucher.maxDiscountAmount) {
                discount = voucher.maxDiscountAmount;
            }
        } else if (voucher.discountType === 'fixed') {
            discount = voucher.discountValue;
        }
    }

    // Calculate final price with the discount applied
    const calculatedFinalPrice = totalPrice - discount;
    // console.log(calculatedFinalPrice);

    // Verify if the finalPrice in orderBody matches the calculated one
    if (orderBody.finalPrice !== calculatedFinalPrice) {
        throw new CreateFailedException('Final price calculation is incorrect');
    }

    await TicketModel.updateMany({ _id: { $in: ticketIds } }, { $set: { state: 'reserved' } });

    const result = await OrderModel.create(orderBody);

    if (!result) {
        await TicketModel.updateMany({ _id: { $in: ticketIds } }, { $set: { state: 'available' } });

        throw new CreateFailedException('Order failed to be created');
    }

    return structureResponse(result, 1, 'Order was created!');
};

exports.update = async (body, id) => {
    const existingOrder = await OrderModel.findById(id);
    if (!existingOrder) throw new NotFoundException('Order not found');

    const ticketIds = [];
    existingOrder.tickets.forEach(ticket => {
        ticket.ticketCategories.forEach(category => {
            category.ticketDetails.forEach(detail => {
                ticketIds.push(detail.ticketId);
            });
        });
    });

    const updatedOrder = await OrderModel.findByIdAndUpdate(
        id,
        body, { new: true, runValidators: true }
    );
    if (!updatedOrder) throw new UnexpectedException('Something went wrong with updating the order');

    if (body.state === 'successed' && existingOrder.state !== 'successed') {
        await TicketModel.updateMany({ _id: { $in: ticketIds } }, { $set: { state: 'sold' } });

        const userId = existingOrder.userId;
        const totalPrice = existingOrder.totalPrice;

        await UserModel.findOneAndUpdate({ UserId: userId }, {
            $inc: { totalSpend: totalPrice, orderCount: 1 }
        });

        const voucher = await VoucherModel.findOne({ code: existingOrder.voucherCode });

        if (!voucher) {
            throw new CreateFailedException('Voucher is invalid');
        }

        await UserModel.findOneAndUpdate({ UserId: userId }, { $pull: { Vouchers: voucher._id } });
    } else if (body.state === 'cancelled' && existingOrder.state === 'successed') {
        await TicketModel.updateMany({ _id: { $in: ticketIds } }, { $set: { state: 'available' } });

        const userId = existingOrder.userId;
        const totalPrice = existingOrder.totalPrice;

        await UserModel.findOneAndUpdate({ UserId: userId }, {
            $inc: { totalSpend: -totalPrice, orderCount: -1 }
        });
    } else if (body.state === 'cancelled') {
        await TicketModel.updateMany({ _id: { $in: ticketIds } }, { $set: { state: 'available' } });
    }

    return structureResponse(updatedOrder, 1, 'Order updated successfully');
};

exports.del = async (id) => {
    const existingOrder = await OrderModel.findById(id);
    if (!existingOrder) throw new NotFoundException('Order not found');

    const ticketIds = [];
    existingOrder.tickets.forEach(ticket => {
        ticket.ticketCategories.forEach(category => {
            category.ticketDetails.forEach(detail => {
                ticketIds.push(detail.ticketId);
            });
        });
    });

    const result = await OrderModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Order not found');

    await TicketModel.updateMany({ _id: { $in: ticketIds } }, { $set: { state: 'available' } });

    if (existingOrder.state === 'successed') {
        const userId = existingOrder.userId;
        const totalPrice = existingOrder.totalPrice;

        await UserModel.findOneAndUpdate({ UserId: userId }, {
            $inc: { totalSpend: -totalPrice, orderCount: -1 }
        });
    }

    return structureResponse({}, 1, 'Order has been deleted and ticket states have been updated to available');
};
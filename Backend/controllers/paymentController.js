const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
const config = require("../configs/configMomo");
const OrderModel = require("../models/Order");

exports.createPayment = async (req, res) => {
    const { orderId } = req.body;

    try {
        // Lấy thông tin đơn hàng
        const order = await OrderModel.findById(orderId).populate("tickets.ticketCategories.ticketCategoryId");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Tạo payload cho MoMo
        const requestId = `${orderId}-${Date.now()}`;
        const orderInfo = `Thanh toán đơn hàng ${orderId}`;
        const amount = order.finalPrice;

        const rawSignature = [
            `accessKey=${config.accessKey}`,
            `amount=${amount}`,
            `extraData=${config.extraData}`,
            `ipnUrl=${config.ipnUrl}`,
            `orderId=${orderId}`,
            `orderInfo=${orderInfo}`,
            `partnerCode=${config.partnerCode}`,
            `redirectUrl=${config.redirectUrl}`,
            `requestId=${requestId}`,
            `requestType=${config.requestType}`,
        ].join("&");

        const signature = crypto
            .createHmac("sha256", config.secretKey)
            .update(rawSignature)
            .digest("hex");

        const requestBody = {
            partnerCode: config.partnerCode,
            requestId,
            amount,
            orderId,
            orderInfo,
            redirectUrl: config.redirectUrl,
            ipnUrl: config.ipnUrl,
            requestType: config.requestType,
            extraData: config.extraData,
            autoCapture: config.autoCapture,
            lang: config.lang,
            signature,
            paymentTimeout: 900
        };

        // Gửi yêu cầu đến MoMo
        const response = await axios.post(
            "https://test-payment.momo.vn/v2/gateway/api/create",
            requestBody, {
            headers: { "Content-Type": "application/json" },
        }
        );

        if (response.data.resultCode === 0) {
            res.json({ payUrl: response.data.payUrl });
        } else {
            res.status(400).json({ message: "Payment initialization failed", details: response.data });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.callback = async (req, res) => {
    /**
    resultCode = 0: giao dịch thành công.
    resultCode = 9000: giao dịch được cấp quyền (authorization) thành công .
    resultCode <> 0: giao dịch thất bại.
   */
    console.log('callback: ');
    console.log(req.body);

    return res.status(200).json(req.body);
}

exports.checkStatusTransaction = async (req, res) => {
    const { orderId } = req.body;

    try {
        const rawSignature = `accessKey=${config.accessKey}&orderId=${orderId}&partnerCode=${config.partnerCode}&requestId=${orderId}`;
        const signature = crypto
            .createHmac('sha256', config.secretKey)
            .update(rawSignature)
            .digest('hex');

        const requestBody = {
            partnerCode: config.partnerCode,
            requestId: orderId,
            orderId,
            signature,
            lang: config.lang,
        };

        const endpoint = "https://test-payment.momo.vn/v2/gateway/api/query";
        const response = await axios.post(endpoint, requestBody, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = response.data;

        if (!result || result.resultCode === undefined) {
            return res.status(500).json({ message: "Invalid response from MoMo" });
        }

        const order = await OrderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        switch (result.resultCode) {
            case 0: // Giao dịch thành công
                order.state = "successed";
                break;
            case 9000: // Giao dịch đang xử lý
            case 8000: // Đang chờ khách thanh toán
                order.state = "processing";
                break;
            default: // Giao dịch thất bại hoặc bị hủy
                order.state = "cancelled";
                break;
        }

        await order.save(); // Lưu thay đổi vào database

        res.status(200).json({
            message: "Transaction status checked successfully",
            transactionStatus: result,
            orderState: order.state,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Error checking transaction status",
            error: error.message,
        });
    }
}
const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
const config = require("../configs/configMomo");
const configVnpay = require("../configs/configVnpay");
const OrderModel = require("../models/Order");
const moment = require('moment');
const querystring = require("qs");

exports.createPayment = async(req, res) => {
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

exports.callback = async(req, res) => {
    /**
    resultCode = 0: giao dịch thành công.
    resultCode = 9000: giao dịch được cấp quyền (authorization) thành công .
    resultCode <> 0: giao dịch thất bại.
   */
    console.log('callback: ');
    console.log(req.body);

    return res.status(200).json(req.body);
}

exports.checkStatusTransaction = async(req, res) => {
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

exports.createPaymentVnpay = async(req, res, next) => {
    try {
        // Get current date in the required format
        const date = new Date();
        const createDate = moment(date).format("YYYYMMDDHHmmss");

        // Get client's IP address
        const ipAddr =
            req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            (req.connection.socket && req.connection.socket.remoteAddress);

        // Load VNPAY configuration
        const tmnCode = configVnpay.vnp_TmnCode;
        const secretKey = configVnpay.vnp_HashSecret;
        let vnpUrl = configVnpay.vnp_Url;
        const returnUrl = configVnpay.vnp_ReturnUrl;
        const orderId = req.body.orderId;

        // Fetch order details
        const order = await OrderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        const amount = order.finalPrice;
        const currCode = "VND";
        const bankCode = configVnpay.vnp_BankCode;
        const locale = "vn";

        // Construct VNPAY parameters
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        let signData = querystring.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

        // Return the payment URL
        res.json({ payUrl: vnpUrl });
    } catch (error) {
        console.error("Error in createPaymentVnpay:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.vnpayReturn = async(req, res, next) => {
    let vnp_Params = req.query;

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    // delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    const tmnCode = configVnpay.vnp_TmnCode;
    const secretKey = configVnpay.vnp_HashSecret;

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

    if (secureHash === signed) {
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

        res.json({ code: vnp_Params['vnp_ResponseCode'] })
    } else {
        res.json({ code: '97' })
    }
};

// router.get('/vnpay_ipn', function (req, res, next) 
exports.vnpayIPN = async(req, res, next) => {
    try {
        let vnp_Params = req.query;
        const secureHash = vnp_Params["vnp_SecureHash"];
        const orderId = vnp_Params["vnp_TxnRef"];
        const rspCode = vnp_Params["vnp_ResponseCode"];

        // Remove secure hash for validation
        delete vnp_Params["vnp_SecureHash"];

        // Sort the remaining parameters
        vnp_Params = sortObject(vnp_Params);

        // Generate hash from sorted parameters
        const secretKey = configVnpay.vnp_HashSecret;
        const signData = querystring.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", secretKey);
        const signedHash = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

        // Validate secure hash
        if (secureHash !== signedHash) {
            return res.status(400).json({
                message: "Checksum mismatch. Invalid transaction.",
            });
        }

        // Find the order in the database
        const order = await OrderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        // Update order state based on response code
        let message;
        switch (rspCode) {
            case "00":
                order.state = "successed";
                message = "Transaction successful.";
                break;
            case "02":
                order.state = "cancelled";
                message = "Invalid TmnCode. Please verify connection identifier.";
                break;
            case "03":
                order.state = "cancelled";
                message = "Invalid data format.";
                break;
            case "91":
                order.state = "cancelled";
                message = "Transaction not found.";
                break;
            case "94":
                order.state = "cancelled";
                message = "Duplicate request within API time limit.";
                break;
            case "97":
                order.state = "cancelled";
                message = "Invalid checksum.";
                break;
            case "99":
                order.state = "cancelled";
                message = "Other errors (not listed).";
                break;
            default:
                order.state = "cancelled";
                message = "Unknown error code.";
                break;
        }

        // Save the updated order
        await order.save();

        // Respond with transaction details
        res.status(200).json({
            message: message,
            transactionStatus: rspCode,
            orderState: order.state,
        });
    } catch (error) {
        console.error("VNPay IPN Error:", error);
        res.status(500).json({
            message: "Internal server error. Please try again later.",
        });
    }
};

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}
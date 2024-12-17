const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
const config = require("../configs/configMomo");
const configVnpay = require("../configs/configVnpay");
const OrderModel = require("../models/Order");
const moment = require('moment');
const querystring = require("qs");
const { update } = require('../services/orderServices');

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

        let newState;
        switch (result.resultCode) {
            case 0:
                newState = "successed";
                break;
            case 9000:
            case 8000:
                newState = "processing";
                break;
            default:
                newState = "cancelled";
                break;
        }

        // Use the order service to update the state
        const updatedOrder = await update({ state: newState }, orderId);

        res.status(200).json({
            message: "Transaction status checked successfully",
            transactionStatus: result,
            orderState: updatedOrder.body.state,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Error checking transaction status",
            error: error.message,
        });
    }
}

exports.createPaymentVnpay = async (req, res, next) => {
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

// exports.vnpayReturn = async (req, res, next) => {
//     let vnp_Params = req.query;
//     let secureHash = vnp_Params['vnp_SecureHash'];

//     delete vnp_Params['vnp_SecureHash'];
//     delete vnp_Params['vnp_SecureHashType'];

//     vnp_Params = sortObject(vnp_Params);

//     const tmnCode = configVnpay.vnp_TmnCode;
//     const secretKey = configVnpay.vnp_HashSecret;

//     let signData = querystring.stringify(vnp_Params, { encode: false });
//     let hmac = crypto.createHmac("sha512", secretKey);
//     let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

//     if (secureHash === signed) {
//         // Gọi IPN endpoint với form-urlencoded và tạo lại SecureHash
//         try {
//             const ipnResponse = await axios.post(
//                 configVnpay.vnp_IpnUrl,
//                 querystring.stringify(vnp_Params), {
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded'
//                 }
//             }
//             );
//             console.log('IPN Response:', ipnResponse.data);

//             // Trả về kết quả cho client
//             res.json({
//                 code: vnp_Params['vnp_ResponseCode'],
//                 ipnResult: ipnResponse.data
//             });
//         } catch (error) {
//             console.error('Error calling IPN:', error);
//             res.json({
//                 code: vnp_Params['vnp_ResponseCode'],
//                 ipnError: 'Failed to process IPN notification'
//             });
//         }
//     } else {
//         res.json({ code: '97' });
//     }
// };
exports.vnpayReturn = async (req, res, next) => {
  let vnp_Params = req.query;
  let secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  const tmnCode = configVnpay.vnp_TmnCode;
  const secretKey = configVnpay.vnp_HashSecret;

  let signData = querystring.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    try {
      const ipnResponse = await axios.post(
        configVnpay.vnp_IpnUrl,
        querystring.stringify(vnp_Params),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log("IPN Response:", ipnResponse.data);

      // Chuyển hướng đến trang payment success
      res.redirect("https://phamanhtuan2908.id.vn/payment-success");
    } catch (error) {
      console.error("Error calling IPN:", error);
      // Trong trường hợp lỗi, vẫn chuyển hướng nhưng có thể thêm query param để hiển thị thông báo
      res.redirect("https://phamanhtuan2908.id.vn/payment-success?error=true");
    }
  } else {
    // Trong trường hợp xác thực thất bại
    res.redirect("https://phamanhtuan2908.id.vn/payment-success?error=true");
  }
};

// Cập nhật lại hàm vnpayIPN để xử lý cả form-urlencoded
exports.vnpayIPN = async (req, res, next) => {
    try {
        console.log("VNPay IPN Called:", {
            query: req.query,
            body: req.body,
            method: req.method
        });

        let vnp_Params = req.body;
        const orderId = vnp_Params["vnp_TxnRef"];
        const rspCode = vnp_Params["vnp_ResponseCode"];

        const order = await OrderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        let newState;
        let message;
        switch (rspCode) {
            case "00":
                newState = "successed";
                message = "Transaction successful.";
                break;
            case "02":
            case "03":
            case "91":
            case "94":
            case "97":
            case "99":
                newState = "cancelled";
                message = "Transaction failed or cancelled.";
                break;
            default:
                newState = "cancelled";
                message = "Unknown error code.";
                break;
        }

        // Use the order service to update the state
        const updatedOrder = await update({ state: newState }, orderId);

        res.status(200).json({
            message: message,
            transactionStatus: rspCode,
            orderState: updatedOrder.body.state,
        });
    } catch (error) {
        console.error("VNPay IPN Error:", error);
        res.status(200).json({
            RspCode: "99",
            Message: "Unknown error"
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
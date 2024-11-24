// middleware/errorHandler.js
module.exports = (err, req, res, next) => {
    console.error(err); // Log lỗi (tùy chọn)

    // Đảm bảo lỗi được trả về dưới dạng JSON
    res.status(err.status || 500).json({
        success: 0,
        error: err.name || "InternalServerError",
        code: err.code || "INTERNAL_SERVER_ERROR",
        message: err.message || "Đã xảy ra lỗi không mong muốn",
        data: err.data || null,
    });
};
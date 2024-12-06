const { ErrorStatusCodes } = require("../errorStatusCodes");
const { ErrorCodes } = require("../errorCodes");
const { Config } = require("../../configs/config");

class AuthException extends Error {
    constructor(code, message, data, status = 401) {
        super(message);
        if (Config.NODE_ENV === "dev") this.message = "Auth Error: " + message;
        else this.message = message;
        this.name = "Auth Error";
        this.code = code;
        this.error = this.constructor.name;
        this.status = status;
        this.data = data;
    }
}

class UnauthorizedException extends AuthException {
    constructor(message = 'Người dùng không có quyền thực hiện hành động này', data) {
        super(ErrorCodes.UnauthorizedException, message, data);
    }
}

class TokenMissingException extends AuthException {
    constructor(message = "Truy cập bị từ chối. Không có thông tin xác thực token được gửi", data) {
        super(ErrorCodes.TokenMissingException, message, data);
    }
}

class TokenVerificationException extends AuthException {
    constructor(message = "Xác thực thất bại", data) {
        super(ErrorCodes.TokenVerificationException, message, data);
    }
}

class TokenExpiredException extends AuthException {
    constructor(message = "JWT đã hết hạn", data) {
        super(ErrorCodes.TokenExpiredException, message, data);
    }
}

class OTPGenerationException extends AuthException {
    constructor(message = "Kết quả tạo OTP thất bại", data) {
        super(ErrorCodes.OTPGenerationException, message, data);
    }
}

class OTPExpiredException extends AuthException {
    constructor(message = "OTP đã hết hạn", data) {
        super(ErrorCodes.OTPExpiredException, message, data);
    }
}

class OTPVerificationException extends AuthException {
    constructor(message = "Xác thực OTP thất bại", data) {
        super(ErrorCodes.OTPVerificationException, message, data);
    }
}

class InvalidCredentialsException extends AuthException {
    constructor(message, data) {
        super(ErrorCodes.InvalidCredentialsException, message, data);
    }
}

class ValidationException extends AuthException {
    constructor(message, data) {
        super(ErrorCodes.ValidationException, message, data);
    }
}

class RegistrationFailedException extends AuthException {
    constructor(message = "Người dùng đăng ký thất bại", data) {
        super(ErrorCodes.RegistrationFailedException, message, data, ErrorStatusCodes.RegistrationFailedException);
    }
}

module.exports = {
    TokenMissingException,
    InvalidCredentialsException,
    TokenVerificationException,
    TokenExpiredException,
    UnauthorizedException,
    RegistrationFailedException,
    OTPExpiredException,
    OTPGenerationException,
    OTPVerificationException,
    ValidationException
};
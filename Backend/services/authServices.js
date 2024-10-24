const { structureResponse, hashPassword } = require('../utils/common.utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require('../utils/sendgrid');
const otpGenerator = require('otp-generator');
const { Config } = require('../configs/config');

const UserModel = require('../models/User');
const OTPModel = require('../models/OTP');
const {
    RegistrationFailedException,
    InvalidCredentialsException,
    TokenVerificationException,
    OTPExpiredException,
    OTPGenerationException,
    OTPVerificationException
} = require('../utils/exceptions/auth');

// const {
//     NotFoundException,
//     UpdateFailedException,
//     UnexpectedException
// } = require('../utils/exceptions/database.exception');

exports.registerUser = async (body) => {
    const pass = body.Password;

    await hashPassword(body);

    const result = await UserModel.create(body);

    if (!result) {
        throw new RegistrationFailedException();
    }

    return this.userLogin(body.Email, pass, true);
};

exports.userLogin = async (Email, Password, is_register = false) => {
    const user = await UserModel.findOne({ Email });

    if (!user) {
        throw new InvalidCredentialsException('Email not registered');
    }

    const isMatch = await bcrypt.compare(Password, user.Password);

    if (!isMatch) {
        throw new InvalidCredentialsException('Incorrect Password');
    }

    // user matched!
    const secretKey = Config.JWT_SECRET;
    const token = jwt.sign({ UserId: user.UserId.toString() }, secretKey, {
        expiresIn: '24h'
    });

    let message = "";
    let responseBody = "";
    if (is_register){ // if registered first
        const { UserId } = user;
        message = "Registered"; // set msg to registered
        responseBody = { UserId, token };
    } else {
        user.Password = undefined;
        message = "Authenticated";
        responseBody = { ...user, token };
    }
    return structureResponse(responseBody, 1, message);
};

exports.refreshToken = async (body) => {
    const { Email, Password, oldToken } = body;
    const user = await UserModel.findOne({ Email });
    if (!user) {
        throw new InvalidCredentialsException('Email not registered');
    }

    const isMatch = await bcrypt.compare(Password, user.Password);

    if (!isMatch) {
        throw new InvalidCredentialsException('Incorrect Password');
    }
    
    // user matched!
    const secretKey = Config.JWT_SECRET;
    const { UserId } = jwt.decode(oldToken);
    
    if (user.UserId.toString() !== UserId){
        throw new TokenVerificationException();
    }
    
    const token = jwt.sign({ UserId: user.UserId.toString() }, secretKey, {
        expiresIn: '24h'
    });

    return structureResponse({ token }, 1, "Refreshed");
};

exports.forgotPassword = async (body) => {
    let user = await UserModel.findOne(body); // body contains "Email" : ...
    
    if (!user) {
        throw new InvalidCredentialsException('Email not registered');
    }
    
    await removeExpiredOTP(user.UserId);

    const OTP = await generateOTP(user.UserId, body.Email);

    sendOTPEmail(user, OTP);

    return structureResponse({}, 1, 'OTP generated and sent via Email');
}

generateOTP = async (UserId, Email) => {
    const OTP = `${otpGenerator.generate(4, { 
        digits: true, 
        alphabets: false, 
        upperCase: false, 
        specialChars: false 
    })}`;

    const OTPHash = await bcrypt.hash(OTP, 8);

    let ExpirationDatetime = new Date();
    ExpirationDatetime.setHours(ExpirationDatetime.getHours() + 1);

    const body = {UserId, Email, OTP: OTPHash, ExpirationDatetime};

    const result = await OTPModel.create(body);

    if (!result) throw new OTPGenerationException();

    return OTP;
}

removeExpiredOTP = async (UserId) => {
    const result = await OTPModel.findOne({UserId});

    if (result) { // if found, delete
        const affectedRows = await OTPModel.deleteOne({UserId});

        if (!affectedRows) {
            throw new OTPGenerationException('Expired OTP could not be deleted');
        }
    }
}

exports.verifyOTP = async (body) => {
    const {OTP, Email} = body;
    let result = await OTPModel.findOne({Email});

    if (!result) {
        throw new OTPVerificationException();
    }

    const {ExpirationDatetime, OTP: OTPHash} = result;

    if (ExpirationDatetime < new Date()) {
        throw new OTPExpiredException();
    }

    const isMatch = await bcrypt.compare(OTP, OTPHash);

    if (!isMatch) {
        throw new OTPVerificationException();
    }

    result = await OTPModel.delete({Email});

    if (!result) {
        throw new OTPVerificationException('Old OTP failed to be deleted');
    }

    return structureResponse({}, 1, 'OTP verified succesfully');
}

// changePassword = async (body) => {
//     const { Email, Password, new_Password } = body;
//     const user = await UserModel.findOne({ Email: Email });

//     if (!user) {
//         throw new NotFoundException('User not found');
//     }

//     const isMatch = await bcrypt.compare(Password, user.Password);

//     if (!isMatch) {
//         throw new InvalidCredentialsException('Incorrect old Password');
//     }

//     let responseBody = { Email: Email, Password: new_Password };

//     return this.resetPassword(responseBody);
// };

// resetPassword = async (body) => {
//     await hashPassword(body);

//     const { Password, Email } = body;

//     const result = await UserModel.update({Password}, {Email});

//     if (!result) {
//         throw new UnexpectedException('Something went wrong');
//     }

//     const { affectedRows, changedRows, info } = result;

//     if (!affectedRows) throw new NotFoundException('User not found');
//     else if (affectedRows && !changedRows) throw new UpdateFailedException('Password change failed');
    
//     return structureResponse(info, 1, 'Password changed successfully');
// }
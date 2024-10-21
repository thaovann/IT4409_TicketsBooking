const sgMail = require('@sendgrid/mail');
const { Config } = require('../configs/config');
const { OTPGenerationException } = require('../utils/exceptions/auth');

sgMail.setApiKey(Config.SENDGRID_API_KEY);

exports.sendOTPEmail = (user, OTP) => {
    const msg = {
        to: user.Email, // Change to your recipient
        from: Config.SENDGRID_SENDER, // Change to your verified sender
        subject: 'TicketBox Password Reset',
        templateId: 'd-e27ea1f7d8ad4326b21054898ef05aa8',
        dynamic_template_data: {FullName: user.FullName, OTP}
    };

    sgMail.send(msg, (err, result) => {
        if (err) {
            console.log(err);
            throw new OTPGenerationException(err.message);
        }
    });
};
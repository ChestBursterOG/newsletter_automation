const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_PROVIDER_HOST_ADDRESS,
    port: process.env.EMAIL_PROVIDER_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_ACCOUNT_USER,
        pass: process.env.EMAIL_ACCOUNT_PASSWORD
    }
});

module.exports = {transporter}
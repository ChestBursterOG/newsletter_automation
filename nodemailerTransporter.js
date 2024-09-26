const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: "465",
    secure: true,
    auth: {
        user: "raf.szuwalski@gmail.com",
        pass: "OPgg584f6jJ"
    }
});

module.exports = {transporter}
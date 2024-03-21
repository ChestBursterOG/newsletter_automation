const { v4: uuidv4 } = require('uuid');
const { pobierzListeOdbiorcow } = require('../downloadReceiverLists');
const { transporter } = require('../nodemailerTransporter');
const log = require('./log');

async function sendEmail(req, res) {
    try {
        log('Wysyłanie wiadomości...');
        const { subject, html } = req.body;

        const id = uuidv4();

        const recipients = await pobierzListeOdbiorcow();

        for (const recipient of recipients) {
            try {
                const mailOptions = {
                    from: 'fundacja@polskiecentrumsi.pl',
                    to: recipient,
                    subject,
                    html
                };

                const info = await transporter.sendMail(mailOptions);
                log('E-mail został wysłany do ' + recipient + ': ' + info.response);
                
            } catch (error) {
                log('Wystąpił błąd podczas wysyłania wiadomości do ' + recipient + ':', error);
                continue;
            }
        }

        log('Wiadomość została zaplanowana i wysłana.');

        res.status(200).json({ message: 'Wiadomość została zaplanowana do wysłania.' });
        
    } catch (error) {
        log('Wystąpił błąd podczas planowania wysłania wiadomości:', error);
        res.status(500).json({ message: 'Wystąpił błąd podczas planowania wysłania wiadomości.' });
    }
}

module.exports = {sendEmail};
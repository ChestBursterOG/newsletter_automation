const cron = require('node-cron');
const { v4: uuidv4 } = require('uuid');
const { pobierzListeOdbiorcow } = require('../downloadReceiverLists');
const { transporter } = require('../nodemailerTransporter');
const { addScheduledEmail, removeScheduledEmail } = require('../scheduledEmailsList');
const { getDate, getTime } = require('../getTime');
const log = require('../log');

async function scheduleEmail(req, res) {
    log('Planowanie wiadomości...');
    try {
        const { subject, html, date, time } = req.body;

        if (!date || !time) {
            return res.status(400).json({ message: 'Brak daty lub godziny wysyłki.' });
        }

        const cronDateTime = `${time.split(':')[1]} ${time.split(':')[0]} ${date.split('-')[2]} ${date.split('-')[1]} *`;

        const id = uuidv4();
        cron.schedule(cronDateTime, async () => {
            try {
                const recipients = await pobierzListeOdbiorcow();

                for (const recipient of recipients) {
                    try {
                        const mailOptions = {
                            from: process.env.EMAIL_ACCOUNT_USER,
                            to: recipient,
                            subject,
                            html
                        };

                        const info = await transporter.sendMail(mailOptions);
                        log('E-mail został wysłany do ' + recipient + ': ' + info.response);

                    } catch (error) {
                        log('Wystąpił błąd podczas wysyłania wiadomości do ' + recipient + ':' + error);
                        continue;
                    }
                }
                removeScheduledEmail(id);
                log('Wiadomości została wysłane.');
            } catch (error) {
                log('Wystąpił błąd podczas wysyłania wiadomości zaplanowanej:' + error);
            }
        }, {
            scheduled: true,
            timezone: 'Europe/Warsaw' 
        });


        const currentDate = new Date();

        res.status(200).json({ message: 'Wiadomość została zaplanowana do wysłania.' });
        await addScheduledEmail({ id: id, subject: subject, date: date, time: time, setTime: getTime(), setDate: getDate() });

    } catch (error) {
        log('Wystąpił błąd podczas planowania wysłania wiadomości:' + error);
        res.status(500).json({ message: 'Wystąpił błąd podczas planowania wysłania wiadomości.' });
    }
}

module.exports = { scheduleEmail };

const multer = require('multer');
const cron = require('node-cron');
const { v4: uuidv4 } = require('uuid');
const { upload } = require('../multerStorage');
const { pobierzListeOdbiorcow } = require('../downloadReceiverLists');
const { transporter } = require('../nodemailerTransporter');
const { addScheduledEmail, removeScheduledEmail } = require('../scheduledEmailsList');

const log = require('../log');

function scheduleEmailWithAttachments(req, res) {
    log('Planowanie wiadomości z załącznikami...');
    upload.any('files')(req, res, async (err) => {
        try {
            if (err instanceof multer.MulterError) {
                log('Multer error:', err);
                return res.status(400).send('Multer error');
            } else if (err) {
                log('Other error:', err);
                return res.status(500).send('Other error');
            }

            const { subject, html, date, time } = req.body;
            const files = req.files;
    
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
                                from: 'fundacja@polskiecentrumsi.pl',
                                to: recipient,
                                subject,
                                html,
                                attachments: files.map(file => ({
                                    filename: file.originalname,
                                    path: file.path
                                }))
                            };
    
                            const info = await transporter.sendMail(mailOptions);
                            log('E-mail został wysłany do ' + recipient + ': ' + info.response);
                            
                        } catch (error) {
                            log('Wystąpił błąd podczas wysyłania wiadomości do ' + recipient + ':' +  error);
                            continue;
                        }
                    }
                    removeScheduledEmail(id);
                    log('Wiadomość została zaplanowana i wysłana.');
                } catch (error) {
                    log('Wystąpił błąd podczas wysyłania wiadomości zaplanowanej:' + error);
                }
            }, {
                scheduled: true,
                timezone: 'Europe/Paris'
            });
    
            res.status(200).json({ message: 'Wiadomość została zaplanowana do wysłania.' });
            await addScheduledEmail({ id: id, subject: subject, date: date, time: time });
            
        } catch (error) {
            log('Wystąpił błąd podczas planowania wysłania wiadomości:' + error);
            res.status(500).json({ message: 'Wystąpił błąd podczas planowania wysłania wiadomości.' });
        }
    });
    
}

module.exports = {scheduleEmailWithAttachments};
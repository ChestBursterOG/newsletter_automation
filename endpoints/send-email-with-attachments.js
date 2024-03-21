const multer = require('multer');
const { upload } = require('../multerStorage');
const { pobierzListeOdbiorcow } = require('../downloadReceiverLists');
const { transporter } = require('../nodemailerTransporter');
const log = require('../log');

function sendEmailWithAttachments(req, res) {
    log('Wysyłanie wiadomości z załącznikami...');
    upload.any('files')(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            log('Multer error:' + err);
            return res.status(400).send('Multer error');
        } else if (err) {
            log('Other error:' + err);
            return res.status(500).send('Other error');
        }
    
        const { subject, html } = req.body;
        const files = req.files;
    
        const recipients = await pobierzListeOdbiorcow();
    
        for (const recipient of recipients) {
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
    
            try {
                const info = await transporter.sendMail(mailOptions);
                log('E-mail został wysłany do ' + recipient + ': ' + info.response);
            } catch (error) {
                log('Wystąpił błąd podczas wysyłania e-maila do ' + recipient + ':' + error);
                continue;
            }
        }
        log('Wiadomości zostały wysłane');
        res.status(200).json({ message: 'E-mail został pomyślnie wysłany z załącznikami.' });
    });
}

module.exports = {sendEmailWithAttachments};
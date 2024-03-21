const { getScheduledEmails } = require('../scheduledEmailsList');
const log = require('../log');

function getScheduledEmailsHandler(req, res) {
    try {
        const scheduledEmails = getScheduledEmails();
        res.status(200).json(scheduledEmails);
    } catch (error) {
        log('Wystąpił błąd podczas pobierania zaplanowanych wiadomości:' + error);
        res.status(500).json({ message: 'Wystąpił błąd podczas pobierania zaplanowanych wiadomości.' });
    }
}

module.exports = {getScheduledEmailsHandler};
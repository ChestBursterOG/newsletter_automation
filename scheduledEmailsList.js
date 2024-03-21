let scheduledEmails = [];

function addScheduledEmail(email) {
    scheduledEmails.push(email);
}

function removeScheduledEmail(emailId) {
    scheduledEmails = scheduledEmails.filter(email => email.id !== emailId);
}

function getScheduledEmails() {
    return scheduledEmails;
}

module.exports = {
    addScheduledEmail,
    removeScheduledEmail,
    getScheduledEmails
};
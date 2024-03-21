const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const log = require('./log');


const { getScheduledEmailsHandler } = require('./endpoints/scheduled-emails');
const { sendEmail } = require('./endpoints/send-email');
const { scheduleEmail } = require('./endpoints/schedule-email');
const { sendEmailWithAttachments } = require('./endpoints/send-email-with-attachments');
const { scheduleEmailWithAttachments } = require('./endpoints/schedule-email-with-attachment');

require('dotenv').config();


const app = express();
const port = process.env.SERVER_PORT || 3001;

app.use(cors());

app.use(bodyParser.json());


app.post('/send-email', sendEmail);
app.post('/schedule-email', scheduleEmail);
app.post('/send-email-with-attachments', sendEmailWithAttachments);
app.post('/schedule-email-with-attachment', scheduleEmailWithAttachments);
app.get('/scheduled-emails', getScheduledEmailsHandler);


app.listen(port, () => {
    log(`Serwer nasłuchuje na porcie ${port}`);
})


const nodemailer = require('nodemailer');
const {GMAIL_HOST, GMAIL_USER_EMAIL, GMAIL_PASS} = require('./envirment-variable');

const mailSender = nodemailer.createTransport({
service: 'gmail',
auth: {
    user: GMAIL_USER_EMAIL,
    pass: GMAIL_PASS,
  },
});

module.exports = mailSender;
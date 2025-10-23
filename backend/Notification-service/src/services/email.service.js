const {TicketRepository} = require('../repositories');
const {MailSender} = require('../config');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');

const { flightConfirmationTemplate} = require("../utils/helpers/flightConfirmationTemplate")

const ticketRepository = new TicketRepository();
async function sendEmail(mailFrom, mailTo, subject, body) {
  
    //call the templete function here to get the html content
    const htmlContent = flightConfirmationTemplate(body);

   
    
  try {
      const response = await MailSender.sendMail({
          to: mailTo,
          from: mailFrom,
          subject,
          html: htmlContent,
      });

      if(!response) {
        throw new Error('Email not sent');
      }

      return response;

  } catch (error) {
    if(error instanceof Error) {
      throw error;
    }

    throw AppError(error.message,StatusCodes.INTERNAL_SERVER_ERROR)
  }

}


async function createTicket(data) {
    try {
        const ticket = await ticketRepository.create({
            subject: data.subject,
            content: data.content,
            recepientEmail: data.recepientEmail,
        });
        if(!ticket) {
            throw new Error('Ticket not created');
        }
        return ticket;
    } catch (error) {
        if(error instanceof Error) {
            throw error;
        }
        throw AppError(error.message,StatusCodes.INTERNAL_SERVER_ERROR)
    }
}


async function  getPendingEmails(params) {
    try {
        const emails = await ticketRepository.getPendingEmails(params);
        if(!emails) {
            throw new Error('No pending emails found');
        }
        return emails;
    } catch (error) {
        if(error instanceof Error) {
            throw error;
        }
        throw AppError(error.message,StatusCodes.INTERNAL_SERVER_ERROR)
    }
}


module.exports = {
    sendEmail,
    createTicket,
    getPendingEmails
}

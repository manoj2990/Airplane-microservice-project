const { EmailService } = require('../services');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const { SuccessResponse } = require('../utils/common');



async function createEmail(req, res) {
    try {
        const email = await EmailService.createTicket({
            // mailFrom: req.body.mailFrom,
            subject: req.body.subject,
            content: req.body.body,
            recepientEmail: req.body.mailTo,
        });
        if(!email) {
            throw new Error('Email not created');
        }

        SuccessResponse.data = email;
        SuccessResponse.message = 'Email created successfully';
        return res
        .status(StatusCodes.CREATED)
        .json(SuccessResponse)

    } catch (error) {
        if(error instanceof Error) {
            throw error;
        }
        throw AppError(error.message,error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function getPendingEmails(req, res, next) {
    try {
        const emails = await EmailService.getPendingEmails();
        if(!emails) {
            throw new Error('No pending emails found');
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Pending emails fetched successfully',
            data: emails,
        })
    } catch (error) {
        if(error instanceof Error) {
            throw error;
        }
        throw AppError(error.message,StatusCodes.INTERNAL_SERVER_ERROR)
    }
}


module.exports = {
    createEmail,
    getPendingEmails,
}

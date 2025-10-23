const { StatusCodes } = require('http-status-codes');
const { BookingService } = require('../services');
const {WINDOW_SIZE_IN_HOURS} = require("../config/envirment-variable");
const { SuccessResponse, ErrorResponse } = require('../utils/common');
const {checkIfPaid} = require('../utils/common/');
const {RedisServer} = require("../config");

async function createBooking(req, res) {
    console.log(`entring into createbooking controller -->`,req.body,req.user)
    try {
      
        const booking = await BookingService.createBooking({
            flightId :req.body.flightId,
            userId : req.body.userId,
            noOfSeats : req.body.noOfSeats,
            seatIds : req.body.seatIds,
        });
        

        SuccessResponse.data = booking;
        
        return res
        .status(StatusCodes.CREATED)
        .json(SuccessResponse);

    } catch (error) {
        console.log(`error in createBooking controller -->`,error)
         ErrorResponse.error = {
            StatusCodes: error.statusCode,
            message: error.message,
         }
         
        
         return res
            .status(error.statusCode)
            .json(ErrorResponse)
    
    }
}



async function makePayment(req, res) {
    try {
        const userInfo = req.headers['x-user-info'] ? JSON.parse(req.headers['x-user-info']) : undefined;
       
        const idempotencykey = req.headers['x-idempotency-key'];

        if (!idempotencykey) {
            ErrorResponse.error = {
                StatusCodes: StatusCodes.BAD_REQUEST,
                message: 'Idempotency key is required',
            }
            return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse);
        }

        const alreadyPaid = await checkIfPaid(idempotencykey);
        if (alreadyPaid) {
            ErrorResponse.error = {
                StatusCodes: StatusCodes.BAD_REQUEST,
                message: 'Payment already made for this idempotency key',
            }
            return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse);
        }
        
        const payment = await BookingService.makePayment({
            userId: req.body.userId,
            userName: userInfo.name,
            userEmail: userInfo.email,
            bookingId: req.body.bookingId,
            totalCost: req.body.payment,
            seatIds: JSON.parse(req.body.seatIds),
        });

        
        if (!payment) {
            ErrorResponse.error = {
                StatusCodes: StatusCodes.BAD_REQUEST,
                message: 'Payment failed',
            }
            return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse);
        }

        await RedisServer.set(`key-${idempotencykey}`, idempotencykey);
        await RedisServer.expire(`key-${idempotencykey}`, 10 * 60);

        SuccessResponse.data = payment;
        return res
        .status(StatusCodes.CREATED)
        .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = {
            message: error.message,
        }
        return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse);
    }
}


module.exports = {
    createBooking,
    makePayment
}

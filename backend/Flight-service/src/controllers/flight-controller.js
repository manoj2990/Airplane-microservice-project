const { StatusCodes } = require('http-status-codes');
const {FlightService} = require('../services')
const { SuccessResponse, ErrorResponse } = require('../utils/common');

 


/** 
 * @route POST /flights
 * @reqBody {Object}{
 *  flightNumber: String,
 *  airplaneId: Number,
 *  departureAirportId: Number,
 *  arrivalAirportId: Number,
 *  departureTime: Date,
 *  arrivalTime: Date,
 *  price: Number,
 *  boardingGate: String,
 *  totalSeats: Number,
 * }
 * @returns {Object} - JSON response containing the created flight
 */

async function createFlight(req,res) {
    try {
        const flight = await FlightService.createFlight({
            flightNumber: req.body.flightNumber,
            airplaneId: req.body.airplaneId,
            departureAirportId: req.body.departureAirportId,
            arrivalAirportId: req.body.arrivalAirportId,
            departureTime: req.body.departureTime,
            arrivalTime: req.body.arrivalTime,
            price: req.body.price,
            boardingGate: req.body.boardingGate,
            totalSeats: req.body.totalSeats,
        })

        SuccessResponse.data = flight;

        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse)


    } catch (error) {
        ErrorResponse.error = error

        return res  
            .status(error.statusCode)
            .json(ErrorResponse)
    }
    
}


async function getFlight(req, res) {
    try {
        console.log("Getting flight with ID:", req.params.id);
        const response = await FlightService.getFlight(req.params.id);
        SuccessResponse.data = response;
        console.log("res at controller -->",response)
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse)
    } catch (error) {
        console.log("error -->",error)
        ErrorResponse.error = error
        return res
            .status(error.statusCode)
            .json(ErrorResponse)
    }
}


async function getcompleteFlightDetail(req, res) {
    try {
        
        const response = await FlightService.getcompleteFlightDetail(req.params.id,req.body.seatIds);
        SuccessResponse.data = response;
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse)
    }
}

/**
 * @routes POST /flight/:id
 * @param id 
 * @returns {Object} - JSON response containing the message
 */
async function deleteFlight(req, res) {
    
    try {
        const response = await FlightService.deleteFlight(req.params.id)

        SuccessResponse.data = response
        return res  
            .status(StatusCodes.OK)
            .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error
        return res
            .status(error.statusCode)
            .json(ErrorResponse)
    }
}

/**
 * @routes GET /flights
 * @returns {Object} - JSON response containing the flights
 */
async function getAllFilterFlights(req, res) {
  console.log("req.quary --->", req.query)
    try {
        const response = await FlightService.getAllFilterFlights(req.query);
        SuccessResponse.data = response;
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error
        return res
            .status(error.statusCode)
            .json(ErrorResponse)
    }
}

/**
 * @routes PATCH /flights/:id
 * @param id 
 * @returns {Object} - JSON response containing the updated flight
 */
async function updateFlight(req, res) {
    try {
        console.log("Updating flight with ID:", req.params.id,);
        const response = await FlightService.updateFlight(req.params.id, req.body);
        console.log("Flight updated:", response);

        // SuccessResponse.data = response;
          return res.status(StatusCodes.OK).json({
      success: true,
      message: "Flight updated successfully",
      data: response,
    });
    } catch (error) {

        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to update flight",
      error,
    });
    }
}


/**
 * @routes PATCH /flights/:id/seats
 * @param id 
 * @returns {Object} - JSON response containing the updated flight
 */
async function updateSeats(req, res) {
    
    try {
        const response = await FlightService.updateSeats(req.params.id, req.body.seats, req.body.decrement);
        SuccessResponse.data = response;
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error
        return res
            .status(error.statusCode)
            .json(ErrorResponse)
    }
}


async function getSeatId(req, res) {
    // req.body.seatno = ["A-1","A-5","B-3"]
   
    try {
        const response = await FlightService.getSeatId(req.body.seatno);
        SuccessResponse.data = response;
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error
        return res
            .status(error.statusCode)
            .json(ErrorResponse)
    }
}







module.exports = {
    createFlight,
    deleteFlight,
    getAllFilterFlights,
    updateFlight,
    getFlight,
    updateSeats,
    getcompleteFlightDetail,
    getSeatId
}

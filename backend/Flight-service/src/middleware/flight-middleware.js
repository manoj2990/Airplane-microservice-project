const {StatusCodes} = require('http-status-codes');
const {ErrorResponse} = require("../utils/common/index");
const ApiError = require('../utils/errors/app-error');
const { configDotenv } = require('dotenv');


function flightValidation(req, res, next) {
  const requiredFields = [
    "flightNumber",
    "airplaneId",
    "departureAirportId",
    "arrivalAirportId",
    "departureTime",
    "arrivalTime",
    "price",
    "boardingGate",
    "totalSeats",
  ];

  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    return next(
      new ApiError(
        StatusCodes.BAD_REQUEST,
        `Missing required fields: ${missingFields.join(", ")}`
      )
    );
  }



  next();
}



function updateSeatsValidation(req, res, next) {
 
  if(!req.params.id){
 
    ErrorResponse.message = "Missing required fields: flightId"
    ErrorResponse.error =  new ApiError(["FlightId value need to provide"], StatusCodes.BAD_REQUEST)

    return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse)
  }
  if(!req.body.seats){
    ErrorResponse.message = "Missing required fields: seats"
    ErrorResponse.error =  new ApiError(["Seats value need to provide"], StatusCodes.BAD_REQUEST)

    return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse)
  }

  // if(!req.body.decrement){
  //   ErrorResponse.message = "Missing required fields: decrement"
  //   ErrorResponse.error =  new ApiError(["Decrement value need to provide", StatusCodes.BAD_REQUEST])

  //   return res
  //           .status(StatusCodes.BAD_REQUEST)
  //           .json(ErrorResponse)
  // }

  next();
}


function validateInternalSecret(req, res, next) {


if(req.headers['x-internal-secret'] === undefined){
 

    ErrorResponse.message = "Unauthorized Access to Flight Service"
    ErrorResponse.error = new ApiError(
      ["Unauthorized Access to Flight Service"], 
      StatusCodes.UNAUTHORIZED
    )
    return res.status(StatusCodes.UNAUTHORIZED).json(ErrorResponse);
  }



  if(req.headers['x-internal-secret'] == process.env.API_GATEWAY_INTERNAL_SECRET){
    console.log("Internal secret is valid");
    next();
    }  

     ErrorResponse.message = "Unauthorized Access to Flight Service"
    ErrorResponse.error = new ApiError(
      ["Unauthorized Access to Flight Service"], 
      StatusCodes.UNAUTHORIZED
    )

    
    return res.status(StatusCodes.UNAUTHORIZED).json(ErrorResponse);

    
  }


module.exports = {
  flightValidation,
  updateSeatsValidation,
  validateInternalSecret
};

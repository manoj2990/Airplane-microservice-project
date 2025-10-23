
const { StatusCodes } = require('http-status-codes');
const {FlightRepository} = require('../repositories')
const ApiError = require('../utils/errors/app-error');
const {compareDates} = require('../utils/helpers/datetime-helpers');

const {Op} = require('sequelize');

const flightRepository = new FlightRepository();

async function createFlight(data) {
    try {
        const {arrivalTime, departureTime} = data;
        
        if(!compareDates(arrivalTime, departureTime)){
            throw new ApiError("Arrival time must be before departure time", StatusCodes.BAD_REQUEST);
        }

        const flight = await flightRepository.create(data);
        return flight;
    } catch (error) {

      if(error.name ==  'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError'){
            let explanation = []
            error.errors.forEach( (e)=>{
                explanation.push(e.message);
            })
            throw new ApiError(explanation, StatusCodes.BAD_REQUEST);
        }
       throw new ApiError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    
}
}


async function getFlight(flightId) {
    try {
        const flight = await flightRepository.get(flightId);
        if(!flight){
            throw new ApiError("Flight not found", StatusCodes.NOT_FOUND);
        }
        return flight;
    } catch (error) {

        if(error instanceof ApiError){
            throw error;
        }

        if(error.name ==  'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError'){
            let explanation = []
            error.errors.forEach( (e)=>{
                explanation.push(e.message);
            })
            throw new ApiError(explanation, StatusCodes.BAD_REQUEST);
        }

        throw new ApiError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function getcompleteFlightDetail(flightId,seatIds) {
    try {
        
        const flight = await flightRepository.getcompleteFlightDetail(flightId,seatIds);
        if(!flight){
            throw new ApiError("Flight not found", StatusCodes.NOT_FOUND);
        }

        // const seats = await flightRepository.getSeats(seatIds);
        // if(!seats){
        //     throw new ApiError("Seats not found", StatusCodes.NOT_FOUND);
        // }
        
        return flight;
    } catch (error) {

        if(error instanceof ApiError){
            throw error;
        }

        if(error.name ==  'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError'){
            let explanation = []
            error.errors.forEach( (e)=>{
                explanation.push(e.message);
            })
            throw new ApiError(explanation, StatusCodes.BAD_REQUEST);
        }

        throw new ApiError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}



async function getAllFilterFlights(quary){
     let filter ={};
    let sortingFliter = [];

        if(quary.trip){
          const [departureAirportId,arrivalAirportId] = quary.trip.split("-");
           
            if(!departureAirportId || !arrivalAirportId){
                throw new ApiError("departure and arrival airport id are required", StatusCodes.BAD_REQUEST);
            }

          if( departureAirportId === arrivalAirportId ){
            throw new ApiError("Depart and Arrival Airport must be different", StatusCodes.BAD_REQUEST);
          }

          filter.departureAirportId = departureAirportId;
          filter.arrivalAirportId = arrivalAirportId;
        }

        if(quary.price){
            const [min,max] = quary.price.split("-");
            
            filter.price = {
             [Op.between]: [min,(max === undefined ? 20000 : max)]
            }
        }
          
        //no of persone
        if(quary.travelers){
            filter.totalSeats = {
                [Op.gte]: quary.travelers
            }
        }

        if(quary.date){
            filter.departureTime = { //2024-08-12T00:00:00Z - 2024-08-12T23:59:00Z
                [Op.between]:[quary.date, quary.date + "T23:59:00Z"]
            }
        }


        if(quary.sort){
            // arrivalTime_ASC,price_DESC.split(,) --> [arrivalTime_ASC,price_DESC]
            array = quary.sort.split(",");
            array.forEach( (e)=>{
               const [field,sortOrder] = e.split("_"); //["arrivalTime","ASC"]
               sortingFliter.push([field,sortOrder]) // [["arrivalTime","ASC"],["price","DESC"]]
            })
        }


        
    try {
        const response = await flightRepository.getFilterFlights(filter,sortingFliter);
        
        if(!response.length){
            throw new ApiError("No Flights found with the given filter", StatusCodes.NOT_FOUND);
        }
         
        return response;
    } catch (error) {

        if(error instanceof ApiError){
            throw error;
        }
         
        throw new ApiError("Faild to fetch all filter Flights", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}



async function deleteFlight(id) {

    try {
        const response = await flightRepository.destroy(id)
        return response
    } catch (error) {
        throw new ApiError("Requested flight not fount to delete",StatusCodes.NOT_FOUND)
    }
}


async function updateFlight(id,data) {
    try {
        const response = await flightRepository.update(id,data);
        if (response == 0){
         
            throw new ApiError("No flight found to update", StatusCodes.NOT_FOUND);
        }
        return response

    } catch (error) {
        if(error instanceof ApiError){
            throw error;
        }
        throw new ApiError("Faild to update flight", StatusCodes.INTERNAL_SERVER_ERROR);

    }
}


async function updateSeats(flightId,seats, decrement ){
    try {
        const response = await flightRepository.updateSeats(flightId,seats, decrement);
        if (response == 0){
         
            throw new ApiError("No flight found to update", StatusCodes.NOT_FOUND);
        }
        return response

    } catch (error) {
       
        if(error instanceof ApiError){
            throw error;
        }
        throw new ApiError("Faild to update flight", StatusCodes.INTERNAL_SERVER_ERROR);

    }
}


    module.exports = {
    createFlight,
    deleteFlight,
    getAllFilterFlights,
    updateFlight,
    getFlight,
    updateSeats,
    getcompleteFlightDetail
}
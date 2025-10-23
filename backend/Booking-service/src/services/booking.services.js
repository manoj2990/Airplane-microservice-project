const ApiError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");
const db = require("../models")
const axios = require("axios");


const {TIME_OUT} = require("../config/envirment-variable"); 
const {Enums} = require('../utils/common');
const { BOOKED, CANCELLED } = Enums.BookingStatus;
const { Queue } = require("../config/index.js");


const { FLIGHT_SERVICE_URL } = require("../config/envirment-variable");
const { BookingRepository } = require("../repositories/index.js");

const bookingRepository = new BookingRepository();

const {SeatBooking, User} = require("../models")


 function aggregateData(Data,bookingDetails,flightDetails) {

const departureDateObject = new Date(flightDetails.departureTime);
const departureYear = departureDateObject.getUTCFullYear();
const departureMonth = departureDateObject.getUTCMonth() + 1; // Months are 0-indexed
const departureDay = departureDateObject.getUTCDate();
const departureHours = departureDateObject.getUTCHours();
const departureMinutes = departureDateObject.getUTCMinutes();

const arrivalDateObject = new Date(flightDetails.arrivalTime);
const arrivalYear = arrivalDateObject.getUTCFullYear();
const arrivalMonth = arrivalDateObject.getUTCMonth() + 1; // Months are 0-indexed
const arrivalDay = arrivalDateObject.getUTCDate();
const arrivalHours = arrivalDateObject.getUTCHours();
const arrivalMinutes = arrivalDateObject.getUTCMinutes();

const seats = flightDetails.seats.map((seat) => ({ seatId:`${seat.row}${seat.column}`, classType:`${seat.type}` }));


    const data =  {
        passengerName : Data.userName,
        bookingReference :bookingDetails.id,
        departureAirportName : flightDetails.departureAirport.name,
        departureAirportCode : flightDetails.departureAirportId,
        arrivalAirportName : flightDetails.arrivalAirport.name,
        arrivalAirportCode : flightDetails.arrivalAirportId,
        departureDate : `${departureYear}-${departureMonth.toString().padStart(2, '0')}-${departureDay.toString().padStart(2, '0')}`,
        departureTime : `${departureHours.toString().padStart(2, '0')}:${departureMinutes.toString().padStart(2, '0')}`,
        arrivalDate : `${arrivalYear}-${arrivalMonth.toString().padStart(2, '0')}-${arrivalDay.toString().padStart(2, '0')}`,
        arrivalTime : `${arrivalHours.toString().padStart(2, '0')}:${arrivalMinutes.toString().padStart(2, '0')}`,
        flightNumber : flightDetails.flightNumber,
        airlineName : flightDetails.airplaneDetails.modelNumber,
        seatNumbers : seats,
    }
   
    return data;
}



async function createBooking(data) {
console.log(`entring into createbooking -->`,data)

try {

     const booking = await db.sequelize.transaction(async t => { 

        const flight = await axios.get(`${FLIGHT_SERVICE_URL}/flights/${data.flightId}`);
     
        if(!flight){
            throw new ApiError("Error while fetching flight", StatusCodes.BAD_REQUEST);
        }

        if(flight.data.data.totalSeats < data.noOfSeats){
            throw new ApiError("All seats are sold out", StatusCodes.BAD_REQUEST);
        }
        
        
        //   const response = await Booking.create(
        //     {
        //         userId: data.userId,
        //         flightId: data.flightId,
        //         noOfSeats: data.noOfSeats,
        //         totalCost: flight.data.data.price * data.noOfSeats,
        //     },{transaction: t});

        const response = await bookingRepository.createBooking({
            userId: data.userId,
            flightId: data.flightId,
            noOfSeats: data.noOfSeats,
            totalCost: flight.data.data.price * data.noOfSeats,
        },t);

         const seatIds = data.seatIds || []; // frontend must send seat IDs
      for (const seatId of seatIds) {
      
       const res = await SeatBooking.create({
          userId: data.userId,
          flightId: data.flightId,
          seatId,
          bookingId: response.id,
        }, { transaction: t });

        if(!res){
            throw new ApiError("seat already booked", StatusCodes.BAD_REQUEST);
        }
      }

      
        await axios.patch(`${FLIGHT_SERVICE_URL}/flights/${data.flightId}/seats`, {
            seats: data.noOfSeats , decrement:true
        })
        
        

    return response;
     }
     )

     console.log(`<-------flight data ------->`,booking)
    return booking;


} catch (error) {
    console.log(error)
    if(error instanceof ApiError){
      throw error;
    }

    if(error.name === "SequelizeUniqueConstraintError"){
        throw new ApiError("Seat already booked", StatusCodes.BAD_REQUEST);
    }
  
    throw new ApiError(["Error while creating booking"], StatusCodes.INTERNAL_SERVER_ERROR);
    
}
}





async function makePayment(data) {
    const transaction = await db.sequelize.transaction();
    try {
    
       
        const bookingDetails = await bookingRepository.getbookingDetails(data.bookingId, transaction);
      
        if(bookingDetails.status == CANCELLED) {
            throw new ApiError('Booking is already cancelled', StatusCodes.BAD_REQUEST);
        }

        const bookingTime = new Date(bookingDetails.createdAt);
        const currentTime = new Date();
       
        if(currentTime - bookingTime > TIME_OUT) {
         
            await cancelBooking(data.bookingId, transaction);
            throw new ApiError('The booking has expired', StatusCodes.BAD_REQUEST);
        }

        if(bookingDetails.totalCost != data.totalCost) {
         
            throw new ApiError('The amount of the payment doesnt match', StatusCodes.BAD_REQUEST);
        }

        if(bookingDetails.userId != data.userId) {
          
            throw new ApiError('The user corresponding to the booking doesnt match', StatusCodes.BAD_REQUEST);
        }

        // Payment successful
       
        await bookingRepository.updateBookingStatus({id: data.bookingId, status: BOOKED}, transaction);

        const flightDetails = await axios.post(`${FLIGHT_SERVICE_URL}/flights/details/${bookingDetails.flightId}`,{
            seatIds: data.seatIds,
        });
        if(!flightDetails){
            throw new ApiError("Error while fetching flight", StatusCodes.BAD_REQUEST);
        }
        
  
        // Send email with proper user email and formatted content

        const finalData = aggregateData(data,bookingDetails, flightDetails.data.data);
       
        await Queue.sendMessageToQueue({
            recepientEmail: data.userEmail,
            subject: 'Flight Booking Confirmed - Your E-Ticket',
            content: finalData,
        });

        await transaction.commit();
                    return true;
    } catch(error) {
        await transaction.rollback();
        if(error instanceof ApiError) {
           
            throw error;
        }
     
        throw new ApiError("Error while making payment", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}






async function cancelBooking( bookingId,t){
try {
    const bookingDetails = await bookingRepository.getbookingDetails(bookingId, t);

    if(bookingDetails.status == CANCELLED){

        return true
    }

     await axios.patch(`${FLIGHT_SERVICE_URL}/flights/${bookingDetails.flightId}/seats`, {
        seats: bookingDetails.noOfSeats , decrement: false
    })

    await bookingRepository.updateBookingStatus({id: bookingId, status: CANCELLED}, t);
    return true;

} catch (error) {
    console.log(error)
    // await t.rollback();
    throw new ApiError("Error while cancelling booking", StatusCodes.INTERNAL_SERVER_ERROR);
}
}


async function  cancelOldBookings() {
    try {
        const time = new Date(Date.now() - TIME_OUT); //300000

        const res = await bookingRepository.cancelOldBookings(time)

        if(!res){
           
            throw new ApiError("Error while cancelling old bookings", StatusCodes.INTERNAL_SERVER_ERROR);
        }

        return res;
    } catch (error) {
        throw new ApiError("Error while cancelling old bookings", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createBooking,
    makePayment,
    cancelOldBookings
}

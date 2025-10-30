
const express = require('express');
const router = express.Router();
const {FlightMiddlewares} = require('../../middleware')
const {FlightController} = require('../../controllers')



//  POST --> http://localhost:3000/api/v1/flights -> protected route
router.post('/',
    FlightMiddlewares.validateInternalSecret,
    FlightMiddlewares.flightValidation,
    FlightController.createFlight
)

//GET -->  http://localhost:3000/api/v1/flights/:id
router.get('/:id',
    FlightController.getFlight
)
  
//POST -->  http://localhost:3000/api/v1/flights/details/:id
router.post('/details/:id',
    FlightController.getcompleteFlightDetail
)

//DELETE --> http://localhost:3000/api/v1/flights/:id -> protected route
router.delete('/:id',
    FlightMiddlewares.validateInternalSecret,
    FlightController.deleteFlight
)

//GET --> http://localhost:3000/api/v1/flights
router.get('/',
    FlightController.getAllFilterFlights
)

//PATCH -->  http://localhost:3000/api/v1/flights/:id -> protected route
router.patch('/:id',
    FlightMiddlewares.validateInternalSecret,
    FlightController.updateFlight
)


//GET --> http://localhost:3000/api/v1/flights/:id/seatid
router.get('/:id/seats',
    FlightController.getSeatId
)

//PATCH -->  http://localhost:3000/api/v1/flights/:id/seats 
router.patch('/:id/seats',
    FlightMiddlewares.updateSeatsValidation,
    FlightController.updateSeats
)
 


module.exports = router;


const express = require('express');
const router = express.Router();
const {FlightMiddlewares} = require('../../middleware')
const {FlightController} = require('../../controllers')



//  POST --> http://localhost:3000/api/v1/flights
router.post('/',
    FlightMiddlewares.flightValidation,
    FlightController.createFlight
)

//GET -->  http://localhost:3000/api/v1/flights/:id
router.get('/:id',
    FlightController.getFlight
)

//GET -->  http://localhost:3000/api/v1/flights/:id
router.post('/details/:id',
    FlightController.getcompleteFlightDetail
)

//DELETE --> http://localhost:3000/api/v1/flights/:id
router.delete('/:id',
    FlightController.deleteFlight
)

//GET --> http://localhost:3000/api/v1/flights
router.get('/',
    FlightController.getAllFilterFlights
)

//PATCH -->  http://localhost:3000/api/v1/flights/:id
router.patch('/:id',
    FlightController.updateFlight
)

//PATCH -->  http://localhost:3000/api/v1/flights/:id/seats
router.patch('/:id/seats',
    FlightMiddlewares.updateSeatsValidation,
    FlightController.updateSeats
)



module.exports = router;

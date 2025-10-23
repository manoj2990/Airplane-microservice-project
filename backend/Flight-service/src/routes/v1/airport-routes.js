
const express = require('express');

const {AirportController} = require('../../controllers') 
const {AirportMiddlewares} = require('../../middleware')

const router = express.Router();


// POST -> http://localhost:3000/api/v1/airports
router.post('/',
        AirportMiddlewares.validateCreateReq,
        AirportController.createAirport
)

//GET -> http://localhost:3000/api/v1/airports
router.get('/',
   AirportController.getAirports
)

//GET -> http://localhost:3000/api/v1/airports/:id
router.get('/:id',
    AirportController.getAirport
)

//DELETE -> http://localhost:3000/api/v1/airports/:id
router.delete('/:id',
    AirportController.deleteAirport
)


// PATCH -> http://localhost:3000/api/v1/airports/:id
router.patch('/:id',
   AirportController.updateAirport
)





module.exports = router;
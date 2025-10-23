const express = require('express');

const {AirplaneController} = require("../../controllers/index")
const {AirplaneMiddlewares}     = require('../../middleware/index');      


const router = express.Router();


// POST -> http://localhost:3000/api/v1/airplanes ->controller
router.post('/',
     AirplaneMiddlewares.airplaneValidator,
        AirplaneController.createAirplane
)

//GET -> http://localhost:3000/api/v1/airplanes-> controller
router.get('/',
    AirplaneController.getAirplanes
)

//GET -> http://localhost:3000/api/v1/airplanes/:id
router.get('/:id',
    AirplaneController.getAirplane
)

//DELETE -> http://localhost:3000/api/v1/airplanes/:id
router.delete('/:id',
    AirplaneController.deleteAirplane
)


// PATCH -> http://localhost:3000/api/v1/airplanes/:id
router.patch('/:id',
    AirplaneController.updateAirplane
)





module.exports = router;
const express = require('express');



const AirplaneRoutes = require("./airplane-routes");
const CityRoutes = require('./city-routes')
const AirportRoutes = require('./airport-routes')
const FlightRoutes = require('./flight-routes')

const router = express.Router();

router.get('/info',(req,res) => {
      throw new Error("Simulated crash");
    res.send("Welcome to flight service")
})


// http://localhost:3000/api/v1/airplanes
router.use('/airplanes', AirplaneRoutes);

// http://localhost:3000/api/v1/city
router.use('/cities',CityRoutes)

// http://localhost:3000/api/v1/airports
router.use('/airports',AirportRoutes )


// http://localhost:3000/api/v1/flights
router.use('/flights',FlightRoutes)



module.exports = router;
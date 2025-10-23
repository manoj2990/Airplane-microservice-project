const { Router } = require("express");
const router = Router();


const BookingRoutes = require("./booking.routes");


router.get('/info', (req, res) => {

  
  return res.status(200).json({ 
  
    message: 'Welcome to booking service' });
});


router.use('/bookings', BookingRoutes);

module.exports = router;

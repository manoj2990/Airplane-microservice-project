
const {Router} = require("express");
const router = Router();

const {BookingController} = require('../../controllers');

router.post('/create', BookingController.createBooking);
router.post('/make-payment', BookingController.makePayment);
router.get('/:flightId', BookingController.getSeatMap);

module.exports = router;



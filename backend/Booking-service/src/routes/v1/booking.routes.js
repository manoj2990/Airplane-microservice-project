
const {Router} = require("express");
const router = Router();

const {BookingController} = require('../../controllers');

router.post('/create', BookingController.createBooking);
router.post('/make-payment', BookingController.makePayment);


module.exports = router;



const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    API_GATEWAY_INTERNAL_SECRET: process.env.API_GATEWAY_INTERNAL_SECRET,
    BOOKING_SERVICE_URL: process.env.BOOKING_SERVICE_URL,
}
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    FLIGHT_SERVICE_URL: process.env.FLIGHT_SERVICE_URL,
    TIME_OUT: process.env.TIME_OUT,
    REDIS_URL: process.env.REDIS_URL,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    WINDOW_SIZE_IN_HOURS: process.env.WINDOW_SIZE_IN_HOURS,
    QUEUE_NAME: process.env.QUEUE_NAME,
    RABBITMQ_URL: process.env.RABBITMQ_URL
}
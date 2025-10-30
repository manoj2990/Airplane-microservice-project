const { configDotenv } = require("dotenv");
configDotenv();

module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  SALT_ROUNDS: process.env.SALT_ROUNDS,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  REDIS_URL: process.env.REDIS_URL,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_PORT: process.env.REDIS_PORT,
  FLIGHT_SERVICE_URL: process.env.FLIGHT_SERVICE_URL,
  BOOKING_SERVICE_URL: process.env.BOOKING_SERVICE_URL,
  TIMEOUT: process.env.TIMEOUT,
  PROXY_TIMEOUT: process.env.PROXY_TIMEOUT,
  API_GATEWAY_INTERNAL_SECRET: process.env.API_GATEWAY_INTERNAL_SECRET,
};



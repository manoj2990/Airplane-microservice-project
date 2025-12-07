const { configDotenv } = require("dotenv");
configDotenv();

const DATABASE_CREDENTIALS = {
  localhost: {
    username: process.env.LOCALHOST_DB_USER,
    password: process.env.LOCALHOST_DB_PASSWORD,
    database: process.env.LOCALHOST_DB_NAME,
    host: process.env.LOCALHOST_DB_HOST,
    dialect: process.env.LOCALHOST_DB_DIALECT,
    port: process.env.LOCALHOST_DB_PORT,
  },
  docker: {
    username: process.env.DOCKER_DB_USER,
    password: process.env.DOCKER_DB_PASSWORD,
    database: process.env.DOCKER_DB_NAME,
    host: process.env.DOCKER_DB_HOST,
    dialect: process.env.DOCKER_DB_DIALECT,
    port: process.env.DOCKER_DB_PORT,
  },
  cloud: {
    username: process.env.CLOUD_DB_USER,
    password: process.env.CLOUD_DB_PASSWORD,
    database: process.env.CLOUD_DB_NAME,
    host: process.env.CLOUD_DB_HOST,
    dialect: process.env.CLOUD_DB_DIALECT,
    port: process.env.CLOUD_DB_PORT,
  },
};

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
  DATABASE_CREDENTIALS,
};
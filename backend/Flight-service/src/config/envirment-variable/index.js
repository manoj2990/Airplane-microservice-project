const dotenv = require('dotenv');

dotenv.config();

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
    PORT: process.env.PORT,
    API_GATEWAY_INTERNAL_SECRET: process.env.API_GATEWAY_INTERNAL_SECRET,
    BOOKING_SERVICE_URL: process.env.BOOKING_SERVICE_URL,
     DATABASE_CREDENTIALS,
}
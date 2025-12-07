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
    FLIGHT_SERVICE_URL: process.env.FLIGHT_SERVICE_URL,
    TIME_OUT: process.env.TIME_OUT,
    REDIS_URL: process.env.REDIS_URL,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    WINDOW_SIZE_IN_HOURS: process.env.WINDOW_SIZE_IN_HOURS,
    QUEUE_NAME: process.env.QUEUE_NAME,
    RABBITMQ_URL: process.env.RABBITMQ_URL,
     DATABASE_CREDENTIALS,
}
const { configDotenv } = require("dotenv");
configDotenv();

module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  GMAIL_HOST: process.env.GMAIL_HOST,
  GMAIL_USER_EMAIL: process.env.GMAIL_USER_EMAIL,
  GMAIL_PASS: process.env.GMAIL_PASS,
  QUEUE_NAME: process.env.QUEUE_NAME,
  RABBITMQ_URL: process.env.RABBITMQ_URL,
};



require("dotenv").config();
const { DATABASE_CREDENTIALS } = require("./envirment-variable");

module.exports = {
  development: {
    username: DATABASE_CREDENTIALS.localhost.username,
    password: DATABASE_CREDENTIALS.localhost.password,
    database: DATABASE_CREDENTIALS.localhost.database,
    host: DATABASE_CREDENTIALS.localhost.host,
    dialect: DATABASE_CREDENTIALS.localhost.dialect,
    port: DATABASE_CREDENTIALS.localhost.port,
  },

  docker: {
    username: DATABASE_CREDENTIALS.docker.username,
    password: DATABASE_CREDENTIALS.docker.password,
    database: DATABASE_CREDENTIALS.docker.database,
    host: DATABASE_CREDENTIALS.docker.host,
    dialect: DATABASE_CREDENTIALS.docker.dialect,
    port: DATABASE_CREDENTIALS.docker.port,
  },

  cloud: {
    username: DATABASE_CREDENTIALS.cloud.username,
    password: DATABASE_CREDENTIALS.cloud.password,
    database: DATABASE_CREDENTIALS.cloud.database,
    host: DATABASE_CREDENTIALS.cloud.host,       
    dialect: DATABASE_CREDENTIALS.cloud.dialect,
    port: DATABASE_CREDENTIALS.cloud.port,
  },
};

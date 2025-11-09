
const redis = require('ioredis');
const {REDIS_URL, REDIS_PORT, REDIS_PASSWORD} = require("../config/envirment-variable");

const redisServer = new redis({
 host: REDIS_URL,     
  port: REDIS_PORT,    
  password: REDIS_PASSWORD,
})


module.exports = redisServer;


const redis = require('ioredis');
const {REDIS_URL, REDIS_PORT, REDIS_PASSWORD} = require("../config/envirment-variable");

const redisServer = new redis({
 host: REDIS_URL,     // e.g. redis-xxxxx.c123.us-east-1-2.ec2.cloud.redislabs.com
  port: REDIS_PORT,    // e.g. 12345
  password: REDIS_PASSWORD,
})


module.exports = redisServer;

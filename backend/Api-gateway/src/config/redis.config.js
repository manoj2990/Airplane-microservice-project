const redis = require('ioredis');
const {REDIS_URL, REDIS_PORT, REDIS_PASSWORD} = require("./envirment-variable/index.js");
 console.log("🔥 Redis confog triggered -------->");
const redisServer = new redis({
 host: REDIS_URL,     
  port: REDIS_PORT,   
  password: REDIS_PASSWORD,
})

console.log("leaving redis config ---->")

module.exports = redisServer;

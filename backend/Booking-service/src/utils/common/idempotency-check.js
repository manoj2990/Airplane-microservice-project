
const {RedisServer} = require("../../config");

async function checkIfPaid(idempotencykey) {
const resp = await RedisServer.get(`key-${idempotencykey}`);
return resp;
}


module.exports = checkIfPaid;
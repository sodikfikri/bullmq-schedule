const IORedis = require('ioredis')

const REDIS_PORT = process.env.REDIS_PORT
const REDIS_HOST = process.env.REDIS_HOST

const conn =  new IORedis({
    port: REDIS_PORT,
    host: REDIS_HOST,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
}) 


module.exports = conn
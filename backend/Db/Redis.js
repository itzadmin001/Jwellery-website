const { Redis } = require("ioredis")



const redis = new Redis({
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    port: process.env.REDIS_PORT
})





redis.on("connect", () => {


    console.log("connect to redis")
})

module.exports = redis
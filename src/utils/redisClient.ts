import * as Redis from 'ioredis'

let redisClient = null

if (process.env.NODE_ENV !== 'test') {
    redisClient = new Redis({ host: '127.0.0.1' })
}

export default redisClient

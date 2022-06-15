import redisClient from './redisClient'

/**
 *  Set Online user with their socketID
 *
 * @param socketId 
 * @param userId 
 * @param expired || a key to expire in the future (24hrs=86400sec)
 */
export const setOnlineSocketUser = (socketId: string, userId: string, expired= 86400) => {
    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV === 'test') { resolve('') } else {
            redisClient.set(`socket_id_${userId}`,socketId,"EX", expired)
                .then(setKey => resolve(setKey))
                .catch(err => reject(err))
        }
    })
}

/**
 *  Remove an online user with their socket ID
 *
 * @param socketId
 * @param userId
 */
export const removeOnlineSocketUser = (socketId: string, userId: string) => {
    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV === 'test') { resolve('') } else {
            redisClient.remove(`socket_id_${userId}`, socketId)
                .then(removeKey => resolve(removeKey))
                .catch(err => reject(err))
        }
    })
}

/**
 * Get Online user socketId by its userId
 * @param userId 
 */
export const getSocketUser =  (userId: string) => {
    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV === 'test') { resolve('') } else {
            redisClient.get(`socket_id_${userId}`)
                .then((socketKey) => resolve(socketKey))
                .catch(err => reject(err))
        }
    })
}

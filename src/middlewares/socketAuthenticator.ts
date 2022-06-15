import * as JWT from 'jsonwebtoken'
import { ERR005_NOT_AUTHENTICATED } from '../errors/types'
import { BaseError } from '../errors'


/**
 * Middleware to authenticate socket
 *
 * @param req
 * @param res
 * @param next
 */
export const socketAuthenticator = (socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token){
        JWT.verify(socket.handshake.auth.token,  process.env.JWT_SECRET, (err, decoded) => {
        if (err) return next(new BaseError(ERR005_NOT_AUTHENTICATED));
        socket.user = decoded;
        next();
      });
    }
    else {
        next(new BaseError(ERR005_NOT_AUTHENTICATED));
    }    
}

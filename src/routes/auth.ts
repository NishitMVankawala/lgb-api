import { check } from 'express-validator'
import { requestValidator } from '../middlewares/errorHandler'
import {
    loginUser,
    recoverUserPassword,
    requestUserPasswordReset,
    registerUser,
    loginUserPhone
} from '../controllers/auth'
import { JWTToken } from '../interfaces/auth'
import { NotificationResetPassword } from '../events/notifyAdminResetPassword'
import { NotificationEventTypes } from '../events'
import { filterKeys as UserFilterKeys } from '../models/user'
import { filterObject } from '../utils/stringUtils'
import streamClient from '../utils/streamUtil'


/**
 * Express route for authenticating a user token
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const authenticate = async (req, res, next) => {
    try {
        let userRole = req.user.role
        const userObject = req.user.toObject()

        const admins = process.env.ADMINS ? process.env.ADMINS.split(',') : []
        if (admins.indexOf(req.user.email) !== -1) {
            userRole = 'super-admin'
        }

        const streamToken = await streamClient.createUserToken(req.user._id.toString())

        try {
            await streamClient.user(userObject._id).update({
                name: userObject.fullName, profileImage: userObject.thumbnailImageUrl,
                coverImageUrl: userObject.coverImageUrl
            })
        } catch (err) {
        }

        res.json({ ...userObject, role: userRole, password: undefined, streamToken })
    } catch (error) {
        next(error)
    }
}

/**
 * Express route for logging in a user
 *
 * @param req Request from Express
 * @param res Response from Express
 */
export const loginMiddleware = [
    check('email').not().isEmpty(),
    check('password').not().isEmpty(),
    requestValidator
]
export const login = (req, res, next) => {
    const email = req.body.email.toLowerCase()
    const password = req.body.password

    loginUser(email, password)
        .then((jwtToken: JWTToken) => res.json(jwtToken))
        .catch((error: any) => next(error))
}

/**
 * Express route for registering a user
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const registerMiddleware = [
    check('email').not().isEmpty(),
    check('password').not().isEmpty(),
    requestValidator
]

export const register = (req, res, next) => {
    const userData = filterObject(req.body, [ ...UserFilterKeys, 'password' ])

    console.log('register user data', userData)

    registerUser(userData)
        .then((jwtToken: JWTToken) => res.json(jwtToken))
        .catch((error) => next(error))
}

/**
 * Express route for logging in a user
 *
 * @param req Request from Express
 * @param res Response from Express
 */
export const loginPhoneMiddleware = [
    check('phoneNumberCountryCode').not().isEmpty(),
    check('phoneNumber').not().isEmpty(),
    check('password').not().isEmpty(),
    requestValidator
]
export const loginPhone = (req, res, next) => {
    const phoneNumberCountryCode = req.body.phoneNumberCountryCode
    const phoneNumber = req.body.phoneNumber
    const password = req.body.password

    loginUserPhone(phoneNumberCountryCode, phoneNumber, password)
        .then((jwtToken: JWTToken) => res.json(jwtToken))
        .catch((error: any) => next(error))
}


/**
 * Express route for requesting a password reset
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const forgotMiddleware = [
    check('email').not().isEmpty(),
    requestValidator
]

export const forgot = (req, res, next) => {
    const email = req.body.email

    requestUserPasswordReset(email)
        .then(response => {
            res.end()

            const notification: NotificationResetPassword = {
                name: '', email, token: response.token,
                link: `${process.env.WEB_BASE_URL}/forgot-password?token=${response.token}&email=${email}`
            }

            res.app.emit(NotificationEventTypes.NOTIFY_ADMIN_RESET_PASSWORD, notification)
        }).catch((error) => next(error))
}

/**
 * Express route for recovering a password
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const recoverMiddleware = [
    check('token').not().isEmpty(),
    check('password').not().isEmpty(),
    requestValidator
]

export const recover = (req, res, next) => {
    const password = req.body.password
    const token = req.body.token

    recoverUserPassword(token, password)
        .then(response => res.json(response))
        .catch((error) => next(error))
}
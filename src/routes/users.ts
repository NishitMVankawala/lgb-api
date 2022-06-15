import {
	fetchAllUsers,
	createUser,
	fetchUser,
	removeUser,
	updateUser
} from '../controllers/users'
import { requestValidator } from '../middlewares/errorHandler'
import { filterKeys, validationKeys, updatedFilterKeys } from '../models/user'
import { filterObject } from '../utils/stringUtils'

/**
 * Express admin route for listing all users
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const adminIndex = (req, res, next) => {
	fetchAllUsers()
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}

/**
 * Express admin route for fetching a single user
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const adminFetch = (req, res, next) => {
	const userId = req.params.userId

	fetchUser(userId)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}

/**
 * Express admin route for creating a new user
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const createMiddleware  = [ ...validationKeys, requestValidator ]
export const adminCreate = (req, res, next) => {
	const data = filterObject(req.body, filterKeys)
	
	createUser(data)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}

/**
 * Express admin route for updating a user
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const updateMiddleware  = [ ...validationKeys, requestValidator ]
export const adminUpdate = (req, res, next) => {
	const userId = req.params.userId
	const data = filterObject(req.body, updatedFilterKeys)

	updateUser(userId, data)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}

/**
 * Express admin route for removing a user
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const adminRemove = (req, res, next) => {
	const userId = req.params.userId

	removeUser(userId)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}



/**
 * Express chat route for listing all users
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const chatUsers = (req, res, next) => {
	fetchAllUsers()
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}
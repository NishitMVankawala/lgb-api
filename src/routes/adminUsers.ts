import {
	fetchAllAdminUsers,
	createAdminUser,
	fetchAdminUser,
	removeAdminUser,
	updateAdminUser
} from '../controllers/adminUsers'
import { requestValidator } from '../middlewares/errorHandler'
import { filterKeys, validationKeys } from '../models/adminUser'
import { filterObject } from '../utils/stringUtils'

/**
 * Express admin route for listing all admin-users
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const adminIndex = (req, res, next) => {
	fetchAllAdminUsers()
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}

/**
 * Express admin route for fetching a single admin-user
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const adminFetch = (req, res, next) => {
	const userId = req.params.userId

	fetchAdminUser(userId)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}

/**
 * Express admin route for creating a new admin-user
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const createMiddleware  = [ ...validationKeys, requestValidator ]
export const adminCreate = (req, res, next) => {
	const data = filterObject(req.body, filterKeys)
	
	createAdminUser(data)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}

/**
 * Express admin route for updating a admin-user
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const updateMiddleware  = [ ...validationKeys, requestValidator ]
export const adminUpdate = (req, res, next) => {
	const userId = req.params.userId
	const data = filterObject(req.body, filterKeys)

	updateAdminUser(userId, data)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}

/**
 * Express admin route for removing a admin-user
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const adminRemove = (req, res, next) => {
	const userId = req.params.userId

	removeAdminUser(userId)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}
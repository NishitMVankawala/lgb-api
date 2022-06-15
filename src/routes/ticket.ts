import { requestValidator } from '../middlewares/errorHandler'
import {adminUpdateTicket,
    adminFetchTicket,
    adminRemoveTicket, 
    createTicket, 
    fetchSingleTicket, 
    fetchTicket } from '../controllers/ticket'
import {filterKeys, validationKeys} from '../models/ticket'
import {filterObject} from '../utils/stringUtils'


/**
 * Express route for fetch all self tickets
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const index = (req, res, next) => {
    const email = req.user.email
	fetchTicket(email)
		.then(jobPost => res.json(jobPost))
		.catch(error => next(error))
}

/**
 * Express route for self create ticket
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */

export const createTicketMiddleware = [...validationKeys,
	requestValidator
]
export const create = (req, res, next) => {
	const data = filterObject(req.body, filterKeys)

	createTicket(data)
		.then(jobPost => res.json(jobPost))
		.catch(error => next(error))
}


/**
 * Express route for fetch self single ticket
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const fetch = (req, res, next) => {
    const ticketId = req.params.ticketId
    const email = req.user.email

	fetchSingleTicket(ticketId, email)
		.then(jobPost => res.json(jobPost))
		.catch(error => next(error))
}


/**
 * Express route for admin update ticket
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */

export const updateTicketMiddleware = [...validationKeys,
	requestValidator
]
export const adminUpdate = (req, res, next) => {
	const data = filterObject(req.body, filterKeys)
    const ticketId = req.params.ticketId

	adminUpdateTicket(ticketId, data)
		.then(jobPost => res.json(jobPost))
		.catch(error => next(error))
}


/**
 * Express route for admin remove ticket
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const adminRemove = (req, res, next) => {
    const ticketId = req.params.ticketId

	adminRemoveTicket(ticketId)
		.then(jobPost => res.json(jobPost))
		.catch(error => next(error))
}


/**
 * Express route for admin fetch all tickets
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const adminIndex = (req, res, next) => {
	adminFetchTicket()
		.then(jobPost => res.json(jobPost))
		.catch(error => next(error))
}
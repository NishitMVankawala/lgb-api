import { check } from 'express-validator'
import {
	createMessage,
	conversationMessage,
	fetchConversations,
	searchConversationParticipants, createConversation
} from '../controllers/message'
import { requestValidator } from '../middlewares/errorHandler'
import { filterObject } from '../utils/stringUtils'

/**
 * Express route for fetch conversations
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const index = (req, res, next) => {
	const from = req.user.id

	fetchConversations(from)
		.then(response => {
			res.json(response)
		})
		.catch((error: any) => { next(error) })
}

/**
 * Express route for fetch messages
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const fetch = (req, res, next) => {
	const userId = req.query.userId

	conversationMessage(req.user.id, userId)
		.then(response => {
			res.json(response)
		})
		.catch((error: any) => { next(error) })
}

/**
 * Express route for creating an message
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
 export const createMiddleware = [
	check('userId').not().isEmpty(),
	requestValidator
]
 export const create = (req, res, next) => {
    const userId = req.user._id
    const conversationUserId = req.body.userId

    createConversation(userId, conversationUserId)
        .then(response => res.json(response)).catch(error => next(error))
}
/**
 const conversationId = req.params.id
 const data = filterObject(req.body, ['to', 'body'])

 createMessage(req.user.id, conversationId, data)
 	.then(response => res.json(response)).catch(error => next(error))
 */


/**
 *
 */
export const searchParticipants = (req, res, next) => {
	const userId = req.user._id
	const q = req.params.q

	searchConversationParticipants(userId, q)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}
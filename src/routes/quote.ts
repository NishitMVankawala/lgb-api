import {
	createQuote,
	fetchUserJobQuote,
	updateQuote,
	acceptQuote,
	publishQuote, fetchQuote
} from '../controllers/quote'
import { requestValidator } from '../middlewares/errorHandler'
import { filterObject } from '../utils/stringUtils'
import { filterKeys as JobQuoteFilterKeys } from '../models/jobQuote'

/**
 * Express route for applying to a particular job and creating a draft quote
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const apply = (req, res, next) => {
	const userId = req.user._id
	const jobId = req.params.jobId
	const data = filterObject(req.body, JobQuoteFilterKeys)

	createQuote(userId, jobId, data)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}

/**
 * Express route for fetching a quote for a particular Job
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const fetch = (req, res, next) => {
	const userId = req.user._id
	const jobId = req.params.jobId
	const quoteId = req.params.quoteId

    fetchQuote(userId, jobId, quoteId)
        .then(response => res.json(response))
        .catch((error: any) => next(error))
}

/**
 * Express admin route for updating Quote
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const updateMiddleware  = [
	requestValidator
]
export const update = (req, res, next) => {
    const quoteId = req.params.quoteId
	const data = filterObject(req.body, JobQuoteFilterKeys)

    updateQuote(quoteId, data)
        .then(response => res.json(response))
        .catch((error: any) => next(error))
}


/**
 * Express admin route for updating Quote
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const publish = (req, res, next) => {
	const quoteId = req.params.quoteId
	const data = filterObject(req.body, JobQuoteFilterKeys)

	publishQuote(quoteId, data)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}

/**
 * Express admin route for accept Quote
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const accept = (req, res, next) => {
    const jobId = req.params.jobId
    const quoteId = req.params.quoteId

    acceptQuote(jobId, quoteId)
        .then(response => {
            // res.app.emit('notify:quote-accepted', response)
            // res.app.emit('notify:accepted-self', response)
            res.json(response)
        })
        .catch((error: any) => next(error))
}
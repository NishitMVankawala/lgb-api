import {
	fetchAllFaqs,
	createFaq,
	fetchFaq,
	removeFaq,
	updateFaq, sortFaq
} from '../controllers/faqs'
import { requestValidator } from '../middlewares/errorHandler'
import { filterKeys, validationKeys } from '../models/faq'
import { filterObject } from '../utils/stringUtils'

/**
 * Express admin route for listing all faqs
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const adminIndex = (req, res, next) => {
	const faqCategoryId = req.params.faqCategoryId
	
	fetchAllFaqs(faqCategoryId, req.language)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}

/**
 * Express admin route for fetching a single faq
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const adminFetch = (req, res, next) => {
	const faqId = req.params.faqId
	
	fetchFaq(faqId, req.language)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}

/**
 * Express admin route for creating a new faq
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const createMiddleware  = [ ...validationKeys, requestValidator ]
export const adminCreate = (req, res, next) => {
	const data = filterObject(req.body, filterKeys)
	
	createFaq(data)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}

/**
 * Express admin route for updating a faq
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const updateMiddleware  = [ ...validationKeys, requestValidator ]
export const adminUpdate = (req, res, next) => {
	const faqId = req.params.faqId
	const data = filterObject(req.body, filterKeys)
	
	updateFaq(faqId, data)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}

/**
 * Express admin route for removing a faq
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const adminRemove = (req, res, next) => {
	const faqId = req.params.faqId
	
	removeFaq(faqId)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}

/**
 * Express admin route for sorting the faq
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const adminOrder = (req, res, next) => {
	const sortOrder = req.body
	
	sortFaq(sortOrder)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}
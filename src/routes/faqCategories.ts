import {
	fetchAllFaqCategories,
	createFaqCategory,
	fetchFaqCategory,
	removeFaqCategory,
	updateFaqCategory, sortFaqCategories
} from '../controllers/faqCategories'
import { requestValidator } from '../middlewares/errorHandler'
import { filterKeys, validationKeys } from '../models/faqCategory'
import { filterObject } from '../utils/stringUtils'

/**
 * Express admin route for listing all faqCategories
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const adminIndex = (req, res, next) => {
	fetchAllFaqCategories(req.language)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}

/**
 * Express admin route for fetching a single faqCategory
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const adminFetch = (req, res, next) => {
	const faqCategoryId = req.params.faqCategoryId
	
	fetchFaqCategory(faqCategoryId, req.language)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}

/**
 * Express admin route for creating a new faqCategory
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const createMiddleware  = [ ...validationKeys, requestValidator ]
export const adminCreate = (req, res, next) => {
	const data = filterObject(req.body, filterKeys)
	
	createFaqCategory(data)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}

/**
 * Express admin route for updating a faqCategory
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const updateMiddleware  = [ ...validationKeys, requestValidator ]
export const adminUpdate = (req, res, next) => {
	const faqCategoryId = req.params.faqCategoryId
	const data = filterObject(req.body, filterKeys)
	
	updateFaqCategory(faqCategoryId, data)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}

/**
 * Express admin route for removing a faqCategory
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const adminRemove = (req, res, next) => {
	const faqCategoryId = req.params.faqCategoryId
	
	removeFaqCategory(faqCategoryId)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}

/**
 * Express admin route for sorting the faq categories
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const adminOrder = (req, res, next) => {
	const sortOrder = req.body
	
	sortFaqCategories(sortOrder)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}
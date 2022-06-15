import { check } from 'express-validator'
import { adminCreatePageCategory, adminUpdatePageCategory,adminFetchSinglePageCategory,
	adminFetchPageCategory, sortPageCategory,removePageCategory
} from '../controllers/pageCategory'
import { requestValidator } from '../middlewares/errorHandler'
import {filterKeys} from '../models/pageCategory'

import {filterObject, slugify} from '../utils/stringUtils'


/**
 * Express route for creating a new PageCategory
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const createMiddleware = [
	check('title').exists(), requestValidator
]
export const adminCreate = (req, res, next) => {

    const pageData = filterObject(req.body, filterKeys)
    
	adminCreatePageCategory(pageData)
		.then(response => res.json(response))
		.catch((error: any) => { next(error) })
}

/**
 * Express route for update a PageCategory
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const updateMiddleware = [
	check('title').exists(), requestValidator
]
export const adminUpdate = (req, res, next) => {
    const pageCategoryId = req.params.pageCategoryId
    const pageUpdateData = filterObject(req.body, filterKeys)
    
	adminUpdatePageCategory(pageCategoryId, pageUpdateData)
		.then(response => res.json(response))
		.catch((error: any) => { next(error) })
}

/**
 * Express route for fetching a single PageCategory
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const adminSingleFetch = (req, res, next) => {
    const pageCategoryId = req.params.pageCategoryId
    
	adminFetchSinglePageCategory(pageCategoryId)
		.then(response => res.json(response))
		.catch((error: any) => { next(error) })
}

/**
 * Express route for fetching  PageCategory
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const adminFetch = (req, res, next) => {
    
	adminFetchPageCategory()
		.then(response => res.json(response))
		.catch((error: any) => { next(error) })
}


/**
 * Express admin route for sorting the PageCategory
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const adminOrder = (req, res, next) => {
	const sortOrder = req.body
	
	sortPageCategory(sortOrder)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}

/**
 * Express admin route for removing a PageCategory
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const adminRemove = (req, res, next) => {
	const pageCategoryId = req.params.pageCategoryId
	
	removePageCategory(pageCategoryId)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}

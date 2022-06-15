import { check } from 'express-validator'
import { adminCreatePage,adminUpdatePage,adminFetchSinglePage,
	adminFetchPage, sortPage, removePage,publicFetchSinglePage,
	fetchPageBySlugs
} from '../controllers/page'
import { requestValidator } from '../middlewares/errorHandler'
import {filterKeys} from '../models/page'

import {filterObject, slugify} from '../utils/stringUtils'


/**
 * Express route for creating a new page
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const createMiddleware = [
	check('title').exists(),
    // check('category').exists(), 
    check('content').exists(), requestValidator
]
export const adminCreate = (req, res, next) => {

    const pageData = filterObject(req.body, filterKeys)
    
	adminCreatePage(pageData)
		.then(response => res.json(response))
		.catch((error: any) => { next(error) })
}

/**
 * Express route for update a page
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const updateMiddleware = [
	check('title').exists(),
    // check('category').exists(), 
    check('content').exists(), requestValidator
]
export const adminUpdate = (req, res, next) => {
    const pageId = req.params.pageId
    const pageUpdateData = filterObject(req.body, filterKeys)
    
	adminUpdatePage(pageId, pageUpdateData)
		.then(response => res.json(response))
		.catch((error: any) => { next(error) })
}

/**
 * Express route for fetching a single page
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const adminSingleFetch = (req, res, next) => {
    const pageId = req.params.pageId
    
	adminFetchSinglePage(pageId)
		.then(response => res.json(response))
		.catch((error: any) => { next(error) })
}

/**
 * Express route for fetching  page
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const adminFetch = (req, res, next) => {
    
	adminFetchPage()
		.then(response => res.json(response))
		.catch((error: any) => { next(error) })
}


/**
 * Express admin route for sorting the pages
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const adminOrder = (req, res, next) => {
	const sortOrder = req.body
	
	sortPage(sortOrder)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}

/**
 * Express admin route for removing a page
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const adminRemove = (req, res, next) => {
	const pageId = req.params.pageId
	
	removePage(pageId)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}

/**
 * Express public route for fetching a single page
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const publicSingleFetch = (req, res, next) => {
    const pageId = req.params.pageId
    
	publicFetchSinglePage(pageId)
		.then(response => res.json(response))
		.catch((error: any) => { next(error) })
}

/**
 * Express route for fetching the page by tags
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const fetchBySlugs = (req, res, next) => {
	const slug = req.params.pageSlug;
	console.log('PageModel',slug)
	fetchPageBySlugs(slug)
		.then(response => res.json(response))
		.catch((error: any) => { next(error) })
}
import { check } from 'express-validator'
import {
	adminUpdateJobPost,
	createJobPost,
	fetchAllSearchJobPost,
	fetchSingleJobPost,
	fetchJobPost,
	fetchAllJobPost,
	updateJobPost,
	publishJobPost,
	fetchFilterJobPost,
	fetchSearchJobPostByMap,
	createRating,
	FetchJobRating,
	createJobPostMilestone,
	fetchJobPostMilestone,
	updateMilestone,
	meetingRequest, deleteJobPost
} from '../controllers/jobPost'
import { requestValidator } from '../middlewares/errorHandler'
import {filterObject} from '../utils/stringUtils'
import {filterKeys, validationKeys} from '../models/jobPost'
import { JobPostSaveData } from '../interfaces/jobPost'
import { fetchUserJobQuote } from '../controllers/quote'

/**
 * Express route for creating a new job post
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const createMiddleware = [
	check('title').exists(),
	requestValidator
]
export const create = (req, res, next) => {
    const jobPostObject = filterObject(req.body, filterKeys) as JobPostSaveData
   
	createJobPost(req.user.id, jobPostObject)
		.then(response => res.json(response))
		.catch((error: any) => { next(error) })
}

/**
 * Express route for updating a job post
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const updateMiddleware  = [ ...validationKeys, requestValidator ]
export const update = (req, res, next) => {
	const jobId = req.params.jobId
	const data = filterObject(req.body, filterKeys) as JobPostSaveData

	updateJobPost(jobId, data)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}

/**
 * Express route for fetching a single job post
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const fetch = (req, res, next) => {
	const jobId = req.params.jobId

	fetchSingleJobPost(jobId)
		.then(response => res.json(response))
		.catch((error: any) => { next(error) })
}

/**
 * Express route for publish a job post
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const publish = (req, res, next) => {
	const jobId = req.params.jobId

	publishJobPost(jobId)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}

/**
 * Express route for deleting user's job post
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const remove = (req, res, next) => {
	const jobId = req.params.jobId

	deleteJobPost(jobId)
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
export const fetchQuote = (req, res, next) => {
	const userId = req.user._id
	const jobId = req.params.jobId

	fetchUserJobQuote(userId, jobId)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}

/**
 * Express route for fetching job post     
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const status = (req, res, next) => {
	const status = req.params.status
	const userId = req.user._id
	const userRole = req.user.role

	fetchFilterJobPost(userId, userRole, status)
		.then(response => res.json(response))
		.catch((error: any) => { next(error) })
}

/**
 * Express route for fetching a single job post
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const searchAllJobPost = (req, res, next) => {
	const categoryId = req.params.categoryId
	const query = req.params.q

	fetchAllSearchJobPost(query, categoryId)
		.then(response => res.json(response))
		.catch((error: any) => { next(error) })
}

/**
 * Express route for fetching job post by map
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const searchAllJobPostByMap = (req, res, next) => {
	const coordinate = {
		topLeft: req.query.topLeft,
		topRight: req.query.topRight,
		bottomLeft: req.query.bottomLeft,
		bottomRight: req.query.bottomRight
	} 

	const region = req.query.region

	fetchSearchJobPostByMap(coordinate, region)
		.then(response => res.json(response))
		.catch((error: any) => { next(error) })
}

/**
 * Express route for creating a new rating
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const rating = (req, res, next) => {
    const jobId = req.params.jobId
    const ratingObject = filterObject(req.body, ['personality', 'readability', 'comments'])
	createRating(jobId, req.user.id, ratingObject)
		.then(jobPost => {
			res.app.emit('notify:job-review', jobPost)
			res.json(jobPost)
		})
		.catch((error: any) => { next(error) })
}

/**
 * Express route for creating a new rating
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const fetchRating = (req, res, next) => {
	FetchJobRating(req.user.id)
		.then(response => res.json(response))
		.catch((error: any) => { next(error) })
}

/**
 * Express route for creating a milestone for the job post
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const milestoneIndex = (req, res, next) => {
	const jobId = req.params.jobId
    const milestoneObject = filterObject(req.body, ['breakdown','grandTotal','message'])
   
	createJobPostMilestone(jobId, req.user.id, milestoneObject)
		.then(response => res.json(response))
		.catch((error: any) => { next(error) })
}

/**
 * Express route for fetch milestone
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const milestoneFetch = (req, res, next) => {
	const jobId = req.params.jobId
	const userId = req.user.id
   
	fetchJobPostMilestone(jobId, userId)
		.then(response => res.json(response))
		.catch((error: any) => { next(error) })
}

/**
 * Express route for updating a milestone job post
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const updateJobMilestone = (req, res, next) => {
	const milestoneId = req.params.milestoneId
	const jobId = req.params.jobId
    const milestoneObject = filterObject(req.body, ['breakdown','grandTotal','message'])

	updateMilestone(jobId, milestoneId, milestoneObject)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}

/**
 * Express route for updating a milestone job post
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const meeting = (req, res, next) => {
	const jobId = req.params.jobId
	const userId = req.user.id

	meetingRequest(jobId)
		.then(response => {
			res.app.emit('notify:request-meeting', {requestUserId: userId, ...response})
			res.json(response)
		})
		.catch((error: any) => next(error))
}

/**
 * Express admin route for updating a job post
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
// export const adminupdateMiddleware  = [ ...validationKeys, requestValidator ]
export const adminUpdate = (req, res, next) => {
	const jobPostId = req.params.jobPostId
	const data = filterObject(req.body, filterKeys)
	
	adminUpdateJobPost(jobPostId, data)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}

/**
 * Express admin route for fetching a single job post
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const adminFetch = (req, res, next) => {
	const jobPostId = req.params.jobPostId
	
	fetchJobPost(jobPostId)
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}

/**
 * Express admin route for listing all Job Post
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const adminIndex = (req, res, next) => {
	fetchAllJobPost()
		.then(response => res.json(response))
		.catch((error: any) => next(error))
}
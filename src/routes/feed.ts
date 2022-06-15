import { fetchUserFeed } from '../controllers/feed'

/**
 * Express route for fetching a users feed
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */

export const fetch = (req, res, next) => {
	const page = (req.query.page && req.query.page > 0) ? parseInt(req.query.page) + 1 : 1

	fetchUserFeed(req.user.id, page)
		.then(response => res.json(response))
		.catch((error: any) => { next(error) })
}
import { check } from 'express-validator'
import { createPost, fetchPostByTags, fetchPost, 
            updatePostLikes,createPostComment, fetchPostComment
} from '../controllers/posts'
import { requestValidator } from '../middlewares/errorHandler'
import {filterObject} from '../utils/stringUtils'


/**
 * Express route for creating a new post
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const createMiddleware = [
	check('body').exists(),
	check('gallery').exists(),
	requestValidator
]
export const create = (req, res, next) => {
	const userId = req.user._id
	const body = req.body.body
	const gallery = req.body.gallery
	const tags = req.body.tags

	console.log('creat this popst', userId, body, gallery, tags)

	createPost(userId, body, gallery, tags)
		.then(response => res.json(response))
		.catch((error: any) => { next(error) })
}

/**
 * Express route for fetching the post by tags
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const fetchByTags = (req, res, next) => {
	const tags = req.params.tags;

	fetchPostByTags([tags])
		.then(response => res.json(response))
		.catch((error: any) => { next(error) })
}

/**
 * Express route for fetching a single post
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const fetch = (req, res, next) => {
	const postId = req.params.postId
    console.log('postId', postId)
	fetchPost(postId)
		.then(response => res.json(response))
		.catch((error: any) => { next(error) })
}

/**
 * Express route for liking a single post
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const updatePostLikeMiddleware = [
	check('like').exists(), check('like').isBoolean(), requestValidator
]
export const like = (req, res, next) => {
	const postId = req.params.postId
	const liked = req.body.like
	const userId = req.user.id

	updatePostLikes(userId, postId, liked === true)
		.then((post) => {
			res.app.emit('like:new', {post, user: req.user})
			res.json(post)
		})
		.catch(error => next(error))
}


/**
 * Express route for create a comment
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const createComment = (req, res, next) => {
	const postId = req.params.postId
	const userId = req.user.id
	const commentBody = filterObject(req.body, ['body'])

	createPostComment(userId, postId, commentBody)
		.then((post) => {
			res.app.emit('notify:post-comment', {post, user: req.user})
			res.json(post)
		})
		.catch(error => next(error))
}

/**
 * Express route for fetching a single post comments
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const indexComment = (req, res, next) => {
	const postId = req.params.postId
    console.log('postId', postId)
	fetchPostComment(postId)
		.then(response => res.json(response))
		.catch((error: any) => { next(error) })
}
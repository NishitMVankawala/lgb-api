import {
    ERR003_FAILED_TO_FETCH,
    ERR004_FAILED_TO_UPDATE,
    ERR007_NOT_FOUND,
    ERR004_FAILED_TO_CREATE
} from '../errors/types'
import { BaseError } from '../errors'
import { PostModel, PostSchemaModel } from '../models/post'
import streamClient from '../utils/streamUtil'

/**
 * Create a post
 */
export const createPost = (userId: string, body: string, gallery: string[], tags: string[]) => {
	return new Promise<PostModel>(async (resolve, reject) => {
		// const post = new PostSchemaModel({ user: userId, body, gallery, tags, isDraft: true })
		// post.save().then((savedPost: PostModel) =>
		// 	savedPost ? resolve(savedPost) : reject(new BaseError(ERR007_NOT_FOUND)))
		// 	.catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))

		const userFeed = streamClient.feed('user', userId)

		await userFeed.addActivity({
			actor: 'User:1',
			verb: 'add',
			object: 'Job:1',
			foreign_id: 'Job:1',
			body, tags
		})

		// await streamClient.reactions.add('like', '7a6f284b-f1f5-11eb-b925-0289d2c29892', {}, { userId })

		const result = await userFeed.get({ limit: 10 })

		try {
			resolve(result as any)
		} catch(error) {
			console.log('feed create error')
			reject(error)
		}
	})
}

/**
 * fetch  posts by tags
 */
export const fetchPostByTags = (tags: string[]) => {
	return new Promise<ReadonlyArray<PostModel>>((resolve, reject) => {
		PostSchemaModel.find({tags: {$in: tags }}).sort({ createdAt: 'descending' }).populate('user').populate('comments.user')
			.then(async (posts) => {
				Promise.all(posts.map(async (post: PostModel) => {
					return { ...post.toObject() }
				})).then((updatedPosts: ReadonlyArray<PostModel>) => resolve(updatedPosts))
			}).catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
	})
}

/**
 * Fetch single post
 */
export const fetchPost = (postId: string) => {
	return new Promise<PostModel>((resolve, reject) => {
		PostSchemaModel.findOne({ _id: postId }).populate('user').populate('comments.user')
			.then((post:PostModel) => {
                console.log('post', post)
				if (post) {
					resolve({ ...post.toObject() })
				} else {
					reject(new BaseError(ERR007_NOT_FOUND))
				}
			}).catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
	})
}

/**
 * Update post likes
 */
export const updatePostLikes = (userId: string, postId: string, liked: boolean) => {
	return new Promise<PostModel>((resolve, reject) => {
		const action = liked ? { $addToSet: { likes: userId } } : { $pullAll: { likes: [userId]} }
        PostSchemaModel.findOneAndUpdate({ _id: postId }, action,
            
			/* tslint:disable */ {projection:{likes: true, likeCount: true}, 'new': true }) /* tslint:enable */
			.then((post) => resolve(post))
			.catch((error: any) => reject(new BaseError(ERR004_FAILED_TO_UPDATE)))
	})
}


/**
 * Create a post comment
 */
export const createPostComment = (userId: string, postId: string, data: any) => {
	return new Promise<PostModel>((resolve, reject) => {
		const comment = { user: userId, body:data.body, updatedAt: Date.now(), createdAt: Date.now() }

		PostSchemaModel.findOneAndUpdate({ _id: postId }, { $addToSet: { comments: comment } },
			/* tslint:disable */ { 'new': true, setDefaultsOnInsert: true }).populate('user').populate('comments.user') /* tslint:enable */
			.then(async (post) => {
				if (!post) { reject(new BaseError(ERR007_NOT_FOUND)) } else {
				    resolve(post)
                }
              
			}).catch((error: any) => reject(new BaseError(ERR004_FAILED_TO_CREATE, error)))
	})
}

/**
 * Fetch single post comments
 */
export const fetchPostComment = (postId: string) => {
	return new Promise<PostModel>((resolve, reject) => {
		PostSchemaModel.findOne({ _id: postId },{comments: true}).populate('comments.user')
			.then((commentData:PostModel) => {
				if (commentData) {
					resolve(commentData)
				} else {
					reject(new BaseError(ERR007_NOT_FOUND))
				}
			}).catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
	})
}

/**
 * Fetch all posts
 */
export const fetchAllPosts = (userId: string) => {
	return new Promise<ReadonlyArray<PostModel>>((resolve, reject) => {
		PostSchemaModel.find({ isDraft: false }).sort({ createdAt: 'descending' }).limit(20).populate('user')
			.then(async (posts) => {
				Promise.all(posts.map(async (post: PostModel) => {
					// const user = await getAuthor(post.userId)
					return { ...post.toObject() }
				})).then((updatedPosts: ReadonlyArray<PostModel>) => resolve(updatedPosts))
			}).catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
	})
}
import { PaginateResult } from 'mongoose'

import { PostModel, PostSchemaModel } from '../models/post'
import {
	ERR003_FAILED_TO_FETCH,
} from '../errors/types'
import { BaseError } from '../errors'
import streamClient from '../utils/streamUtil'

/**
 * Fetch user feed
 */
export const fetchUserFeed = (userId: string, page: number) => {
	return new Promise<PaginateResult<PostModel>>(async (resolve, reject) => {

		try {
			const condition = { isDraft: false }
			const dataFilterObject = {}

			const userFeed = streamClient.feed('user', userId)
			const result = await userFeed.get({ limit: 10, withReactionCounts: true })

			// const result = await PostSchemaModel.paginate({ ...condition, ...dataFilterObject },
			// 	{ sort: '-createdAt', page: page !== -1 ? page : 1, limit: page !== -1 ? 100 : 10000, populate: { path: 'user', select: basicFilterKeys.join(' ') } })

			resolve(result as any)
		} catch (error) {
			reject(new BaseError(ERR003_FAILED_TO_FETCH, error))
		}
	})
}

const parseFeed = (feed) => {
	return feed
}
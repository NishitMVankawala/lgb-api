import {
    ERR003_FAILED_TO_FETCH,
    ERR007_NOT_FOUND
} from '../errors/types'
import { BaseError } from '../errors'

import { PostRecord } from '../interfaces/posts'
import { NotificationModel, NotificationSchemaModel } from '../models/notification'
import { UserModel, UserRecord } from '../models/user'
import { PostModel } from '../models/post'

export interface NotificationPost {
    post: Partial<PostRecord>
    user: Partial<UserRecord>
}

/**
 * Notify a user for Post like
 *
 * @param {NotificationPost} data
 */
export const notificationPostLiked = async (data: NotificationPost) => {
    return new Promise<NotificationModel>((resolve, reject) => {
        let userId = (data.user as UserModel)._id
        let postId = (data.post as PostModel)._id

        const Post = new NotificationSchemaModel({
            user: userId,
            message: 'User like the post',
            type: 'PostLike',
            additionalData: {
                model: 'Post',
                _id: postId

            },
            isSeen: false
        })
        Post.save().then((savedPost: NotificationModel) =>
            savedPost ? resolve(savedPost) : reject(new BaseError(ERR007_NOT_FOUND)))
            .catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
    })
}

/**
 * Notify a user for Post comment
 *
 * @param {NotificationPost} data
 */
export const notificationPostComment = async (data: NotificationPost) => {
    return new Promise<NotificationModel>((resolve, reject) => {
        let userId = (data.user as UserModel)._id
        let postId = (data.post as PostModel)._id

        const PostNotification = new NotificationSchemaModel({
            user: userId,
            message: 'User comment on the post',
            type: 'PostComment',
            additionalData: {
                model: 'Post',
                _id: postId

            },
            isSeen: false
        })
        PostNotification.save().then((savedPost: NotificationModel) =>
            savedPost ? resolve(savedPost) : reject(new BaseError(ERR007_NOT_FOUND)))
            .catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
    })
}
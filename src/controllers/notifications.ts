import {
    ERR003_FAILED_TO_FETCH,
    ERR004_FAILED_TO_UPDATE,
    ERR007_NOT_FOUND,
    ERR004_FAILED_TO_CREATE
} from '../errors/types'
import { BaseError } from '../errors/index'

import { NotificationModel, NotificationSchemaModel } from '../models/notification'

/**
 * Fetch all notifications
 */
export const fetchAllNotifications = (userId: string) => {
	return new Promise<ReadonlyArray<NotificationModel>>(async (resolve, reject) => {
		try {
			const rawNotifications = await NotificationSchemaModel
				.find({ user: userId }).sort({ createdAt: 'descending' }).limit(20)

			resolve(rawNotifications)
		} catch (error) {
			reject(new BaseError(ERR003_FAILED_TO_FETCH))
		}
	})
}

/**
 * Update the seen status of the post notifications
 */
export const updateNotificationsSeen = (userId: string, notificationIds: string[]) => {
	return new Promise<ReadonlyArray<NotificationModel>>((resolve, reject) => {
		NotificationSchemaModel.updateMany({ _id: { $in: notificationIds }, user: userId },
			{ $set: { isSeen : true } },
			/* tslint:disable */ { 'new': true }) /* tslint:enable */
			.then((notifications) => resolve(notifications))
			.catch((error: any) => reject(new BaseError(ERR004_FAILED_TO_UPDATE, error)))
	})
}
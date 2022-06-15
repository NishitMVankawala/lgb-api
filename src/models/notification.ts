import { Document, Model, model, Schema} from 'mongoose'
import { Notification } from '../interfaces/notification'

/**
 * Model for Notifications
 */
export interface NotificationModel extends Notification, Document {}

const AdditionalSchema: Schema = new Schema({
	_id: String,
	model: String
}, {
	timestamps: true
})

export const NotificationSchema: Schema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	message: String,
	type: String,
	isSeen: {
		type: Boolean,
		/* tslint:disable */'default': false /* tslint:enable */
    },
    additionalData: AdditionalSchema
}, {
	timestamps: true
})

export const NotificationSchemaModel: Model<NotificationModel> =
	model<NotificationModel>('Notification', NotificationSchema)
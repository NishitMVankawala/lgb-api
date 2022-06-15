import { Express } from 'express'
import { notificationAdminResetPassword } from './notifyAdminResetPassword'
import { notificationPostLiked, notificationPostComment } from './post'
import { notificationJobPostReview, notificationNewQuote	} from './jobPost'

export enum NotificationEventTypes {
	NOTIFY_ADMIN_RESET_PASSWORD = 'notify:reset-password',
	NOTIFY_POST_LIKE = 'like:new',
	NOTIFY_POST_COMMENT = 'notify:post-comment',
	NOTIFY_JOB_REVIEW = 'notify:job-review',
	NOTIFY_NEW_QUOTE = 'notify:new-quote',
	NOTIFY_QUOTE_ACCEPTED = 'notify:quote-accepted',
	NOTIFY_SELF_ACCEPTED = 'notify:accepted-self',
	NOTIFY_REQUEST_MEETING = 'notify:request-meeting'
}

const registerEvents = (app: Express) => {
	app.on(NotificationEventTypes.NOTIFY_ADMIN_RESET_PASSWORD, (data: any) => notificationAdminResetPassword(data))

	app.on(NotificationEventTypes.NOTIFY_POST_LIKE, (data: any) => notificationPostLiked(data))
	
	app.on(NotificationEventTypes.NOTIFY_POST_COMMENT, (data: any) => notificationPostComment(data))

	app.on(NotificationEventTypes.NOTIFY_JOB_REVIEW, (data: any) => notificationJobPostReview(data))

	app.on(NotificationEventTypes.NOTIFY_NEW_QUOTE, (data: any) => notificationNewQuote(data))
}

export default registerEvents
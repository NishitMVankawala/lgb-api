import { EMT001_RESET_PASSWORD } from '../constants/emailTemplate'
import { EmailBuilder } from '../utils/emailClient'

export interface NotificationResetPassword {
	name: string
	email: string
	token: string
	link: string
}

/**
 * Notify a user for their password reset
 *
 * @param {NotificationResetPassword} data
 */
export const notificationAdminResetPassword = async (data: NotificationResetPassword) => {
	const to = [ data.email ]
	const mailData = {
		name: data.name,
		link: data.link
	}
	
	const eb = new EmailBuilder(EMT001_RESET_PASSWORD, to, mailData)
	await eb.send()
}
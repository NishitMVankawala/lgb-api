// Listing of all email templates
interface EmailTemplate {
	name: string
	from: string
	subject: string
	view: string
}

// Admin Emails
type EMT001_RESET_PASSWORD = EmailTemplate
type EMT002_VERIFY_EMAIL = EmailTemplate

export const EMT001_RESET_PASSWORD: EMT001_RESET_PASSWORD = {
	name: 'LGB Portal CRM',
	from: 'noreply@lgb.urbn.work',
	subject: 'Reset your password',
	view: 'views/emails/reset-password.html'
}

export const EMT002_VERIFY_EMAIL: EMT002_VERIFY_EMAIL = {
	name: 'LGB Portal CRM',
	from: 'noreply@lgb.urbn.work',
	subject: 'Verify your email to join LGB Portal',
	view: 'views/emails/email-verification.html'
}

export type EmailTemplateType =
	| EMT001_RESET_PASSWORD
	| EMT002_VERIFY_EMAIL
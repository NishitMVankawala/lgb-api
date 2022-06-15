import * as SendgridMail from '@sendgrid/mail'
import * as consolidate from 'consolidate'
import * as path from 'path'

import { EmailTemplateType } from '../constants/emailTemplate'

SendgridMail.setApiKey(process.env.SENDGRID_API_KEY)

export class EmailBuilder {
	private static parseBody(view: string, data: any) {
		return new Promise((resolve, reject) => {
			const fileName = path.join(__dirname, '/../', view)
			consolidate.swig(fileName, data, (err, html) => err ? reject(err) : resolve(html))
		})
	}

	private template: EmailTemplateType
	private to: string[]
	private from: string
	private subject: string
	private data: any
	private subjectData: any

	constructor(template: EmailTemplateType, to: string[], data: any, subjectData?: any) {
		this.template = template
		this.to = to
		this.from = template.from
		this.subject = template.subject
		this.data = data
		this.subjectData = subjectData
	}

	public setFrom(from: string) {
		this.from = from
	}

	public setSubject(subject: string) {
		this.subject = subject
	}

	public send() {
		const { to, from, subject, template, data, subjectData } = this
		
		let updatedSubject = subject
		
		if (subjectData) {
			Object.keys(subjectData).map(key => {
				updatedSubject = updatedSubject.replace(`{${key}}`, subjectData[key]) as string
			})
		}

		return EmailBuilder.parseBody(template.view, data)
			.then((html: string) => {
				if (process.env.NODE_ENV !== 'test') {
					SendgridMail.send({to, from: {email: from, name: template.name}, subject: updatedSubject, html})
				}
			})
	}
}

export const EmailClient = SendgridMail

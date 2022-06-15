import * as bcrypt from 'bcryptjs'
import { Document, Model, model, Schema } from 'mongoose'
import { check } from 'express-validator'

/**
 * Validation Keys
 */
export const validationKeys = [
	check('name').not().isEmpty(),
	check('email').not().isEmpty(),
	check('role').not().isEmpty()
]
export const filterKeys = ['name', 'lastName', 'email', 'password', 'role', 'thumbnailImageUrl']

/**
 * Admin User Record
 */
export interface AdminUserRecord {
	name: string
	lastName?: string
	email: string
	password?: string
	role: string
}

/**
 * Admin User Model
 */
export interface AdminUserModel extends AdminUserRecord, Document {
	comparePassword(): any
}
export const AdminUserSchema: Schema = new Schema({
	thumbnailImageUrl: String,
	name: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		/* tslint:disable */
		'default': '' /* tslint:enable */
	},
	email: {
		type: String,
		required: true
	},
	role: String
}, {
	timestamps: true
})

AdminUserSchema.pre('init', (doc: any) => {
	if (!doc.thumbnailImageUrl) {
		const fullName = doc.lastName ? doc.name + '+' + doc.lastName : doc.name
		doc.thumbnailImageUrl = 'https://ui-avatars.com/api/?background=444444&size=200&font-size=0.4&color=fff&name=' +
			fullName.replace(/ /g, '+')
	}

	doc.fullName = doc.lastName ? doc.name + ' ' + doc.lastName : doc.name
})

// Compare password when admin user login
AdminUserSchema.statics.comparePassword = (password: string, comparePassword: string, next: any) => {
	bcrypt.compare(password, comparePassword, (err, isMatch) => {
		if (err) { return next(err) }
		next(null, isMatch)
	})
}

AdminUserSchema.methods.toJSON = function() {
	const obj = this.toObject() as AdminUserModel
	delete obj.password
	delete obj.__v
	return obj
}

export const AdminUserSchemaModel: Model<AdminUserModel> = model<AdminUserModel>('AdminUser', AdminUserSchema)
import * as bcrypt from 'bcryptjs'
import { AdminUserModel, AdminUserRecord, AdminUserSchemaModel } from '../models/adminUser'
import { BaseError } from '../errors'
import {
	ERR003_FAILED_TO_FETCH, ERR004_FAILED_TO_CREATE, ERR004_FAILED_TO_DELETE, ERR004_FAILED_TO_UPDATE,
	ERR013_ALREADY_REGISTERED
} from '../errors/types'

export const fetchAllAdminUsers = () => {
	return new Promise<ReadonlyArray<AdminUserModel>>((resolve, reject) => {
		AdminUserSchemaModel.find({})
			.then((users: ReadonlyArray<AdminUserModel>) => resolve(users))
			.catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
	})
}

export const fetchAdminUser = (userId: string) => {
	return new Promise<AdminUserModel>((resolve, reject) => {
		AdminUserSchemaModel.findOne({ _id: userId })
			.then((user: AdminUserModel) => resolve(user))
			.catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
	})
}

export const createAdminUser = (userData: Partial<AdminUserRecord>) => {
	return new Promise<AdminUserModel>((resolve, reject) => {
		const salt = bcrypt.genSaltSync()
		userData.password = bcrypt.hashSync(userData.password, salt)

		AdminUserSchemaModel.findOne({ email: userData.email })
			.then((userExist: AdminUserModel) => {
				if (userExist) { reject(new BaseError(ERR013_ALREADY_REGISTERED)) } else {
					const user = new AdminUserSchemaModel(userData)
					user.save().then((newUser: AdminUserModel) => {
						if (!newUser) { reject((new BaseError(ERR004_FAILED_TO_CREATE))) } else { resolve(newUser) }
					})
				}
			}).catch((error: any) => reject(new BaseError(ERR004_FAILED_TO_CREATE, error)))
	})
}

export const updateAdminUser = (userId: string, userData: Partial<AdminUserRecord>) => {
	return new Promise<AdminUserModel>((resolve, reject) => {
		if (userData.password) {
			const salt = bcrypt.genSaltSync()
			userData.password = bcrypt.hashSync(userData.password, salt)
		}

		AdminUserSchemaModel.findOneAndUpdate({ _id: userId }, { $set: userData },
			/* tslint:disable */{ 'new': true }) /* tslint:enable */
			.then((user: AdminUserModel) => resolve(user))
			.catch((error: any) => reject(new BaseError(ERR004_FAILED_TO_UPDATE, error)))
	})
}

export const removeAdminUser = (userId: string) => {
	return new Promise<AdminUserModel>((resolve, reject) => {
		AdminUserSchemaModel.findOneAndRemove({ _id: userId })
			.then((user: AdminUserModel) =>
				user ? resolve(user) : reject(new BaseError(ERR004_FAILED_TO_DELETE)))
			.catch((error: any) => reject(new BaseError(ERR004_FAILED_TO_DELETE, error)))
	})
}
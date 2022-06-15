import * as bcrypt from 'bcryptjs'
import { UserModel, UserRecord, UserSchemaModel } from '../models/user'
import { BaseError } from '../errors'
import {
	ERR003_FAILED_TO_FETCH, ERR004_FAILED_TO_CREATE, ERR004_FAILED_TO_DELETE, ERR004_FAILED_TO_UPDATE,
	ERR013_ALREADY_REGISTERED
} from '../errors/types'

export const fetchAllUsers = () => {
	return new Promise<ReadonlyArray<UserModel>>((resolve, reject) => {
		UserSchemaModel.find({})
			.then((users: ReadonlyArray<UserModel>) => resolve(users))
			.catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
	})
}

export const fetchUser = (userId: string) => {
	return new Promise<UserModel>((resolve, reject) => {
		UserSchemaModel.findOne({ _id: userId })
			.then((user: UserModel) => resolve(user))
			.catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
	})
}

export const createUser = (userData: Partial<UserRecord>) => {
	return new Promise<UserModel>((resolve, reject) => {
		const salt = bcrypt.genSaltSync()
		userData.password = bcrypt.hashSync(userData.password, salt)

		UserSchemaModel.findOne({ email: userData.email })
			.then((userExist: UserModel) => {
				if (userExist) { reject(new BaseError(ERR013_ALREADY_REGISTERED)) } else {
					const user = new UserSchemaModel(userData)
					user.save().then((newUser: UserModel) => {
						if (!newUser) { reject((new BaseError(ERR004_FAILED_TO_CREATE))) } else { resolve(newUser) }
					})
				}
			}).catch((error: any) => reject(new BaseError(ERR004_FAILED_TO_CREATE, error)))
	})
}

export const updateUser = (userId: string, userData: Partial<UserRecord>) => {
	return new Promise<UserModel>((resolve, reject) => {
		
		if (userData.password) {
			const salt = bcrypt.genSaltSync()
			userData.password = bcrypt.hashSync(userData.password, salt)
		}
		
		userData.lastName = ''
		
		UserSchemaModel.findOneAndUpdate({ _id: userId }, { $set: userData },
			/* tslint:disable */{ 'new': true }) /* tslint:enable */
			.then((user: UserModel) => resolve(user))
			.catch((error: any) => reject(new BaseError(ERR004_FAILED_TO_UPDATE, error)))
	})
}

export const removeUser = (userId: string) => {
	return new Promise<UserModel>((resolve, reject) => {
		UserSchemaModel.findOneAndRemove({ _id: userId })
			.then((user: UserModel) =>
				user ? resolve(user) : reject(new BaseError(ERR004_FAILED_TO_DELETE)))
			.catch((error: any) => reject(new BaseError(ERR004_FAILED_TO_DELETE, error)))
	})
}
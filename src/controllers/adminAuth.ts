import * as bcrypt from 'bcryptjs'
import { JWTToken } from '../interfaces/adminAuth'
import { AdminUserModel, AdminUserRecord, AdminUserSchemaModel } from '../models/adminUser'
import { BaseError } from '../errors'
import {
	ERR004_FAILED_TO_CREATE,
	ERR004_FAILED_TO_UPDATE, ERR007_NOT_FOUND,
	ERR011_FAILED_TO_LOGIN,
	ERR013_ALREADY_REGISTERED
} from '../errors/types'
import {signJWTToken} from "./auth";

/**
 * Login a Admin with their email and password
 *
 * @param email
 * @param password
 */
export const loginAdmin = (email: string, password: string) => {
	return new Promise<JWTToken>((resolve, reject) => {
		
		AdminUserSchemaModel.findOne({ email })
			.then((user: AdminUserModel) => {
				if (!user) { reject(new BaseError(ERR007_NOT_FOUND)) } else {
					bcrypt.compare(password, user.password, (err, isMatch) => {
						if (err) { reject(new BaseError	(ERR011_FAILED_TO_LOGIN)) }
						else if(!isMatch) { reject(new BaseError(ERR011_FAILED_TO_LOGIN)) }
						else {
							resolve(signJWTToken(user, 'adminUser'))
						}
					})
				}
			}).catch((error) => reject(new BaseError(ERR011_FAILED_TO_LOGIN, error)))
	})
}


/**
 * Register a user and check for existing users either by email
 *
 * @param adminUserData
 */
export const createAdminUser = (adminUserData: Partial<AdminUserRecord>) => {
	const salt = bcrypt.genSaltSync()
	adminUserData.password = bcrypt.hashSync(adminUserData.password, salt)
	adminUserData.email = adminUserData.email.toLowerCase()

	return new Promise<JWTToken>((resolve, reject) => {
		AdminUserSchemaModel.findOne({ email: adminUserData.email })
			.then((userExist: AdminUserModel) => {
				if (userExist) { reject(new BaseError(ERR013_ALREADY_REGISTERED)) } else {
					const user = new AdminUserSchemaModel(adminUserData)
					user.save().then((newUser: AdminUserModel) => {
						if (!newUser) { reject((new BaseError(ERR004_FAILED_TO_CREATE))) } else {
							resolve(signJWTToken(user, 'adminUser'))
						}
					})
				}
			}).catch((error: any) => reject(new BaseError(ERR004_FAILED_TO_CREATE, error)))
	})
}

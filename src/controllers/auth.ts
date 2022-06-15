import * as bcrypt from 'bcryptjs'
import * as jToken from 'jsonwebtoken'
import { JWTToken, GenericResetToken } from '../interfaces/auth'
import { UserModel, UserRecord, UserSchema, UserSchemaModel } from '../models/user'
import { AdminUserModel } from '../models/adminUser'
import { generateToken } from '../utils/cryptoUtil'
import { BaseError } from '../errors'
import {
	ERR013_ALREADY_REGISTERED,
	ERR004_FAILED_TO_CREATE,
	ERR004_FAILED_TO_UPDATE,
	ERR011_FAILED_TO_LOGIN
} from '../errors/types'

/**
 * Register a user and check for existing users either by email
 *
 * @param userData
 */
export const registerUser = (userData: Partial<UserRecord>) => {
	const salt = bcrypt.genSaltSync()
	userData.password = bcrypt.hashSync(userData.password, salt)
	userData.email = userData.email.toLowerCase()
	
	return new Promise<JWTToken>((resolve, reject) => {
		UserSchemaModel.findOne({ email: userData.email })
			.then((userExist: UserModel) => {
				if (userExist) { reject(new BaseError(ERR013_ALREADY_REGISTERED)) } else {
					const user = new UserSchemaModel(userData)
					user.save().then((newUser: UserModel) => {
						if (!newUser) { reject((new BaseError(ERR004_FAILED_TO_CREATE))) } else {
							resolve(signJWTToken(newUser))
						}
					})
				}
			}).catch((error: any) => reject(new BaseError(ERR004_FAILED_TO_CREATE, error)))
	})
}


/**
 * Login a user by their phone number and password
 *
 * @param phoneNumberCountryCode
 * @param phoneNumber
 * @param password
 */
export const loginUserPhone = (phoneNumberCountryCode: string, phoneNumber: string, password: string) => {
	return new Promise<JWTToken>((resolve, reject) => {
		UserSchemaModel.findOne({phoneNumberCountryCode, phoneNumber })
			.then((user: UserModel) => {
				if (!user) { reject(new BaseError(ERR011_FAILED_TO_LOGIN)) } else {
					UserSchema.methods.comparePassword(password, user.password, (err, isMatch) => {
						if (isMatch && !err) {
							resolve(signJWTToken(user))
						} else {
							reject(new BaseError(ERR011_FAILED_TO_LOGIN))
						}
					})
				}
			}).catch((error) => reject(new BaseError(ERR011_FAILED_TO_LOGIN, error)))
	})
}


/**
 * Sign user JWT token with the user model
 *
 * @param user
 * @param model
 */
export const signJWTToken = (user: UserModel |  AdminUserModel, model?: string): JWTToken => {
	const tokenData = { _id: user._id, name: user.name , lastName: user.lastName, email: user.email }
	const signedJWTToken = jToken.sign(model === 'adminUser' ? { adminUser: tokenData } : { user: tokenData },
		process.env.JWT_SECRET, { expiresIn: '1y' })
	
	return { token: signedJWTToken }
}

/**
 * Login a User with their email and password
 *
 * @param email
 * @param password
 */
export const loginUser = (email: string, password: string) => {
	return new Promise<JWTToken>((resolve, reject) => {
		UserSchemaModel.findOne({ email })
			.then((user: UserModel) => {
				if (!user) { reject(new BaseError(ERR011_FAILED_TO_LOGIN)) } else {
					UserSchema.methods.comparePassword(password, user.password, (err, isMatch) => {
						if (isMatch && !err) {
							resolve(signJWTToken(user))
						} else {
							reject(new BaseError(ERR011_FAILED_TO_LOGIN))
						}
					})
				}
			}).catch((error) => reject(new BaseError(ERR011_FAILED_TO_LOGIN, error)))
	})
}

/**
 * Reset use password by their email
 *
 * @param email
 */
export const requestUserPasswordReset = (email: string) => {
	return new Promise<GenericResetToken>(async (resolve, reject) => {
		const token = await generateToken()
		
		UserSchemaModel.findOne({ email })
			.then((user: UserModel) => {
				if (!user) { reject(new BaseError(ERR004_FAILED_TO_UPDATE)) } else {
					user.resetPasswordToken = token
					
					user.save().then(() => resolve({ token }))
				}
			}).catch((error) => reject(new BaseError(ERR004_FAILED_TO_UPDATE, error)))
	})
}

/**
 * Recover a user password by their reset token and password
 *
 * @param token
 * @param password
 */
export const recoverUserPassword = (token: string, password: string) => {
	return new Promise<JWTToken>(async (resolve, reject) => {
		UserSchemaModel.findOne({ resetPasswordToken: token })
			.then((user: UserModel) => {
				if (!user) { reject(new BaseError(ERR004_FAILED_TO_UPDATE)) } else {
					const salt = bcrypt.genSaltSync()
					user.password = bcrypt.hashSync(password, salt)
					user.resetPasswordToken = null
					
					user.save().then((newUser: UserModel) => {
						if (!newUser) { reject((new BaseError(ERR004_FAILED_TO_UPDATE))) } else {
							resolve(signJWTToken(newUser))
						}
					})
				}
			}).catch((error: any) => reject(new BaseError(ERR004_FAILED_TO_CREATE, error)))
	})
}

import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt'
import { UserModel, UserSchemaModel } from '../models/user'
import { AdminUserModel, AdminUserSchemaModel } from '../models/adminUser'

export interface PassportJWTAuthenticationResponse {
	type: string
	model: any
}

export const passportJWTAuthentication = (passportJwt: any) => {
	passportJwt.use(new JWTStrategy({
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: process.env.JWT_SECRET
	}, (jwtPayload, done) => {
		if (typeof(jwtPayload.user) !== 'undefined') {
			UserSchemaModel.findById(jwtPayload.user._id)
				.then((user: UserModel) => done(null, { type: 'user', model: user }))
				.catch((error) => done(error))
		} else if (typeof (jwtPayload.adminUser) !== 'undefined') {
			AdminUserSchemaModel.findById(jwtPayload.adminUser._id)
				.then((adminUser: AdminUserModel) => done(null, { type: 'adminUser', model: adminUser }))
				.catch((error) => done(error))
		} else {
			done(null, null)
		}
	}))
}
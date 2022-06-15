import { check } from 'express-validator'
import { requestValidator } from '../middlewares/errorHandler'
import { loginAdmin } from '../controllers/adminAuth'
import { JWTToken } from '../interfaces/auth'

/**
 * Express route for authenticating a user token
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const authenticate = async (req, res, next) => {
	try {
		let userRole = req.adminUser.role
		const userObject = req.adminUser.toObject()
		
		const admins = process.env.ADMINS ? process.env.ADMINS.split(',') : []
		if (admins.indexOf(req.adminUser.email) !== -1) {
			userRole = 'super-admin'
		}
		
		res.json({ ...userObject, token: req.headers.authorization.split(' ')[1],  role: userRole, password: undefined })
	} catch (error) {
		next(error)
	}
}

/**
 * Express route for logging in a admin-user
 *
 * @param req Request from Express
 * @param res Response from Express
 */
export const loginAdminMiddleware = [
	check('email').not().isEmpty(),
	check('password').not().isEmpty(),
	requestValidator
]
export const adminLogin = (req, res, next) => {
	const email = req.body.email.toLowerCase()
	const password = req.body.password
	
	loginAdmin(email, password)
		.then((jwtToken: JWTToken) => res.json(jwtToken))
		.catch((error: any) => next(error))
}
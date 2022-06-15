import { validationResult } from 'express-validator'
import { ERR002_INCORRECT_PARAMETERS } from '../errors/types'
import { BaseError } from '../errors'

/**
 * Request Validator Middleware
 *
 * @param req
 * @param res
 * @param next
 */
export const requestValidator = (req, res, next) => {
	const errors = validationResult(req)
	
	if (!errors.isEmpty()) {
		try {
			errors.throw()
		} catch (err) {
			throw new BaseError(ERR002_INCORRECT_PARAMETERS, err.mapped())
		}
	} else {
		next()
	}
}
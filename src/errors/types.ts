// Listing of all commonly used errors

interface BaseError {
	code: string,
	name: string,
	message: string,
	status: number
	additionalData?: any
}

type ERR001_INVALID_REQUEST = BaseError
type ERR002_INCORRECT_PARAMETERS = BaseError
type ERR003_FAILED_TO_FETCH = BaseError
type ERR004_FAILED_TO_CREATE = BaseError
type ERR004_FAILED_TO_UPDATE = BaseError
type ERR004_FAILED_TO_DELETE = BaseError
type ERR005_NOT_AUTHENTICATED = BaseError
type ERR006_USER_SESSION_EXPIRED = BaseError
type ERR007_NOT_FOUND  = BaseError
type ERR011_FAILED_TO_LOGIN = BaseError
type ERR012_FAILED_TO_REGISTER = BaseError
type ERR013_ALREADY_REGISTERED = BaseError
type ERR014_ALREADY_EXISTS = BaseError
type ERR021_MISSING_WX_OPENID = BaseError
type ERR022_INVALID_WX_SIGNATURE = BaseError
type ERR023_INVALID_WX_JSCODE = BaseError
type ERR028_COUPON_USAGE_LIMIT = BaseError
type ERR40000_JACKYUN_INVALID_SIGN = BaseError
type ERR40000_JACKYUN_FAILED_TO_FETCH = BaseError
type ERR40000_JACKYUN_FAILED_TO_UPDATE = BaseError

export const ERR001_INVALID_REQUEST: ERR001_INVALID_REQUEST = {
	code: '001', name: 'Invalid Request', message: 'Invalid Request', status: 422
}

export const ERR002_INCORRECT_PARAMETERS: ERR002_INCORRECT_PARAMETERS = {
	code: '002', name: 'Incorrect request parameters', message: 'Incorrect request parameters', status: 422
}

export const ERR003_FAILED_TO_FETCH: ERR003_FAILED_TO_FETCH = {
	code: '003', name: 'Failed to fetch', message: 'Failed to fetch the requested resource', status: 400
}

export const ERR004_FAILED_TO_CREATE: ERR004_FAILED_TO_CREATE = {
	code: '004', name: 'Failed to create', message: 'Failed to create the requested resource', status: 400
}

export const ERR004_FAILED_TO_UPDATE: ERR004_FAILED_TO_UPDATE = {
	code: '005', name: 'Failed to update', message: 'Failed to update the requested resource', status: 400
}

export const ERR004_FAILED_TO_DELETE: ERR004_FAILED_TO_DELETE = {
	code: '006', name: 'Failed to delete', message: 'Failed to delete the requested resource', status: 400
}

export const ERR005_NOT_AUTHENTICATED: ERR005_NOT_AUTHENTICATED = {
	code: '005', name: 'User not authenticated', message: 'User is not authenticated', status: 401
}

export const ERR006_USER_SESSION_EXPIRED: ERR006_USER_SESSION_EXPIRED = {
	code: '006', name: 'Session expired', message: 'User session has expired', status: 401
}

export const ERR007_NOT_FOUND: ERR007_NOT_FOUND = {
	code: '007', name: 'Not Found', message: 'Requested resource not found', status: 404
}

export const ERR011_FAILED_TO_LOGIN: ERR011_FAILED_TO_LOGIN = {
	code: '011', name: 'Failed to login', message: 'Failed to login', status: 401
}

export const ERR012_FAILED_TO_REGISTER: ERR012_FAILED_TO_REGISTER = {
	code: '012', name: 'Failed to register', message: 'Failed to register', status: 401
}

export const ERR013_ALREADY_REGISTERED: ERR013_ALREADY_REGISTERED = {
	code: '013', name: 'Already registered', message: 'User is already registered', status: 401
}

export const ERR014_ALREADY_EXISTS: ERR014_ALREADY_EXISTS = {
	code: '014', name: 'Already exists', message: 'Already exists', status: 401
}

export const ERR021_MISSING_WX_OPENID: ERR021_MISSING_WX_OPENID = {
	code: '021', name: 'Missing Openid', message: 'Missing WX Openid', status: 422
}

export const ERR022_INVALID_WX_SIGNATURE: ERR022_INVALID_WX_SIGNATURE = {
	code: '022', name: 'Invalid Signature', message: 'Invalid WX Signature', status: 400
}

export const ERR023_INVALID_WX_JSCODE: ERR023_INVALID_WX_JSCODE = {
	code: '023', name: 'Invalid JSCODE', message: 'Invalid WX JSCODE', status: 400
}

export const ERR028_COUPON_USAGE_LIMIT: ERR028_COUPON_USAGE_LIMIT = {
	code: '028', name: 'Coupon usage limit', message: 'Coupon usage limit has exceeded', status: 400
}

export const ERR40000_JACKYUN_INVALID_SIGN: ERR40000_JACKYUN_INVALID_SIGN = {
	code: '40000', name: 'Invalid Signature', message: 'Invalid Signature',
	additionalData: { subcode: 'GSE.VERIFYSIGN_FAILURE' }, status: 400
}

export const ERR40000_JACKYUN_FAILED_TO_FETCH: ERR40000_JACKYUN_FAILED_TO_FETCH = {
	code: '40000', name: 'Failed to fetch', message: 'Failed to fetch',
	additionalData: { subcode: 'GSE.SYSTEM_ERROR' }, status: 400
}

export const ERR40000_JACKYUN_FAILED_TO_UPDATE: ERR40000_JACKYUN_FAILED_TO_UPDATE = {
	code: '40000', name: 'Failed to update', message: 'Failed to update',
	additionalData: { subcode: 'GSE.SYSTEM_ERROR' }, status: 400
}

export type ErrorType =
	| ERR001_INVALID_REQUEST
	| ERR002_INCORRECT_PARAMETERS
	| ERR003_FAILED_TO_FETCH
	| ERR004_FAILED_TO_CREATE
	| ERR004_FAILED_TO_UPDATE
	| ERR004_FAILED_TO_DELETE
	| ERR006_USER_SESSION_EXPIRED
	| ERR005_NOT_AUTHENTICATED
	| ERR007_NOT_FOUND
	| ERR011_FAILED_TO_LOGIN
	| ERR012_FAILED_TO_REGISTER
	| ERR013_ALREADY_REGISTERED
	| ERR014_ALREADY_EXISTS
	| ERR021_MISSING_WX_OPENID
	| ERR022_INVALID_WX_SIGNATURE
	| ERR023_INVALID_WX_JSCODE
	| ERR028_COUPON_USAGE_LIMIT
	| ERR40000_JACKYUN_INVALID_SIGN
	| ERR40000_JACKYUN_FAILED_TO_FETCH
	| ERR40000_JACKYUN_FAILED_TO_UPDATE
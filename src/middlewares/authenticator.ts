import { Types } from 'mongoose'
import { ERR005_NOT_AUTHENTICATED } from '../errors/types'
import { BaseError } from '../errors'
import { UserModel, UserSchemaModel } from '../models/user'
import { JobPostModel, JobPostSchemaModel } from '../models/jobPost'
import { JobQuoteModel } from '../models/jobQuote'
import { TicketModel, TicketSchemaModel } from '../models/ticket'
import { UserRole } from '../constants/options'

/**
 * Middleware to authenticate web commands
 *
 * @param req
 * @param res
 * @param next
 */
export const webCommandAuthenticator = (req, res, next) => {
    const token = req.query.token
    if (token !== process.env.WEB_COMMAND_TOKEN) {
        next(new BaseError(ERR005_NOT_AUTHENTICATED))
    } else {
        next()
    }
}

/**
 * Middleware to authenticate users
 *
 * @param req
 * @param res
 * @param next
 */
export const userAuthenticator = (req, res, next) => {
    if (!req.user || req.user._id === undefined) {
        next(new BaseError(ERR005_NOT_AUTHENTICATED))
    } else {
        next()
    }
}

/**
 * Middleware to authenticate mpUsers
 *
 * @param req
 * @param res
 * @param next
 */
export const mpUserAuthenticator = (req, res, next) => {
    if (!req.mpUser || req.mpUser._id === undefined) {
        next(new BaseError(ERR005_NOT_AUTHENTICATED))
    } else {
        req.mpUserId = req.mpUser._id
        next()
    }
}

/**
 * Middleware to authenticate administrators
 *
 * @param req
 * @param res
 * @param next
 */
export const adminAuthenticator = (req, res, next) => {
    const admins = process.env.SUPER_ADMINS ? process.env.SUPER_ADMINS.split(',') : []
    const allowedRoles = [ 'admin', 'super-admin' ]
    if (req.adminUser && (admins.indexOf(req.adminUser.email) !== -1 || allowedRoles.indexOf(req.adminUser.role) !== -1)) {
        req.adminUser.isAdmin = true
        req.adminUser.isSuperAdmin = req.adminUser.role === 'super-admin' || admins.indexOf(req.adminUser.email) !== -1
        next()
    } else {
        next(new BaseError(ERR005_NOT_AUTHENTICATED))
    }
}

/**
 * Authentication Middleware for self JobPost
 *
 * @param req
 * @param res
 * @param next
 */
export const selfJobPostAuthenticator = (req, res, next) => {
    JobPostSchemaModel.findOne({ user: req.user._id }).then((foundJobPost: JobPostModel) => {
        if (!foundJobPost) {
            next(new BaseError(ERR005_NOT_AUTHENTICATED))
        } else {
            next()
        }
    })
}

/**
 * Authentication Middleware for self Quote
 *
 * @param req
 * @param res
 * @param next
 */
export const selfQuoteAuthenticator = (req, res, next) => {
    // JobQuoteSchemaModel.findOne({
    //     user: Types.ObjectId(req.user.id)
    // }).then((foundJobPost: JobQuoteModel) => {
    //     if (!foundJobPost) {
    //         next(new BaseError(ERR005_NOT_AUTHENTICATED))
    //     } else {
    //         next()
    //     }
    // })
}

/**
 * Authentication Middleware for user involved in the job
 *
 * @param req
 * @param res
 * @param next
 */
export const isUserInvolvedAuthenticator = (req, res, next) => {
    const jobId = req.params.jobId
    const userId = req.user.id
    JobPostSchemaModel.findOne({ _id: Types.ObjectId(jobId) })
        .then((job: JobPostModel) => {
            if (!job) {
                next(new BaseError(ERR005_NOT_AUTHENTICATED))
            } else {
                if (job && job.quotes.length) {
                    let foundUserInvolvement = (job.quotes as JobQuoteModel[]).filter(u => u.user == userId)
                    if (foundUserInvolvement.length === 0) {
                        next(new BaseError(ERR005_NOT_AUTHENTICATED))
                    }
                } else {
                    next(new BaseError(ERR005_NOT_AUTHENTICATED))
                }

                next()
            }
        })
}

/**
 * Middleware to authenticate tradeperson users
 *
 * @param req
 * @param res
 * @param next
 */
export const tradepersonUserAuthenticator = (req, res, next) => {
    UserSchemaModel.findOne({
        $and: [ { _id: Types.ObjectId(req.user.id) }, { tradeLevel: UserRole.TRADESPERSON } ]
    }).then((foundTradePerson: UserModel) => {
        console.log('foundTradePerson', foundTradePerson)
        if (!foundTradePerson) {
            next(new BaseError(ERR005_NOT_AUTHENTICATED))
        } else {
            next()
        }
    })
}


/**
 * Authentication Middleware for user milestone in the job post
 *
 * @param req
 * @param res
 * @param next
 */
export const isUserMilestoneAuthenticator = (req, res, next) => {
    const jobId = req.params.jobId
    const userId = req.user.id
    JobPostSchemaModel.findOne({ _id: Types.ObjectId(jobId) }).populate('milestones', 'user')
        .then((job: JobPostModel) => {
            if (!job) {
                next(new BaseError(ERR005_NOT_AUTHENTICATED))
            } else {
                if (job && job.milestones.length) {
                    let foundUserInvolvement = job.milestones.filter(u => u.user == userId)
                    if (foundUserInvolvement.length === 0) {
                        next(new BaseError(ERR005_NOT_AUTHENTICATED))
                    }
                } else {
                    next(new BaseError(ERR005_NOT_AUTHENTICATED))
                }

                next()
            }
        })
}

/**
 * Authentication Middleware for self Ticket
 *
 * @param req
 * @param res
 * @param next
 */
export const selfTicketAuthenticator = (req, res, next) => {
    const email = req.user.email
    TicketSchemaModel.findOne({
        email
    }).then((foundTicket: TicketModel) => {
        if (!foundTicket) {
            next(new BaseError(ERR005_NOT_AUTHENTICATED))
        } else {
            next()
        }
    })
}

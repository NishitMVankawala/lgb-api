import {
    fetchProfileById, getAllFollowableCompanies,
    getAllFollowablePeople,
    updateUserProfile,
    userFollow,
    userUnFollow
} from '../controllers/profile'
import { filterObject } from '../utils/stringUtils'
import { updatedFilterKeys } from '../models/user'

/**
 * Express route for fetching a user's profile by id
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const fetch = (req, res, next) => {
    const userId = req.user.id

    fetchProfileById(userId)
        .then(profile => res.json(profile))
        .catch(error => {
            next(error)
        })
}

/**
 * Express route for fetching a user's profile by id
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const fetchPublic = (req, res, next) => {
    const userId = req.params.userId

    fetchProfileById(userId)
        .then(profile => res.json(profile))
        .catch(error => next(error))
}

/**
 * Express route for updating a user's self profile
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const updateSelf = (req, res, next) => {
    const userId = req.user._id
    const updatedProfile = filterObject(req.body, updatedFilterKeys)

    updateUserProfile(userId, updatedProfile)
        .then(profile => res.json(profile))
        .catch(error => next(error))
}

/**
 * Express route for login-user following to other users
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const follow = (req, res, next) => {
    const followUserId = req.params.userId
    const userId = req.user.id

    userFollow(userId, followUserId)
        .then(user => res.json(user))
        .catch(error => next(error))
}

/**
 * Express route for login-user un-follow to other users
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const unfollow = (req, res, next) => {
    const userId = req.user.id
    const unfollowUserId = req.params.userId

    userUnFollow(userId, unfollowUserId)
        .then(user => res.json(user))
        .catch(error => next(error))
}

/**
 * Express route for fetching interests
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const fetchInterests = (req, res, next) => {

}

/**
 * Express route for fetching interests
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const fetchFollowablePeople = (req, res, next) => {
    const s = req.params.s || ''

    getAllFollowablePeople(s)
        .then(response => res.json(response))
        .catch(error => next(error))
}

/**
 * Express route for fetching interests
 *
 * @param req Request from Express
 * @param res Response from Express
 * @param next
 */
export const fetchFollowableCompanies = (req, res, next) => {
    const s = req.params.s || ''

    getAllFollowableCompanies(s)
        .then(response => res.json(response))
        .catch(error => next(error))
}
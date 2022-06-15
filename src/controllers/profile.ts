import { populateKeys, UserModel, UserSchemaModel } from '../models/user'
import { BaseError } from '../errors'
import { Types } from 'mongoose'
import {
    ERR003_FAILED_TO_FETCH,
    ERR004_FAILED_TO_UPDATE
} from '../errors/types'
import streamClient from '../utils/streamUtil'
import { UserRole } from '../constants/options'

export const fetchProfileById = (userId: string) => {
    return new Promise<UserModel>((resolve, reject) => {
        UserSchemaModel.findById(userId).populate('following')
            .then((user: UserModel) => resolve(user))
            .catch(error => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
    })
}


export const updateUserProfile = (userId: string, updatedProfile: any) => {
    return new Promise<UserModel>((resolve, reject) => {
        UserSchemaModel.findOneAndUpdate({ _id: userId }, { $set: updatedProfile }, { new: true })
            .then((profile: UserModel) => resolve(profile))
            .catch(error => reject(new BaseError(ERR004_FAILED_TO_UPDATE, error)))
    })
}

/**
 * Login-user following to other users
 *
 * @param followUserId
 * @param userId
 */
export const userFollow = (userId: string, followUserId: string) => {
    return new Promise<UserModel>(async (resolve, reject) => {
        try {
            const user = await UserSchemaModel.findOneAndUpdate({ _id: Types.ObjectId(userId) },
            { $addToSet: { following: followUserId } },
            { new: true })

            await UserSchemaModel.findOneAndUpdate({ _id: Types.ObjectId(followUserId) },
                { $addToSet: { followers: userId } },
                { new: true })

            const userFeed = streamClient.feed('user', userId)
            await userFeed.follow('user', followUserId)

            resolve(user)
        } catch (error) {
            reject(new BaseError(ERR004_FAILED_TO_UPDATE, error))
        }
    })
}

/**
 * Login-user un-follow to other users
 *
 * @param unFollowUserId
 * @param userId
 */
export const userUnFollow = (userId: string, unFollowUserId: string) => {
    return new Promise<UserModel>(async (resolve, reject) => {
        try {
            const user = UserSchemaModel.findOneAndUpdate({ _id: Types.ObjectId(userId) },
            { $pull: { following: unFollowUserId } },
            { new: true })

            await UserSchemaModel.findOneAndUpdate({ _id: Types.ObjectId(unFollowUserId) },
                { $pull: { followers: userId } },
                { new: true })

            const userFeed = streamClient.feed('user', userId)
            await userFeed.unfollow('user', unFollowUserId)

            resolve(user)
        } catch (error) {
            reject(new BaseError(ERR004_FAILED_TO_UPDATE, error))
        }
    })
}

/**
 * Fetch a list of followable people
 */
export const getAllFollowablePeople = (s?: string) => {
    return new Promise<UserModel[]>(async (resolve, reject) => {
        try {
            const people = await UserSchemaModel.aggregate([
                { $match: { role: { $in: [UserRole.CLIENT, UserRole.TRADESPERSON]}, name: { $regex: s, $options: 'i' } }},
                { $project: { ...populateKeys, 'followersLength': { '$size': { $ifNull: [ '$followers', [] ] } } } },
                { $sort: { 'followersLength': -1 } },
                { $limit: 10 }
            ])

            resolve(people)
        } catch (error) {
            reject(new BaseError(ERR003_FAILED_TO_FETCH, error))
        }
    })
}

/**
 * Fetch a list of followable people
 */
export const getAllFollowableCompanies = (s?: string) => {
    return new Promise<UserModel[]>(async (resolve, reject) => {
        try {
            const people = await UserSchemaModel.aggregate([
                { $match: { role: { $in: [UserRole.BUSINESS]}, name: { $regex: s, $options: 'i' } }},
                { $project: { ...populateKeys, 'followersLength': { '$size': { $ifNull: [ '$followers', [] ] } } } },
                { $sort: { 'followersLength': -1 } },
                { $limit: 10 }
            ])

            resolve(people)
        } catch (error) {
            reject(new BaseError(ERR003_FAILED_TO_FETCH, error))
        }
    })
}
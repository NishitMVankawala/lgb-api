import { Types } from 'mongoose'
import {
    ERR003_FAILED_TO_FETCH, ERR004_FAILED_TO_CREATE, ERR004_FAILED_TO_DELETE,
    ERR004_FAILED_TO_UPDATE,
    ERR007_NOT_FOUND
} from '../errors/types'
import { BaseError } from '../errors'
import { JobPostModel, JobPostRecord, JobPostSchemaModel, populateKeys } from '../models/jobPost'
import { JobMilestoneSchemaModel } from '../models/jobMilestone'
import { GeoPosition } from 'geo-position.ts/lib'
import { fetchProfileById } from './profile'
import { UserRole } from '../constants/options'
import { JobPostSaveData } from '../interfaces/jobPost'
import { SuccessResponse } from '../interfaces/generic'

require('../models/jobCategory')

/**
 * Fetch job post by status
 */
export const fetchFilterJobPost = (userId: string, userRole: string, status: string) => {
    return new Promise<ReadonlyArray<JobPostModel>>(async (resolve, reject) => {
        try {
            let condition: any = { status, user: userId, isDraft: false }

            if (userRole === UserRole.TRADESPERSON) {
                delete condition.user
                condition = { ...condition, 'quotes.user': userId }
            }

            if (status === 'DRAFT') {
                delete condition.status
                condition = { ...condition, isDraft: true }
            }

            if (status === 'PENDING') {
                condition = { $or: [ { ...condition, status: { $exists: false } }, { ...condition} ] }
            }

            const jobPosts = await JobPostSchemaModel.find(condition)
                .populate('user').populate('category')
                .populate('quotes').populate('quotes.user')
                .select(populateKeys)
                .sort('-updatedAt')

            resolve(jobPosts)
        } catch (error) {
            reject(new BaseError(ERR003_FAILED_TO_FETCH, error))
        }
    })
}

/**
 * Fetch single job post
 */
export const fetchSingleJobPost = (jobPostId: string) => {
    return new Promise<JobPostModel>((resolve, reject) => {
        try {
            const jobPost = JobPostSchemaModel.findOne({ _id: jobPostId })
                .populate('user').populate('category')

            resolve(jobPost)
        } catch (error) {
            reject(new BaseError(ERR003_FAILED_TO_FETCH, error))
        }
    })
}

/**
 * Create a post
 */
export const createJobPost = (userId: string, jobPostData: JobPostSaveData) => {
    return new Promise<JobPostModel>(async (resolve, reject) => {
        try {
            jobPostData.user = userId

            const jobPost = new JobPostSchemaModel(jobPostData)
            await jobPost.save()

            resolve(jobPost)
        } catch (error) {
            reject(new BaseError(ERR004_FAILED_TO_CREATE, error))
        }
    })
}

/**
 * Update job post
 */
export const updateJobPost = (jobPostId: string, updatedData: JobPostSaveData) => {
    return new Promise<JobPostModel>((resolve, reject) => {
        try {
            const jobPost = JobPostSchemaModel.findOneAndUpdate({ _id: jobPostId },
                { $set: updatedData }, { new: true })

            resolve(jobPost)
        } catch (error) {
            reject(new BaseError(ERR004_FAILED_TO_UPDATE, error))
        }
    })
}

/**
 * Publish a single job post
 */
export const publishJobPost = (jobPostId: string) => {
    return new Promise<JobPostModel>((resolve, reject) => {
        try {
            const jobPost = JobPostSchemaModel.findOneAndUpdate({ _id: jobPostId },
                { $set: { isDraft: false } }, { new: true })

            // TODO: Publish post on feed

            resolve(jobPost)
        } catch (error) {
            reject(new BaseError(ERR003_FAILED_TO_FETCH, error))
        }
    })
}

/**
 * Delete a draft job post
 */
export const deleteJobPost = (jobPostId: string) => {
    return new Promise<SuccessResponse>(async (resolve, reject) => {
        try {
            await JobPostSchemaModel.findOneAndDelete({ _id: jobPostId })
            resolve({ success: true })
        } catch (error) {
            reject(new BaseError(ERR004_FAILED_TO_DELETE, error))
        }
    })
}

// /**
//  * Fetch search job post
//  */
// export const fetchSearchJobPost = (jobPostId: string) => {
//     return new Promise<JobPostModel>((resolve, reject) => {
//         JobPostSchemaModel.findOne({ _id: jobPostId })
//             .then((jobPost: JobPostModel) => {
//                 if (jobPost) {
//                     resolve({ ...jobPost.toObject() })
//                 } else {
//                     reject(new BaseError(ERR007_NOT_FOUND))
//                 }
//             }).catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
//     })
// }

/**
 * Search for jobs using a query and category id
 */
export const fetchAllSearchJobPost = (query: string, categoryId?: string) => {
    return new Promise<ReadonlyArray<JobPostModel>>( async (resolve, reject) => {
        try {
            let condition: any = { title: { $regex: query, $options: 'i' }, isDraft: false }
            if (categoryId) condition = { ...condition, category: categoryId }

            const jobPosts = await JobPostSchemaModel.find(condition)
                .populate('user').populate('category').limit(10)
            resolve(jobPosts)
        } catch (error) {
            reject(new BaseError(ERR003_FAILED_TO_FETCH, error))
        }
    })
}


/**
 * Fetch job post by coordinates
 */
export const fetchSearchJobPostByMap = (coordinates: any, region?: string) => {
    return new Promise<JobPostModel[]>(async (resolve, reject) => {
        const regions = region ? { region: region.toLowerCase() } : {}
        try {

            let foundPosts = await JobPostSchemaModel.find({ isDraft: false }).populate('user')

            // let coordinatesMatch = [] as any
            // foundRegions = foundRegions.map(foundRegion => {
            //
            //     if (coordinates && coordinates.topLeft) {
            //         coordinates.topLeft
            //         const topLeftPoint = new GeoPosition(coordinates.topLeft.split(',')[0], coordinates.topLeft.split(',')[1])
            //         const bottomLeftPoint = new GeoPosition(coordinates.bottomLeft.split(',')[0], coordinates.bottomLeft.split(',')[1])
            //         const topRightPoint = new GeoPosition(coordinates.topRight.split(',')[0], coordinates.topRight.split(',')[1])
            //         const bottomRightPoint = new GeoPosition(coordinates.bottomRight.split[0], coordinates.bottomRight.split[1])
            //
            //         let area = [
            //             topLeftPoint,
            //             bottomLeftPoint,
            //             topRightPoint,
            //             bottomRightPoint
            //         ]
            //
            //         let isMatch = new GeoPosition(parseFloat(foundRegion.coordsLat), parseFloat(foundRegion.coordsLng)).IsInsideArea(area)
            //         console.log('isMatch', isMatch)
            //         if (isMatch) {
            //             coordinatesMatch.push(foundRegion.toObject())
            //         }
            //     }
            //
            //     return ({ ...foundRegion.toObject() })
            // })

            resolve(foundPosts)
        } catch (error) {
            reject(new BaseError(ERR003_FAILED_TO_FETCH, error))
        }
    })
}


/**
 * Create Rating
 *
 */
export const createRating = (jobId: string, userId: string, ratingData: any) => {
    return new Promise<JobPostModel>(async (resolve, reject) => {
        ratingData.user = userId

        const userInfo = await fetchProfileById(userId)

        const ratingObject = userInfo.tradeLevel === UserRole.CLIENT ? { clientReview: ratingData } : { tradespersonReview: ratingData }

        JobPostSchemaModel.findOneAndUpdate({ _id: jobId },
            { $push: ratingObject }, {/*  tslint: disable */
                new: true /*  tslint: enable  */
            }).then((user: JobPostModel) => resolve(user))
            .catch((error: any) => reject(new BaseError(ERR004_FAILED_TO_UPDATE, error)))
    })
}

/**
 * Fetch Job Rating
 */
export const FetchJobRating = (userId: string) => {
    return new Promise<ReadonlyArray<JobPostModel>>((resolve, reject) => {
        JobPostSchemaModel.find({ 'tradespersonReview.user': Types.ObjectId(userId) })
            .populate('user')
            .populate('tradespersonReview.user')
            .then((jobPost: ReadonlyArray<JobPostModel>) => {
                if (jobPost) {
                    resolve(jobPost)
                } else {
                    reject(new BaseError(ERR007_NOT_FOUND))
                }
            }).catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
    })
}

/**
 * Create a Milestone
 */
export const createJobPostMilestone = (jobPostId: string, userId: string, milestoneData: any) => {
    return new Promise<JobPostModel>((resolve, reject) => {
        milestoneData.user = userId

        const Milestone = new JobMilestoneSchemaModel(milestoneData)

        Milestone.save().then(milestoneSaved => {
            if (!milestoneSaved) {
                new BaseError(ERR004_FAILED_TO_UPDATE)
            } else {
                JobPostSchemaModel.findOneAndUpdate({ _id: jobPostId }, { $push: { milestones: milestoneSaved._id } }, { new: true })
                    .populate('milestones').then((milestone: JobPostModel) => resolve(milestone))
                    .catch(error => reject(new BaseError(ERR004_FAILED_TO_UPDATE, error)))
            }
        }).catch(error => reject(new BaseError(ERR004_FAILED_TO_UPDATE, error)))

    })
}

/**
 * Fetch current user Milestone
 */
export const fetchJobPostMilestone = (jobId: string, userId: string) => {
    return new Promise<any>((resolve, reject) => {
        JobPostSchemaModel.findById(jobId)
            .populate('milestones')
            .populate('milestones.user')
            .then((jobPost: JobPostModel) => {
                if (jobPost && jobPost.milestones.length) {
                    let foundUserInvolvement = jobPost.milestones.filter(u => u.user == userId)
                    resolve(foundUserInvolvement)
                } else {
                    reject(new BaseError(ERR007_NOT_FOUND))
                }
            }).catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
    })
}


/**
 * Update a Milestone
 */
export const updateMilestone = (jobPostId: string, milestoneId: string, bodyData: any) => {
    return new Promise<JobPostModel>((resolve, reject) => {

        JobPostSchemaModel.findOne({
            _id: jobPostId
        }).then((jobPost: JobPostModel) => {
            if (!jobPost) {
                reject(new BaseError(ERR004_FAILED_TO_UPDATE))
            } else {

                JobMilestoneSchemaModel.findOneAndUpdate({
                    _id: Types.ObjectId(milestoneId)
                }, {
                    $set: bodyData
                }, {
                    new: true
                })
                    .then((milestone: any) => {
                        if (!milestone) {
                            reject(new BaseError(ERR007_NOT_FOUND))
                        } else {
                            resolve(milestone)
                        }
                    }).catch((error: any) => reject(new BaseError(ERR007_NOT_FOUND, error)))
            }

        })
            .catch(error => reject(new BaseError(ERR004_FAILED_TO_UPDATE, error)))

    })
}


/**
 * Meeting request
 */
export const meetingRequest = (jobPostId: string) => {
    return new Promise<JobPostModel>((resolve, reject) => {

        JobPostSchemaModel.findOneAndUpdate({
            _id: Types.ObjectId(jobPostId)
        }, {
            $set: { isMeetingRequired: true }
        }, {
            new: true
        }).then((milestone: any) => {
            if (!milestone) {
                reject(new BaseError(ERR007_NOT_FOUND))
            } else {
                resolve(milestone)
            }
        }).catch((error: any) => reject(new BaseError(ERR007_NOT_FOUND, error)))
    })
}

/**
 * Admin Update job post
 */
export const adminUpdateJobPost = (jobPostId: string, updatedData: Partial<JobPostRecord>) => {
    return new Promise<JobPostModel>((resolve, reject) => {
        JobPostSchemaModel.findOneAndUpdate({ _id: jobPostId }, { $set: updatedData }, { new: true })
            .then((jobPost: JobPostModel) => resolve(jobPost))
            .catch(error => reject(new BaseError(ERR004_FAILED_TO_UPDATE, error)))
    })
}


/**
 * Admin Fetch single job post
 */
export const fetchJobPost = (jobPostId: string) => {
    return new Promise<JobPostModel>((resolve, reject) => {
        JobPostSchemaModel.findOne({ _id: jobPostId })
            .then((jobPost: JobPostModel) => {
                if (jobPost) {
                    resolve({ ...jobPost.toObject() })
                } else {
                    reject(new BaseError(ERR007_NOT_FOUND))
                }
            }).catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
    })
}

/**
 * Admin Fetch job post
 */
export const fetchAllJobPost = () => {
    return new Promise<[ JobPostModel ]>((resolve, reject) => {
        JobPostSchemaModel.find({})
            .then((jobPost: [ JobPostModel ]) => {
                if (jobPost.length) {
                    resolve(jobPost)
                } else {
                    reject(new BaseError(ERR007_NOT_FOUND))
                }
            }).catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
    })
}

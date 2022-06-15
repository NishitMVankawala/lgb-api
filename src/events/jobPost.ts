import { ERR004_FAILED_TO_CREATE } from '../errors/types'
import { BaseError } from '../errors'
import { NotificationModel, NotificationSchemaModel } from '../models/notification'
import { JobPostModel } from '../models/jobPost'
import { UserRecord } from '../models/user'

export interface NotificationQuote {
    user: Partial<UserRecord>
    quotes: any
}

/**
 * Notify a user for Job Post Review
 *
 * @param data
 */
export const notificationJobPostReview = (data: NotificationQuote) => {
    return new Promise<NotificationModel>((resolve, reject) => {
        console.log('notificationJobPostReview', data)
        let userId = data.user
        let jobPostId = (data as JobPostModel)._id
        const Notification = new NotificationSchemaModel({
            user: userId,
            message: 'User review on the job post',
            type: 'Review',
            additionalData: {
                model: 'JobPost',
                _id: jobPostId

            },
            isSeen: false
        })
        Notification.save().then((savedNotification: NotificationModel) =>
            savedNotification ? resolve(savedNotification) : reject(new BaseError(ERR004_FAILED_TO_CREATE)))
            .catch((error: any) => reject(new BaseError(ERR004_FAILED_TO_CREATE, error)))
    })
}

/**
 * Notify a client for Quote on the Job Post
 *
 * @param data
 */
export const notificationNewQuote = (data: NotificationQuote) => {
    return new Promise<NotificationModel>((resolve, reject) => {
        let userId = data.user
        let qouteId = data.quotes[data.quotes.length - 1]

        const Notification = new NotificationSchemaModel({
            user: userId,
            message: 'New Quote on the job post',
            type: 'NewQuote',
            additionalData: {
                model: 'JobQuote',
                _id: qouteId

            },
            isSeen: false
        })
        Notification.save().then((savedNotification: NotificationModel) =>
            savedNotification ? resolve(savedNotification) : reject(new BaseError(ERR004_FAILED_TO_CREATE)))
            .catch((error: any) => reject(new BaseError(ERR004_FAILED_TO_CREATE, error)))
    })
}

/**
 * Notify a client (Job Post Creator) for accepted Quote
 *
 */
export const notificationClientAcceptingQuote = async (data: any) => {
    // const to = [ data.email ]
    // const mailData = {
    // 	name: data.name,
    // 	link: data.link
    // }

    // const eb = new EmailBuilder(EMT001_RESET_PASSWORD, to, mailData)
    // await eb.send()
}

/**
 * Notify a tradesperson (Job Quote Creator) for accepted his Quote
 *
 */
export const notificationAcceptingQuote = async (data: any) => {
    // const to = [ data.email ]
    // const mailData = {
    // 	name: data.name,
    // 	link: data.link
    // }

    // const eb = new EmailBuilder(EMT001_RESET_PASSWORD, to, mailData)
    // await eb.send()
}

/**
 * Notify a Request a meeting
 *
 */
export const notificationMeetingRequest = async (data: any) => {
    // const to = [ data.email ]
    // const mailData = {
    // 	name: data.name,
    // 	link: data.link
    // }

    // const eb = new EmailBuilder(EMT001_RESET_PASSWORD, to, mailData)
    // await eb.send()
}
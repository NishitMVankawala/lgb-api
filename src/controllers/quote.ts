import { filterKeys as JobQuoteFilterKeys, JobQuoteModel } from '../models/jobQuote'
import { JobPostModel, JobPostSchemaModel } from '../models/jobPost'
import { JobQuoteRecord } from '../interfaces/jobQuote'
import { BaseError } from '../errors'
import {
    ERR004_FAILED_TO_CREATE,
    ERR004_FAILED_TO_UPDATE
} from '../errors/types'

/**
 * Create Quote for a job post
 */
export const createQuote = (userId: string, jobPostId: string, updatedData: Partial<JobQuoteRecord>) => {
    return new Promise<JobQuoteRecord>(async (resolve, reject) => {
        try {
            updatedData.user = userId

            const jobPost = await JobPostSchemaModel.findOneAndUpdate({ _id: jobPostId },
                { $addToSet: { quotes: updatedData as JobQuoteRecord } }, { new: true })

            const quote = jobPost.quotes.find(q => q.user === userId)
            resolve(quote)
        } catch (error) {
            reject(new BaseError(ERR004_FAILED_TO_CREATE, error))
        }
    })
}

/**
 * Update a single quote detail
 */
export const updateQuote = (quoteId: string, quoteData: Partial<JobQuoteRecord>) => {
    return new Promise<JobQuoteModel>(async (resolve, reject) => {
        try {
            const updateKeys = JobQuoteFilterKeys

            const updatedObject = {}
            updateKeys.forEach((uk) => {
                if (quoteData.hasOwnProperty(uk)) {
                    updatedObject['quotes.$.' + uk] = quoteData[uk]
                }
            })

            let jobQuote = null
            const jobPost = await JobPostSchemaModel.findOneAndUpdate({ 'quotes._id': quoteId },
                { $set: updatedObject }, { new: true })

            if (jobPost) {
                jobQuote = jobPost.quotes.find((quote: JobQuoteModel) => quote._id.toString() === quoteId)
            }

            resolve(jobQuote)
        } catch (error) {
            reject(new BaseError(ERR004_FAILED_TO_UPDATE, error))
        }
    })
}

/**
 * Publish a quote
 */
export const publishQuote = (quoteId: string, quoteData: Partial<JobQuoteRecord>) => {
    return new Promise<JobQuoteModel>(async (resolve, reject) => {
        try {
            const updatedObject = { 'quotes.$.isDraft': false }
            let jobQuote = null

            const jobPost = await JobPostSchemaModel.findOneAndUpdate({ 'quotes._id': quoteId },
                { $set: updatedObject }, { new: true })

            if (jobPost) {
                jobQuote = jobPost.quotes.find((quote: JobQuoteModel) => quote._id.toString() === quoteId)
            }

            resolve(jobQuote)
        } catch (error) {
            reject(new BaseError(ERR004_FAILED_TO_UPDATE, error))
        }
    })
}

/**
 * Accept a quote
 */
export const acceptQuote = (jobId: string, quoteId: string) => {
    return new Promise<JobPostModel>(async (resolve, reject) => {
        try {
            const jobPost = await JobPostSchemaModel.findOneAndUpdate({ _id: jobId },
                { $set: { acceptedQuote: quoteId, status: 'ACTIVE' } }, { new: true })
                .populate('user')
                .populate('acceptedQuote')
                .populate('acceptedQuote.user')

            resolve(jobPost)
        } catch (error) {
            reject(new BaseError(ERR004_FAILED_TO_UPDATE, error))
        }
    })
}

/**
 * Fetch a single quote
 */
export const fetchQuote = (userId: string, jobId: string, quoteId: string) => {
    return new Promise<JobQuoteModel>(async (resolve, reject) => {
        try {
            const jobPost = await JobPostSchemaModel.findOne({ _id: jobId })
                .populate('user')

            let jobQuote = null

            if (jobPost) {
                jobQuote = (jobPost.quotes as JobQuoteModel[]).find(q => q._id.toString() === quoteId.toString())
            }

            resolve(jobQuote)
        } catch (error) {
            reject(new BaseError(ERR004_FAILED_TO_UPDATE, error))
        }
    })
}

/**
 * Fetch a single quote detail
 */
export const fetchUserJobQuote = (userId: string, jobId: string) => {
    return new Promise<JobQuoteModel>(async (resolve, reject) => {
        try {
            const jobPost = await JobPostSchemaModel.findOne({ _id: jobId })
                .populate('user')

            let jobQuote = null

            if (jobPost) {
                jobQuote = (jobPost.quotes as JobQuoteModel[]).find(q => q.user.toString() === userId.toString())
            }

            resolve(jobQuote)
        } catch (error) {
            reject(new BaseError(ERR004_FAILED_TO_UPDATE, error))
        }
    })
}
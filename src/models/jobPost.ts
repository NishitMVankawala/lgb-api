import { Document, Model, model, Schema } from 'mongoose'
import { check } from 'express-validator'

import { populateKeys as UserPopulateKeys, UserModel, UserRecord } from './user'
import { FileSchema } from './file'
import { JobCategoryModel, JobCategoryRecord } from './jobCategory'
import { IFile } from '../interfaces/message'
import { JobRating } from '../interfaces/jobPost'
import { JobQuoteRecord } from '../interfaces/jobQuote'
import { JobQuoteSchema } from './jobQuote'

/**
 * Validation Keys
 */
export const validationKeys = [
    check('title').exists(),
    check('title').not().isEmpty(),
    check('category').exists(),
    check('category').not().isEmpty(),
    check('description').exists(),
    check('description').not().isEmpty()
]

export const filterKeys = [ 'title', 'description', 'category', 'staffNeeded', 'isMeetingRequired', 'gallery',
    'region', 'city', 'country', 'coordsLat', 'coordsLng', 'address', 'isDraft', 'shouldUpdateSocialFeed']

export const populateKeys = { title: 1, description: 1, category: 1, staffNeeded: 1, isMeetingRequired: 1, gallery: 1,
    region: 1, city: 1, country: 1, coordsLat: 1, coordsLng: 1, isDraft: 1, shouldUpdateSocialFeed: 1, quotes: 1, acceptedQuote: 1  }

/**
 * Model for JobPosts
 */
export interface JobPostRecord {
    user: string | UserRecord | UserModel
    title: string
    description: string
    category: string | JobCategoryRecord | JobCategoryModel
    staffNeeded: number
    isMeetingRequired: boolean
    gallery: [ IFile ]

    address: string
    region: string
    city: string
    country: string
    coordsLat: string
    coordsLng: string

    quotes: JobQuoteRecord[]
    acceptedQuote: string

    tradespersonReview: JobRating[]
    clientReview: JobRating[]
    milestones: any[]

    notes: string

    status: string
    isDraft: boolean
}

const JobRatingSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        populate: { select: UserPopulateKeys }
    },
    personality: Number,
    readability: Number,
    comments: String
}, {
    timestamps: true
})

export interface JobPostModel extends JobPostRecord, Document {}
const JobPostSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        populate: { select: UserPopulateKeys }
    },
    title: String,
    description: String,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'JobCategory'
    },
    staffNeeded: Number,
    isMeetingRequired: Boolean,
    gallery: [ FileSchema ],
    address: String,
    region: String,
    city: String,
    country: {
        type: String,
        default: 'NZ'
    },
    coordsLat: String,
    coordsLng: String,
    tradespersonReview: [ JobRatingSchema ],
    clientReview: [ JobRatingSchema ],
    quotes: [JobQuoteSchema],
    acceptedQuote: Schema.Types.ObjectId,
    notes: String,
    status: {
        type: String,
        default: 'PENDING'
    }, // 'PENDING', 'ACTIVE', 'COMPLETE'
    isDraft: {
        type: Boolean,
        default: true
    },
    shouldUpdateSocialFeed: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

JobPostSchema.pre('init', (doc: any) => {
    doc._acceptedQuote = doc.quotes.find(q => String(q._id) === String(doc.acceptedQuote))
})

export const JobPostSchemaModel: Model<JobPostModel> = model<JobPostModel>('jobPost', JobPostSchema)
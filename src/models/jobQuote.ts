import * as shortid from 'shortid'
import { Document, Schema } from 'mongoose'
import { JobQuoteRecord } from '../interfaces/jobQuote'
import { populateKeys as UserPopulateKeys } from './user'
import { FaqSchema, i18nKeys } from './faq'

export const filterKeys = [ 'ref', 'date', 'message', 'materials', 'labourCost', 'labourHours', 'toName', 'fromName',
    'toAddress', 'fromAddress', 'toCompany', 'fromCompany', 'toPostcode', 'fromPostcode' ]

/**
 * Model for JobQuote
 */
const MaterialsSchema: Schema = new Schema({
	name: String,
	price: Number
})

export interface JobQuoteModel extends JobQuoteRecord, Document {}
export const JobQuoteSchema: Schema = new Schema({
    uniqueId: {
		type: String,
		default: shortid.generate
	},
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        populate: { select: UserPopulateKeys }
    },
    ref: String,
    toName: String,
    toAddress: String,
    toPostcode: String,
    toCompany: String,
    fromName: String,
    fromAddress: String,
    fromPostcode: String,
    fromCompany: String,
    date: {
        type: Date,
        default: Date.now
    },
    message: String,
    materials: [ MaterialsSchema ],
    labourHours: Number,
    labourCost: Number,
    milestones: [{
        type: Schema.Types.ObjectId,
        ref: 'JobMilestone'
    }],
    isDraft: {
        type: Boolean,
        default: true
    }
}, {
	timestamps: true
})

JobQuoteSchema.pre('init', (doc: any) => {
    doc.total = doc.labourCost
    doc.materials.map(m => doc.total+= m.price)
})
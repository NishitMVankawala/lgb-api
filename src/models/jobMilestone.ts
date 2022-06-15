import { Document, Model, model, Schema } from 'mongoose'
import { JobMilestoneRecord } from '../interfaces/jobMilestone'
import { populateKeys as UserPopulateKeys } from './user'

/**
 * Job Milestone Model
 */
export interface JobMilestoneModel extends JobMilestoneRecord, Document {}
export const JobMilestoneSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        populate: { select: UserPopulateKeys }
    },
    breakdown: [{
        milestone: String,
        price: Number
    }],
    grandTotal: Number,
    message: String
},{
    timestamps: true
})


export const JobMilestoneSchemaModel: Model<JobMilestoneModel> = model<JobMilestoneModel>('JobMilestone', JobMilestoneSchema)
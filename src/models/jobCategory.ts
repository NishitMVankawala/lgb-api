import { check } from 'express-validator'
import { Document, model, Schema } from 'mongoose'
import { I18nModel } from '../interfaces/i18n'

/**
 * Validation Keys
 */
export const validationKeys = [
	check('title').not().isEmpty()
]
export const filterKeys = ['title', 'thumbnailImageUrl']

/**
 * Job Category Record
 */
export interface JobCategoryRecord {
	title: string
	thumbnailImageUrl: string
	sortOrder: number
}

/**
 * Job Category Model
 */
export interface JobCategoryModel extends JobCategoryRecord, I18nModel, Document {}
export const JobCategorySchema: Schema = new Schema({
	title: {
		type: String,
		required: true
	},
	thumbnailImageUrl: String,
	sortOrder: {
		type: Number,
		default: 0
	}
}, {
	timestamps: true,
	toJSON: {
		virtuals: true
	}
})

export const JobCategorySchemaModel = model<JobCategoryModel>('JobCategory', JobCategorySchema)
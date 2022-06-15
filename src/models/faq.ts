import * as mongooseIntl from 'mongoose-intl'
import { check } from 'express-validator'
import { Document, model, Schema } from 'mongoose'
import { I18nField, I18nModel } from '../interfaces/i18n'
import { Language } from '../constants/language'
import { FaqCategoryModel, FaqCategoryRecord } from './faqCategory'

/**
 * Validation Keys
 */
export const validationKeys = [
	check('title').not().isEmpty(),
	check('content').not().isEmpty()
]
export const filterKeys = ['title', 'content', 'category']
export const i18nKeys = ['title', 'content']

/**
 * FAQ Record
 */
export interface FaqRecord {
	title: string | I18nField
	content: string | I18nField
	category: string | FaqCategoryRecord | FaqCategoryModel
	sortOrder: number
}

/**
 * Faq Model
 */
export interface FaqModel extends FaqRecord, I18nModel, Document {}
export const FaqSchema: Schema = new Schema({
	title: {
		type: String,
		intl: true,
		required: true
	},
	content: {
		type: String,
		intl: true
	},
	category: {
		type: Schema.Types.ObjectId,
		ref: 'FaqCategory'
	},
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

FaqSchema.pre('init', (doc: any) => {
	i18nKeys.map(key => {
		doc[`${key}_i18n`] = doc[key]
	})
})

FaqSchema.plugin(mongooseIntl, {
	languages: [Language.ENGLISH, Language.CHINESE],
	defaultLanguage: Language.ENGLISH
})

export const FaqSchemaModel = model<FaqModel>('Faq', FaqSchema)
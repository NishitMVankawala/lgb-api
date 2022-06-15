import * as mongooseIntl from 'mongoose-intl'
import { check } from 'express-validator'
import { Document, model, Schema } from 'mongoose'
import { I18nField, I18nModel } from '../interfaces/i18n'
import { Language } from '../constants/language'

/**
 * Validation Keys
 */
export const validationKeys = [
	check('title').not().isEmpty()
]
export const filterKeys = ['title']
export const i18nKeys = ['title']

/**
 * Faq Category Record
 */
export interface FaqCategoryRecord {
	title: string | I18nField
	sortOrder: number
}

/**
 * Faq Category Model
 */
export interface FaqCategoryModel extends FaqCategoryRecord, I18nModel, Document {}
export const FaqCategorySchema: Schema = new Schema({
	title: {
		type: String,
		intl: true,
		required: true
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

FaqCategorySchema.pre('init', (doc: any) => {
	i18nKeys.map(key => {
		doc[`${key}_i18n`] = doc[key]
	})
})

FaqCategorySchema.plugin(mongooseIntl, {
	languages: [Language.ENGLISH, Language.CHINESE],
	defaultLanguage: Language.ENGLISH
})

export const FaqCategorySchemaModel = model<FaqCategoryModel>('FaqCategory', FaqCategorySchema)
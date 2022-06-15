import { FaqModel, FaqRecord, FaqSchemaModel } from '../models/faq'
import { BaseError } from '../errors'
import {
	ERR003_FAILED_TO_FETCH,
	ERR004_FAILED_TO_CREATE,
	ERR004_FAILED_TO_DELETE,
	ERR004_FAILED_TO_UPDATE
} from '../errors/types'

export const fetchAllFaqs = (faqCategoryId?: string, language?: string) => {
	return new Promise<FaqModel[]>(async (resolve, reject) => {
		try {
			let result = []
			
			if (faqCategoryId) {
				result = await FaqSchemaModel.find({ category: faqCategoryId }).sort('sortOrder')
			}
			
			result = result.map(faq => {
				faq.setLanguage(language)
				return faq
			})
			
			resolve(result)
		} catch (error) {
			reject(new BaseError(ERR003_FAILED_TO_FETCH, error))
		}
	})
}

export const fetchFaq = (faqId: string, language: string) => {
	return new Promise<FaqModel>(async (resolve, reject) => {
		try {
			const faq = await FaqSchemaModel.findOne({ _id: faqId }).populate('category')
			faq.setLanguage(language)
			resolve(faq)
		} catch (error) {
			reject(new BaseError(ERR003_FAILED_TO_FETCH, error))
		}
	})
}

export const createFaq = (faqData: Partial<FaqRecord>) => {
	return new Promise<FaqModel>(async (resolve, reject) => {
		try {
			const faq = new FaqSchemaModel(faqData)
			const newFaq = faq.save()
			
			if (!newFaq) { reject((new BaseError(ERR004_FAILED_TO_CREATE))) } else {
				resolve(newFaq)
			}
		} catch (error) {
			reject(new BaseError(ERR004_FAILED_TO_CREATE, error))
		}
	})
}

export const updateFaq = (faqId: string, faqData: Partial<FaqRecord>) => {
	return new Promise<FaqModel>(async (resolve, reject) => {
		try {
			const faq = await FaqSchemaModel.findOneAndUpdate(
				{ _id: faqId }, { $set: faqData }, { new: true })
			resolve(faq)
		} catch (error) {
			reject(new BaseError(ERR004_FAILED_TO_UPDATE, error))
		}
	})
}

export const removeFaq = (faqId: string) => {
	return new Promise<FaqModel>(async (resolve, reject) => {
		try {
			const response = await FaqSchemaModel.findOneAndRemove({ _id: faqId })
			
			if (!response) { reject(new BaseError(ERR004_FAILED_TO_DELETE)) } else {
				resolve(response)
			}
		} catch (error) {
			reject(new BaseError(ERR004_FAILED_TO_UPDATE, error))
		}
	})
}

export const sortFaq = (faqs: Partial<FaqModel>[]) => {
	return new Promise<FaqModel[]>(async (resolve, reject) => {
		try {
			const response = await Promise.all(faqs.map(category => {
				return FaqSchemaModel.findByIdAndUpdate(category._id,
					{ $set: { sortOrder: category.sortOrder }}, { new: true })
			}))
			
			resolve(response)
		} catch (error) {
			reject(new BaseError(ERR004_FAILED_TO_UPDATE, error))
		}
	})
}
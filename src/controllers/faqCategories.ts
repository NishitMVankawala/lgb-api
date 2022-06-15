import { FaqCategoryModel, FaqCategoryRecord, FaqCategorySchemaModel } from '../models/faqCategory'
import { BaseError } from '../errors'
import {
	ERR003_FAILED_TO_FETCH,
	ERR004_FAILED_TO_CREATE,
	ERR004_FAILED_TO_DELETE,
	ERR004_FAILED_TO_UPDATE
} from '../errors/types'

export const fetchAllFaqCategories = (language: string) => {
	return new Promise<FaqCategoryModel[]>(async (resolve, reject) => {
		try {
			let result = await FaqCategorySchemaModel.find({}).sort('sortOrder')
			
			result = result.map(post => {
				post.setLanguage(language)
				return post
			})
			
			resolve(result)
		} catch (error) {
			reject(new BaseError(ERR003_FAILED_TO_FETCH, error))
		}
	})
}

export const fetchFaqCategory = (faqCategoryId: string, language: string) => {
	return new Promise<FaqCategoryModel>(async (resolve, reject) => {
		try {
			const faqCategory = await FaqCategorySchemaModel.findOne({ _id: faqCategoryId })
			faqCategory.setLanguage(language)
			resolve(faqCategory)
		} catch (error) {
			reject(new BaseError(ERR003_FAILED_TO_FETCH, error))
		}
	})
}

export const createFaqCategory = (faqCategoryData: Partial<FaqCategoryRecord>) => {
	return new Promise<FaqCategoryModel>(async (resolve, reject) => {
		try {
			const faqCategory = new FaqCategorySchemaModel(faqCategoryData)
			const newFaqCategory = faqCategory.save()
			
			if (!newFaqCategory) { reject((new BaseError(ERR004_FAILED_TO_CREATE))) } else {
				resolve(newFaqCategory)
			}
		} catch (error) {
			reject(new BaseError(ERR004_FAILED_TO_CREATE, error))
		}
	})
}

export const updateFaqCategory = (faqCategoryId: string, faqCategoryData: Partial<FaqCategoryRecord>) => {
	return new Promise<FaqCategoryModel>(async (resolve, reject) => {
		try {
			const faqCategory = await FaqCategorySchemaModel.findOneAndUpdate(
				{ _id: faqCategoryId }, { $set: faqCategoryData }, { new: true })
			resolve(faqCategory)
		} catch (error) {
			reject(new BaseError(ERR004_FAILED_TO_UPDATE, error))
		}
	})
}

export const removeFaqCategory = (faqCategoryId: string) => {
	return new Promise<FaqCategoryModel>(async (resolve, reject) => {
		try {
			const response = await FaqCategorySchemaModel.findOneAndRemove({ _id: faqCategoryId })
			
			if (!response) { reject(new BaseError(ERR004_FAILED_TO_DELETE)) } else {
				resolve(response)
			}
		} catch (error) {
			reject(new BaseError(ERR004_FAILED_TO_UPDATE, error))
		}
	})
}

export const sortFaqCategories = (faqCategories: Partial<FaqCategoryModel>[]) => {
	return new Promise<FaqCategoryModel[]>(async (resolve, reject) => {
		try {
			const response = await Promise.all(faqCategories.map(category => {
				return FaqCategorySchemaModel.findByIdAndUpdate(category._id,
					{ $set: { sortOrder: category.sortOrder }}, { new: true })
			}))
			
			resolve(response)
		} catch (error) {
			reject(new BaseError(ERR004_FAILED_TO_UPDATE, error))
		}
	})
}
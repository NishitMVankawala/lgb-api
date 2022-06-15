import {
    ERR003_FAILED_TO_FETCH,
    ERR004_FAILED_TO_UPDATE,
    ERR007_NOT_FOUND,
	ERR004_FAILED_TO_CREATE,
	ERR004_FAILED_TO_DELETE
} from '../errors/types'
import { BaseError } from '../errors'
import { PageCategoryModel, PageCategorySchemaModel } from '../models/pageCategory'

/**
 * Create a PageCategory
 */
export const adminCreatePageCategory = (pageCategoryData: any) => {
	return new Promise<PageCategoryModel>((resolve, reject) => {
		const PageCatagory = new PageCategorySchemaModel(pageCategoryData)
		PageCatagory.save().then((saved: PageCategoryModel) =>
			saved ? resolve(saved) : reject(new BaseError(ERR004_FAILED_TO_CREATE)))
			.catch((error: any) => reject(new BaseError(ERR004_FAILED_TO_CREATE, error)))
	})
}


/**
 * Update a PageCategory
 */
export const adminUpdatePageCategory = (pageCategoryId: string, updateData: any) => {
	return new Promise<PageCategoryModel>((resolve, reject) => {
		const Page = PageCategorySchemaModel.findOneAndUpdate({ _id: pageCategoryId }, { $set: updateData }, { new: true })
        .then((pageCategory: PageCategoryModel) =>
            pageCategory ? resolve(pageCategory) : reject(new BaseError(ERR007_NOT_FOUND)))
			.catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
	})
}

/**
 * Fetch single PageCategory
 */
export const adminFetchSinglePageCategory = (pageCategoryId: string) => {
	return new Promise<PageCategoryModel>((resolve, reject) => {
		PageCategorySchemaModel.findOne({ _id: pageCategoryId })
			.then((pageCategory:PageCategoryModel) => {
				if (pageCategory) {
					resolve({ ...pageCategory.toObject() })
				} else {
					reject(new BaseError(ERR007_NOT_FOUND))
				}
			}).catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
	})
}

/**
 * Fetch PageCategories
 */
export const adminFetchPageCategory = () => {
	return new Promise<any>((resolve, reject) => {
		PageCategorySchemaModel.find({})
			.then((pageCategory:any) => {
				if (pageCategory.length) {
					resolve(pageCategory)
				} else {
					reject(new BaseError(ERR007_NOT_FOUND))
				}
			}).catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
	})
}

/**
 * Sort order the PageCategory
 */
export const sortPageCategory = (pageCategories: Partial<PageCategoryModel>[]) => {
	return new Promise<PageCategoryModel[]>(async (resolve, reject) => {
		try {
			const response = await Promise.all(pageCategories.map(pageCategory => {
				return PageCategorySchemaModel.findByIdAndUpdate(pageCategory._id,
					{ $set: { sortOrder: pageCategory.sortOrder }}, { new: true })
			}))
			
			resolve(response)
		} catch (error) {
			reject(new BaseError(ERR004_FAILED_TO_UPDATE, error))
		}
	})
}

/**
 * Remove PageCategory
 */
export const removePageCategory = (pageCategoryId: string) => {
	return new Promise<PageCategoryModel>(async (resolve, reject) => {
		try {
			const response = await PageCategorySchemaModel.findOneAndRemove({ _id: pageCategoryId })
			
			if (!response) { reject(new BaseError(ERR004_FAILED_TO_DELETE)) } else {
				resolve(response)
			}
		} catch (error) {
			reject(new BaseError(ERR004_FAILED_TO_UPDATE, error))
		}
	})
}
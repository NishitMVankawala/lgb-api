import {
    ERR003_FAILED_TO_FETCH,
    ERR004_FAILED_TO_UPDATE,
    ERR007_NOT_FOUND,
	ERR004_FAILED_TO_CREATE,
	ERR004_FAILED_TO_DELETE
} from '../errors/types'
import { BaseError } from '../errors'
import { PageModel, PageSchemaModel } from '../models/page'

/**
 * Create a page
 */
export const adminCreatePage = (pageData: any) => {
	return new Promise<PageModel>((resolve, reject) => {
		const Page = new PageSchemaModel(pageData)
		Page.save().then((savedPage: PageModel) =>
			savedPage ? resolve(savedPage) : reject(new BaseError(ERR004_FAILED_TO_CREATE)))
			.catch((error: any) => reject(new BaseError(ERR004_FAILED_TO_CREATE, error)))
	})
}


/**
 * Update a page
 */
export const adminUpdatePage = (pageId: string, updateData: any) => {
	return new Promise<PageModel>((resolve, reject) => {
		const Page = PageSchemaModel.findOneAndUpdate({ _id: pageId }, { $set: updateData }, { new: true })
        .then((page: PageModel) =>
            page ? resolve(page) : reject(new BaseError(ERR007_NOT_FOUND)))
			.catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
	})
}

/**
 * Fetch single page
 */
export const adminFetchSinglePage = (pageId: string) => {
	return new Promise<PageModel>((resolve, reject) => {
		PageSchemaModel.findOne({ _id: pageId })
			.then((page:PageModel) => {
				if (page) {
					resolve({ ...page.toObject() })
				} else {
					reject(new BaseError(ERR007_NOT_FOUND))
				}
			}).catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
	})
}

/**
 * Fetch pages
 */
export const adminFetchPage = () => {
	return new Promise<any>((resolve, reject) => {
		PageSchemaModel.find({})
			.then((page:any) => {
				if (page.length) {
					resolve(page)
				} else {
					reject(new BaseError(ERR007_NOT_FOUND))
				}
			}).catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
	})
}

/**
 * Sort order the page
 */
export const sortPage = (pages: Partial<PageModel>[]) => {
	return new Promise<PageModel[]>(async (resolve, reject) => {
		try {
			const response = await Promise.all(pages.map(page => {
				return PageSchemaModel.findByIdAndUpdate(page._id,
					{ $set: { sortOrder: page.sortOrder }}, { new: true })
			}))
			
			resolve(response)
		} catch (error) {
			reject(new BaseError(ERR004_FAILED_TO_UPDATE, error))
		}
	})
}

/**
 * Remove the page
 */
export const removePage = (pageId: string) => {
	return new Promise<PageModel>(async (resolve, reject) => {
		try {
			const response = await PageSchemaModel.findOneAndRemove({ _id: pageId })
			
			if (!response) { reject(new BaseError(ERR004_FAILED_TO_DELETE)) } else {
				resolve(response)
			}
		} catch (error) {
			reject(new BaseError(ERR004_FAILED_TO_UPDATE, error))
		}
	})
}

/**
 * Fetch single page
 */
export const publicFetchSinglePage = (pageId: string) => {
	return new Promise<PageModel>((resolve, reject) => {
		PageSchemaModel.findOne({ _id: pageId })
			.then((page:PageModel) => {
				if (page) {
					resolve({ ...page.toObject() })
				} else {
					reject(new BaseError(ERR007_NOT_FOUND))
				}
			}).catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
	})
}

/**
 * fetch  page by tags
 */
export const fetchPageBySlugs = (slug: string) => {
	return new Promise<PageModel>((resolve, reject) => {
		PageSchemaModel.findOne({slug})
			.then((page:PageModel) => {
				resolve(page)
			}).catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
	})
}
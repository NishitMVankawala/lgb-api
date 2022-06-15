import { Document, Model, model, Schema} from 'mongoose'
import { PageCategoryRecord } from '../interfaces/pageCategory'

export const filterKeys = ['title','sortOrder']

export interface PageCategoryModel extends PageCategoryRecord, Document {}
export const PageCategorySchema: Schema = new Schema({
    title: {
        type: String
    },
    sortOrder: {
        type: Number,
        /* tslint:disable */
        default: 0  /* tslint:enable */
    }
}, {
	timestamps: true
})

export const PageCategorySchemaModel: Model<PageCategoryModel> =
	model<PageCategoryModel>('PageCategory', PageCategorySchema)
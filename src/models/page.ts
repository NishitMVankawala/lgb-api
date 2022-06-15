import { Document, Model, model, Schema} from 'mongoose'
import { PageRecord } from '../interfaces/page'


export const filterKeys = ['slug','title','category','featuredImageUrl','content','sortOrder']

/**
 * Content Module
 */
export const ContentModuleSchema: Schema = new Schema({
	module: String,
	fields: [{
		key: String,
		label: String,
		input: String,
		value: Schema.Types.Mixed
	}]
}, {
	timestamps: true
})

/**
 * Page Model
 */
export interface PageModel extends PageRecord, Document {}
export const PageSchema: Schema = new Schema({

    slug: {
        type: String
    },
    title: {
        type: String
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'PageCategory'
    },
    featuredImageUrl: {
        type: String
    },
    content: [ContentModuleSchema],

    sortOrder: {
        type: Number,
        /* tslint:disable */
        default: 0 /* tslint:enable */
    }
}, {
	timestamps: true
})

export const PageSchemaModel: Model<PageModel> =
	model<PageModel>('Page', PageSchema)
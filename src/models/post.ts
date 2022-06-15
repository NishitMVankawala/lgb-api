import * as MongoosePaginate from 'mongoose-paginate'

import { Document, Model, model, Schema, PaginateModel} from 'mongoose'
import * as shortid from 'shortid'

import { PostRecord } from '../interfaces/posts'

const CommentSchema: Schema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	body: String
}, {
	timestamps: true
})

const GallerySchema: Schema = new Schema({
	previewUrl: String,
	caption: String,
	fileType: String,
	mimeType: String
}, {
	timestamps: true
})

export interface PostModel extends PostRecord, Document {}
export const PostSchema: Schema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	shortId: {
		type: String,
		/* tslint:disable */
		'default': shortid.generate /* tslint:enable */
	},
	body: String,
	gallery: [GallerySchema],
	tags: [String],
	comments: [CommentSchema],
	likes: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}], // Ids of all users who have liked the post
	likeCount: Number,
	isDraft: Boolean
}, {
	timestamps: true
})

PostSchema.pre('init', (doc: any) => {
	
	if(doc && doc.likes && doc.likes.length){
		doc.likeCount = doc.likes.length
	}
})

PostSchema.plugin(MongoosePaginate)

interface PostPaginateModel<T extends Document> extends PaginateModel<T> {}
export const PostSchemaModel: PostPaginateModel<PostModel> = model<PostModel>('Post', PostSchema)

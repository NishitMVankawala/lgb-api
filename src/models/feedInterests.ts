import { Document, Model, model, Schema } from 'mongoose'
import {FeedInterestsRecord} from '../interfaces/feedInterests'

/**
 * Feed Interests Model
 */
export interface FeedInterestsModel extends FeedInterestsRecord, Document {}


export const FeedInterestsSchema: Schema = new Schema({
    thumbnailImageUrl: String,
	title: String	
},{
    timestamps: true
})


export const FeedInterestsSchemaModel: Model<FeedInterestsModel> = model<FeedInterestsModel>('FeedInterest', FeedInterestsSchema)
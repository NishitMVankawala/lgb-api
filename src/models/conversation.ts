import { Document, Model, model, Schema } from 'mongoose'
import { ConversationRecord } from '../interfaces/conversation'
import { populateKeys as UserPopulateKeys } from './user'

/**
 * Conversation model
 */
export interface ConversationModel extends ConversationRecord, Document { }
export const ConversationSchema: Schema = new Schema({
    recipients: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        populate: { select: UserPopulateKeys }
    }]
}, {
    timestamps: true
})

export const ConversationSchemaModel: Model<ConversationModel> =
    model<ConversationModel>('Conversation', ConversationSchema)
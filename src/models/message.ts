import { Document, Model, model, Schema } from 'mongoose'
import { MessageRecord } from '../interfaces/message'
import { populateKeys as UserPopulateKeys } from './user'
import { FileSchema } from './file'

/**
 * Message model
 */
export interface MessageModel extends MessageRecord, Document { }
export const MessageSchema: Schema = new Schema({
    conversation: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        populate: { select: UserPopulateKeys },
        required: true
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        populate: { select: UserPopulateKeys }
    },
    body: {
        type: String,
        default: null
    },
    type: {
        type: String,
        default: 'message'
    },
    metaType: {
        type: String
    },
    metaData: [{
        key: String,
        value: String
    }],
    attachments: [ FileSchema ],
    isSeen: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        populate: { select: UserPopulateKeys }
    }],
    date: {
        type: String,
        default: Date.now
    }
}, {
    timestamps: true
})

export const MessageSchemaModel: Model<MessageModel> =
    model<MessageModel>('Message', MessageSchema)
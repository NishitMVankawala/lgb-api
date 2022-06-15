import { UserModel, UserRecord } from '../models/user'
import { ConversationModel } from '../models/conversation'
import { ConversationRecord } from './conversation'
export interface IFile {
    name: string
    type: string
    url: string
    previewUrl: string
}
export interface MessageReactionRecord {
    reaction: string
    user: string | UserRecord | UserModel
}
export interface MessageRecord {
    conversation: string | ConversationModel | ConversationRecord
    to: string | UserRecord | UserModel
    from: string | UserRecord | UserModel
    type: string
    metaType: string
    metaData: [{
        key: string
        value: string
    }]
    file: IFile[]
    body: string
    date: string
    reactions: MessageReactionRecord[]
}
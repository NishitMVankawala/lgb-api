import { ERR004_FAILED_TO_CREATE, ERR004_FAILED_TO_UPDATE, ERR007_NOT_FOUND } from '../errors/types'
import {
    ConversationModel,
    ConversationSchemaModel
} from '../models/conversation'
import {
    MessageModel,
    MessageSchemaModel
} from '../models/message'
/**
 * Create conversation between Asker & Expert
 * @param from
 * @param to
 * @returns {Promise<ConversationModel>}
 */
// export const createConversation = (from: string, to: string) => {
//     return new Promise<ConversationModel>((resolve, reject) => {
//         ConversationSchemaModel.create({
//             recipients: [from, to]
//         }).then(async conversation => {
//             if (!conversation) reject(ERR004_FAILED_TO_CREATE)
//             else {
//                 await MessageSchemaModel.create({
//                     conversation: conversation._id,
//                     to: to,
//                     from: from,
//                     type: 'activity',
//                     metaData: [{
//                         key: 'select',
//                         value: ''
//                     }]
//                 })
//                 resolve(conversation)
//             }
//         }).catch((error: any) => reject(error))
//     })
// }
/**
 * Fetch conversation 
 * @returns {Promise<ConversationModel>}
 */
export const fetchSingleConversation = (conversationId: string) => {
    return new Promise<ConversationModel>((resolve, reject) => {
        ConversationSchemaModel.findById(conversationId).then(conversation => {
            if (!conversation) reject(ERR004_FAILED_TO_CREATE)
            else resolve(conversation)
        }).catch((error: any) => reject(error))
    })
}

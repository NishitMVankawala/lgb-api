import { Types } from 'mongoose'
import { MessageRecord } from '../interfaces/message'
import { MessageModel, MessageSchema, MessageSchemaModel } from '../models/message'
import { ConversationModel, ConversationSchema, ConversationSchemaModel } from '../models/conversation'

import { generateToken } from '../utils/cryptoUtil'
import { BaseError } from '../errors'
import io from '../utils/socket'
import {
    ERR007_NOT_FOUND,
    ERR004_FAILED_TO_CREATE,
    ERR004_FAILED_TO_UPDATE,
    ERR003_FAILED_TO_FETCH, ERR004_FAILED_TO_DELETE
} from '../errors/types'
import { populateKeys as UserPopulateKeys, UserModel, UserSchemaModel } from '../models/user'
import { ConversationRecord } from '../interfaces/conversation'

/**
 * Function to search participants
 *
 * TODO: Filter users by known network
 */
export const searchConversationParticipants = (userId: string, q?: string) => {
    return new Promise<ReadonlyArray<UserModel>>((resolve, reject) => {
        UserSchemaModel.find({ _id: { $ne: userId }, name: { '$regex' : q, '$options' : 'i' } })
            .then((users: ReadonlyArray<UserModel>) => resolve(users))
            .catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
    })
}

/**
 * @returns {Promise<MessageModel>}
 * @param userId
 * @param conversationUserId
 */
export const createConversation = (userId: string, conversationUserId: string) => {
    return new Promise<ConversationModel>(async (resolve, reject) => {
        try {
            const conversation = ConversationSchemaModel.findOneAndUpdate(
                { recipients: { $all: [ { $elemMatch: { $eq: Types.ObjectId(userId) } }, { $elemMatch: { $eq: Types.ObjectId(conversationUserId) } } ] } },
                { recipients: [ userId, conversationUserId ] },
                { upsert: true, new: true })

            resolve(conversation)
        } catch (error) {
            reject(new BaseError(ERR004_FAILED_TO_CREATE))
        }
    })
}

/**
 * @param {from} string
 * @param {conversationId} string
 * @param {bodyData} MessageRecord
 * @returns {Promise<MessageModel>}
 */
 export const createMessage = (from: string, conversationId: string, bodyData: Partial<MessageRecord>) => {
    return new Promise<MessageModel>((resolve, reject) => {
        const messageData = {
            conversation: conversationId,
            to: bodyData.to,
            from: from,
            body: bodyData.body,
        } as MessageModel

        const newMessage = new MessageSchemaModel(messageData)
        newMessage.save()
            .then((message: MessageModel) => {
                // Trigger for new message
                io.getIO().sockets.emit('new:message', messageData.body);

                resolve(message)
            })
            .catch((error: any) => reject(ERR004_FAILED_TO_CREATE))
    })
}

/**
 *  Conversation Message
 *
 */
export const conversationMessage = (_user1: string, _user2: any) => {
	
	return new Promise<MessageModel>((resolve, reject) => {
        const user1 = Types.ObjectId(_user1)
        const user2 = Types.ObjectId(_user2)
    MessageSchemaModel.aggregate([{
                $lookup: {
                    from: 'users',
                    localField: 'to',
                    foreignField: '_id',
                    as: 'toObj',
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'from',
                    foreignField: '_id',
                    as: 'fromObj',
                },
            },
        ]).match({
                $or: [
                    { $and: [{ to: user1 }, { from: user2 }] },
                    { $and: [{ to: user2 }, { from: user1 }] },
                ],
            })
            .project({
                'toObj.password': 0,
                'toObj.__v': 0,
                'toObj.date': 0,
                'fromObj.password': 0,
                'fromObj.__v': 0,
                'fromObj.date': 0,
            }).then((message: any) => {
                if(!message){reject(new BaseError(ERR007_NOT_FOUND))}else {
                    resolve(message)
                }
			}).catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
	})
}

/**
 *  Conversations
 */
export const fetchConversations = (_from: string) => {
	return new Promise<ConversationRecord[]>((resolve, reject) => {
        const from = Types.ObjectId(_from)
        ConversationSchemaModel.find({ recipients: { $all: [{ $elemMatch: { $eq: from } }] } })
            .populate('recipients', UserPopulateKeys)
            .then((conversation: ConversationModel[]) => {
                resolve(conversation.map(c => {
                    const conversation = c.toObject()
                    conversation.recipient = c.recipients.find(r => r._id.toString() !== from.toString())
                    conversation.messages = []
                    return conversation
                }))
			}).catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
	})
}



/**
 * 
 * @param {messageId} string 
 * @param {userId} string
 * @param {conversationId} string 
 * @param {reaction} string 
 * @returns {Object}
 */
 export const conversationMessageReaction = (messageId: string, userId: string, conversationId: string, reaction: string) => {
    return new Promise<MessageModel>((resolve, reject) => {
        MessageSchemaModel.findOne({ _id: messageId,  'reactions.user': userId }).then(msgData => {
            const action = {} as any
            if (msgData) {
                action.$pull = { reactions: { user: userId } }
            } else { action.$push = { reactions: { user: userId, reaction: reaction } } }
           
            MessageSchemaModel.findOneAndUpdate({ _id: messageId }, action, { new: true })
                .populate({path:'reactions.user', select: 'name'}).then((message) => {

                    const reactionObj = {_id: message._id, date: message.date, reactions: message.reactions.map(reaction => {
                        return {
                            user: reaction.user,
                            reaction: reaction.reaction
                        }
                    })} as any
                    io.getIO().sockets.emit('message:reaction', reactionObj);

                    return message ? resolve(message) : reject(new BaseError(ERR004_FAILED_TO_UPDATE))
                }).catch((error: any) => reject(new BaseError(ERR007_NOT_FOUND)))
        }).catch((error: any) => reject(new BaseError(ERR007_NOT_FOUND)))

    })
}
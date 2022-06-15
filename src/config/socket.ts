import _io from '../utils/socket'
import { socketAuthenticator } from '../middlewares/socketAuthenticator'
import { ChatEventTypes } from '../constants/chatEvents'
import { removeOnlineSocketUser, setOnlineSocketUser, getSocketUser } from '../utils/redisManager'
import { createMessage, conversationMessageReaction } from '../controllers/message'
import { fetchSingleConversation } from '../controllers/conversation'

export const setUpIOConnection = httpServer => {
    const io = _io.init(httpServer)

    io.use(socketAuthenticator)
        .on('connection', async socket => {
            const currentUser = socket.user.user
           
            // Sender
            socket.on(ChatEventTypes.SEND_MESSAGE, async (data) => {
                // console.log(ChatEventTypes.SEND_MESSAGE, data)
                await fetchSingleConversation(data.conversationId).then(async (conversation: any) => {

                    const recipient = conversation.recipients.find(r => r.toString() != currentUser._id.toString())
                    
                    data.to = recipient
                    await createMessage(currentUser._id, conversation._id, data).then(msg => {
                        // console.log('msg', msg)

                    }).catch(err => console.log('err', err))
                }).catch(err => console.log('err', err))

                //socket.broadcast.emit('message:reaction', data);
            })
            // Message Reaction 
            socket.on(ChatEventTypes.SEND_MESSAGE_REACTION, async (data) => {
                // Broadcasting 
                await conversationMessageReaction(data.messageId, currentUser._id, null, data.reaction).then(async (reactionData: any) => {

                    
                }).catch(err => console.log('err', err))

                //socket.broadcast.emit('message:reaction', data);
            })

            // typing listen 
            socket.on(ChatEventTypes.SEND_TYPING, async (data) => {
                // Broadcasting 
                await fetchSingleConversation(data.conversationId).then(async (conversation: any) => {
                    const recipient = conversation.recipients.find(r => r.toString() != currentUser._id.toString())
                    
                    await getSocketUser(recipient).then(socketKey => {
                       
                        socket.to(socketKey).emit(ChatEventTypes.TYPING, {...data, user: currentUser})
    
                    }).catch(error => console.log(error))
                }).catch(error => console.log(error))
              

            })


            await setOnlineSocketUser(socket.id, socket.user.user._id)
        })
        .on('disconnect', async socket => {
            // TODO: Check removal of user
            console.log('user disconnecting ...', socket.user.user._id)
            await removeOnlineSocketUser(socket.id, socket.user.user._id)
        })
}
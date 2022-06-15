export enum ChatEventTypes {
    NEW_MESSAGE = 'chat:newMessage', // Server send new message notification to client
    TYPING = 'chat:typing', // Server send typing status to client
    SEND_MESSAGE = 'chat:sendMessage', // Client sends new message to server
    SEND_MESSAGE_REACTION = 'chat:sendMessageReaction', // Client sends message reaction to server
    SEND_TYPING = 'chat:sendTyping' // Client sends typing status to server
}
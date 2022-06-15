export interface Notification {
    user: string
    message: string
    type: string
    isSeen: boolean
    additionalData: {
       model: string
       _id: string
    }
 }
import { Schema } from 'mongoose'

/**
 * File Sub Model
 */
export const FileSchema: Schema = new Schema({
    name: {
        type: String
    },
    type: {
        type: String
    },
    url: {
        type: String
    },
    previewUrl: {
        type: String
    }
}, {
    timestamps: true
})
import { Document, model, Schema } from 'mongoose'
import { check } from 'express-validator'

import { TicketRecord } from '../interfaces/ticket'

/**
 * Validation Keys
 */
export const validationKeys = [
	check('name').exists(),
	check('name').not().isEmpty(),
	check('email').exists(),
	check('email').not().isEmpty(),
	check('message').exists(),
    check('message').not().isEmpty(),
    check('status').exists(),
	check('status').not().isEmpty(),
]

export const filterKeys = ['name', 'email','message','status']

/**
 * Ticket Model
 */
export interface TicketModel extends TicketRecord, Document {}

export const TicketSchema: Schema = new Schema({
    name: { 
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    status: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

export const TicketSchemaModel = model<TicketModel>('Ticket', TicketSchema)
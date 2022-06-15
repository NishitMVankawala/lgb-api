import {
    ERR003_FAILED_TO_FETCH,
    ERR004_FAILED_TO_UPDATE,
    ERR007_NOT_FOUND,
    ERR004_FAILED_TO_CREATE
} from '../errors/types'
import { BaseError } from '../errors'
import { TicketModel,TicketSchemaModel,TicketSchema } from '../models/ticket'
import { TicketRecord } from '../interfaces/ticket'


/**
 *  Create a ticket
 */
export const createTicket = (ticketData: Partial<TicketRecord>) => {
	return new Promise<TicketModel>((resolve, reject) => {
        const Ticket = new TicketSchemaModel(ticketData)
        
		Ticket.save().then((savedTicket: TicketModel) =>
			savedTicket ? resolve(savedTicket) : reject(new BaseError(ERR007_NOT_FOUND)))
			.catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
	})
}

/**
 * Fetch ticket
 */
export const fetchTicket = (email: string) => {
	return new Promise<[TicketModel]>((resolve, reject) => {
        TicketSchemaModel.find({email})
        .then((ticket:[TicketModel]) => {
            if (ticket.length) {
                resolve(ticket)
            } else {
                reject(new BaseError(ERR007_NOT_FOUND))
            }
        }).catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
	})
}


/**
 * Fetch single ticket
 */
export const fetchSingleTicket = (ticketId: string, email: string) => {
	return new Promise<TicketModel>((resolve, reject) => {
		TicketSchemaModel.findOne({ _id: ticketId, email })
			.then((ticket:TicketModel) => {
				if (ticket) {
					resolve({ ...ticket.toObject() })
				} else {
					reject(new BaseError(ERR007_NOT_FOUND))
				}
			}).catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
	})
}

/**
 * Admin update ticket
 */
export const adminUpdateTicket = (ticketId: string, updateData: Partial<TicketRecord>) => {
	return new Promise<TicketModel>((resolve, reject) => {
		TicketSchemaModel.findOneAndUpdate({ 
            _id: ticketId 
        },{
            $set:updateData
        },{ new: true })
			.then((ticket:TicketModel) => {
				if (ticket) {
					resolve({ ...ticket.toObject() })
				} else {
					reject(new BaseError(ERR007_NOT_FOUND))
				}
			}).catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
	})
}

/**
 * Admin remove ticket
 */
export const adminRemoveTicket = (ticketId: string) => {
	return new Promise<TicketModel>((resolve, reject) => {
		TicketSchemaModel.findOneAndRemove({ _id: ticketId })
			.then((ticket:TicketModel) => {
				if (ticket) {
					resolve(ticket)
				} else {
					reject(new BaseError(ERR007_NOT_FOUND))
				}
			}).catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
	})
}

/**
 * Admin Fetch ticket
 */
export const adminFetchTicket = () => {
	return new Promise<[TicketModel]>((resolve, reject) => {
        TicketSchemaModel.find({})
        .then((ticket:[TicketModel]) => {
            if (ticket.length) {
                resolve(ticket)
            } else {
                reject(new BaseError(ERR007_NOT_FOUND))
            }
        }).catch((error: any) => reject(new BaseError(ERR003_FAILED_TO_FETCH, error)))
	})
}

import * as moment from 'moment'

export const dateFormatGeneric = (date: string) => {
	return date ? moment(date).utcOffset('+0800').format('YYYY-MM-DD') : 'N/A'
}

export const dateFormatJackyun = (date: string) => {
	return date ? moment(date).utcOffset('+0800').format('YYYY-MM-DD HH:mm:ss') : 'N/A'
}

export const dateFormatJackyunReverse = (date: string) => {
	return date ? moment(date).utcOffset('-0800').format('YYYY-MM-DD HH:mm:ss') : date
}
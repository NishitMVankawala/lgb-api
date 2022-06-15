import { ErrorType } from './types'

export enum BaseErrorType {
	BASE = 'BASE'
}

export class BaseError extends Error {
	private source = BaseErrorType.BASE
	private errorType: ErrorType
	private readonly originalError: Error
	
	constructor(errorType: ErrorType, originalError?: Error, source?: BaseErrorType) {
		super(errorType.message)
		
		this.errorType = errorType
		this.source = source
		this.name = errorType.name
		this.originalError = originalError
	}
	
	public getStatusCode(): number {
		return this.errorType.status || 500
	}
	
	public getCode(): string {
		return this.errorType.code
	}
	
	public getName(): string {
		return this.errorType.name
	}
	
	public getMessage(): string {
		return this.originalError ? this.originalError.message : this.errorType.message
	}
	
	public getOriginalError() {
		return this.originalError ? this.originalError : undefined
	}
	
	public getSource(): BaseErrorType {
		return this.source
	}
	
	public getAdditionalData() {
		return this.errorType.additionalData
	}
	
	public getStackTrace(): string {
		return this.originalError ? this.originalError.stack : ''
	}
}
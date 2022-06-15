export interface JobQuoteRecord {
	uniqueId: string
    ref: string
    date: string
    message: string
    materials: string[]
    labourHours: string
    labourCost: string
    user: any
}

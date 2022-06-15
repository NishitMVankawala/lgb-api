export interface JobMilestoneRecord {
    breakdown: [BreakdownRecord]
    grandTotal: number
    message?: string
    user: any
}

export interface BreakdownRecord {
    milestone: string
    price: number
}
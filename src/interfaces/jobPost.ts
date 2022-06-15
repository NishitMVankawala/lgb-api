import { UserModel, UserRecord } from '../models/user'
import { JobPostRecord } from '../models/jobPost'

export interface JobPostSaveData extends Partial<JobPostRecord> {
    shouldUpdateSocialFeed: boolean
}

export interface JobRating {
    personality: number
    readability: number
    comments: string
    user: string | UserRecord | UserModel
}
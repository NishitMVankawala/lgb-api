export interface JWTToken {
	token: string
}

export interface PasswordResetToken {
	token: string
}

export interface GenericResetToken {
	token: string
}
//
// export interface UserRecord {
// 	thumbnailImageUrl: string
// 	coverImageUrl: string
// 	name: string
// 	lastName: string
// 	email: string
// 	password?: string
// 	fullName?: string
// 	role: string
// 	bio: string
// 	phoneNumber: string
// 	phoneNumberCountryCode: string
// 	resetPasswordToken: string
// 	tradeLevel?: string
// 	pastWorks: [PastWorks]
// 	qualifications: [Qualifications]
// 	socialFeed: string
// 	interests: string[]
// 	following: any[]
// }
// export interface PastWorks {
// 	type: string
// 	url: string
// 	caption: string
// }
//
// export interface Qualifications {
// 	type: string
// 	attachmentUrls: string[]
// }
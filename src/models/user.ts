import * as bcrypt from 'bcryptjs'
import { Document, Model, model, Schema } from 'mongoose'
import { check } from 'express-validator'

/**
 * Validation Keys
 */
export const validationKeys = [
    check('email').not().isEmpty(),
    check('role').not().isEmpty()
]

export const filterKeys = [
	'name', 'lastName', 'email', 'role', 'phoneNumberCountryCode', 'phoneNumber', 'contactDescription',
	'thumbnailImageUrl', 'coverImageUrl', 'bio', 'tradeLevel', 'tradePastWorks', 'tradeQualifications',
    'locationDescription', 'locationCoordsLat', 'locationCoordsLng', 'country', 'region', 'city', 'zip',
    'timeZone', 'isProfileSetup'
]

export const updatedFilterKeys = [
    'name', 'lastName', 'email', 'role', 'thumbnailImageUrl', 'coverImageUrl', 'contactDescription',
    'locationDescription', 'locationCoordsLat', 'locationCoordsLng', 'bio', 'tradeLevel', 'tradePastWorks',
    'tradeQualifications', 'country', 'region', 'city', 'zip', 'timeZone', 'isProfileSetup'
]

export const populateKeys = { name: 1, lastName: 1, role: 1, thumbnailImageUrl: 1, coverImageUrl: 1, bio: 1,
    city: 1, region: 1, country: 1, zip: 1, timeZone: 1, followers: 1, isProfileSetup: 1 }

/**
 * User Record
 */
export interface UserRecord {
    name: string
    lastName?: string
    fullName?: string

    role: string
    email: string
    password?: string

    phoneNumberCountryCode: string
    phoneNumber: string

    thumbnailImageUrl: string
    coverImageUrl: string
    bio: string

    tradeLevel?: string
    tradePastWorks: any[]
    tradeQualifications: any[]

    businessType: string
    contactDescription: string

    country?: string
    region?: string
    city?: string
    zip?: string
    timeZone?: string

    interests: string[]
    following: string[] | UserRecord[] | UserModel[]
    followers: string[] | UserRecord[] | UserModel[]

    resetPasswordToken?: string
}

const Qualifications: Schema = new Schema({
    type: String,
    attachmentUrls: [ String ]
})

const PastWorks: Schema = new Schema({
    type: String,
    url: String,
    caption: String
})

/**
 * User Model
 */
export interface UserModel extends UserRecord, Document {}
export const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        default: ''
    },
    role: String,
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumberCountryCode: String,
    phoneNumber: String,

    thumbnailImageUrl: String,
    coverImageUrl: String,
    bio: String,

    tradeLevel: String,
    tradePastWorks: [ String ], // TBD Replace it with a collection of past works
    tradeQualifications: [ Qualifications ],

    locationDescription: String,
    locationCoordsLat: String,
    locationCoordsLng: String,

    businessType: String,
    contactDescription: String,

    country: String,
    region: String,
    city: String,
    zip: String,
    timeZone: String,

    interests: [ String ],
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        populate: { select: populateKeys }
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        populate: { select: populateKeys }
    }],

    resetPasswordToken: {
        type: String,
        default: null
    },
    isProfileSetup: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

UserSchema.pre('init', (doc: any) => {
    if (!doc.thumbnailImageUrl) {
        const fullName = doc.lastName ? doc.name + '+' + doc.lastName : doc.name
        doc.thumbnailImageUrl = 'https://ui-avatars.com/api/?background=444444&size=200&font-size=0.4&color=fff&name=' +
            fullName.replace(/ /g, '+')
    }

    doc.fullName = doc.lastName ? doc.name + ' ' + doc.lastName : doc.name
})

// Compare password when user login
UserSchema.methods.comparePassword = (password: string, comparePassword: string, next: any) => {
    bcrypt.compare(password, comparePassword, (err, isMatch) => {
        if (err) {
            return next(err)
        }
        next(null, isMatch)
    })
}

UserSchema.methods.toJSON = function () {
    const obj = this.toObject()
    delete obj.password
    delete obj.__v
    return obj
}

export const UserSchemaModel: Model<UserModel> = model<UserModel>('User', UserSchema)
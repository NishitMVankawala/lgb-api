import * as ShortID from 'shortid'
import * as aws from 'aws-sdk'
import * as multer from 'multer'
import * as multerS3 from 'multer-s3'
import * as path from 'path'

import {requestValidator} from '../middlewares/errorHandler'
import {BaseError} from '../errors'
import {ERR004_FAILED_TO_CREATE} from '../errors/types'
import { MediaMetadata, parseImage } from '../controllers/media'
const mime = require('mime-types')

export interface AssetFile extends File {
    extension: string
    path?: string
}

export interface FileUploadResponse {
    url: string
}

export interface AssetMetadata {}


// Set S3 endpoint to DigitalOcean Spaces
const spacesEndpoint = new aws.Endpoint(process.env.ENDPOINT_DIGITALOCEAN_SPACES);
const s3 = new aws.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET
})

// Change bucket property to your Space name
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.SPACES_STORAGE_BUCKET,
        acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, Object.assign({}, req.body));
        },
        key: function (request, file, cb) {
            let targetName
            targetName = ShortID.generate()
            let originalName = file.originalname ? file.originalname : file
            originalName = originalName.replace(/ /g, "_")

            const filenameSplit = originalName.split('.')
            if (filenameSplit.length > 0) {
                targetName += '.' + filenameSplit[filenameSplit.length - 1]
            }

            cb(null, `${targetName}`);
        }
    })
})

/**
 * API to upload assets provided to google cloud
 *
 * @param req Request from Express
 * @param res Response from Express
 */
export const store = async (req, res) => {
    try {
        res.json(req.files.map(f => ({ name: f.metadata.name, type: f.metadata.type, url: f.location, etag: f.etag })))
    } catch (e) {
        res.status(400).json(new BaseError(ERR004_FAILED_TO_CREATE, e))
    }
}

export const storeMiddleware = [
    upload.array('files', 10)
]

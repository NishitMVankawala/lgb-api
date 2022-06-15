import 'dotenv/config'
import * as bodyParser from 'body-parser'
import * as methodOverride from 'method-override'
import * as viewEngines from 'consolidate'
import * as express from 'express'
import * as passport from 'passport'
import * as compression from 'compression'
import * as path from 'path'
import * as http from 'http'
import * as log4js from 'log4js'
import { passportJWTAuthentication, PassportJWTAuthenticationResponse } from './config/passport'
import registerEvents from './events/index'
import { BaseError } from './errors'
import apiRoutes from './routes'
import { setUpIOConnection } from './config/socket'
import { setupDBClient } from './utils/mongoClient'
import {AdminUserModel} from './models/adminUser'
declare global {
    namespace Express {
        interface Request {
            adminUser: AdminUserModel
        }
    }
}
// Initialize Logger
if (process.env.NODE_ENV !== 'test') {
	log4js.configure({
		appenders: {
			console: { type: 'console' },
			file: { type: 'file', filename: 'log/api.log', maxLogSize: 512000, backups: 10 }
		},
		categories: { default: { appenders: ['console', 'file'], level: 'info'} }
	})
}
export const logger = log4js.getLogger()

// Initialize the express APP
const app = express()
const server = http.createServer(app);



app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({limit: '50mb'}))
app.use(methodOverride())
app.use(compression())
app.use('/assets', express.static('assets'))
app.use('/files', express.static(path.join(__dirname, 'files')))
app.engine('html', viewEngines.swig)
app.set('views', __dirname + '/views')

// Initialize Passport.js
app.use(passport.initialize())
passportJWTAuthentication(passport)

// Get the Access Token
app.use((req, res, next) => {
	passport.authenticate('jwt', { session: false },
		(err, authenticateResponse: PassportJWTAuthenticationResponse) => {
			if (err) { return next(err) }
			
			if (authenticateResponse.type === 'user') {
				req.user = authenticateResponse.model
			}
			if (authenticateResponse.type === 'adminUser') {
				console.log(authenticateResponse.model)
                req.adminUser = authenticateResponse.model
            }

			next()
		})(req, res, next)
})

// Enable CORS
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE')
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
	
	// intercept OPTIONS method
	if ('OPTIONS' === req.method) {
		res.send(200)
	} else {
		next()
	}
})

// Import routes
app.use('/', apiRoutes)

// Import Events & Notifications
registerEvents(app)

/**
 * Handle all errors
 * 1. Log Errors
 * 2. API Error Log
 * 3. Default Error Log
 */
app.use((error: Error, req, res, next) => {
	logger.error(error.stack)
	next(error)
})

app.use((error: BaseError, req, res, next) => {
	res.status(error.getStatusCode()).send({
		error: {
			code: error.getCode(),
			name: error.getName(),
			message: error.getMessage(),
			validationErrors: error.getCode() === '002' ? error.getOriginalError() : undefined
		}
	})
})

app.use((error: Error, req, res, next) => {
	res.status(500)
	res.send(error)
})

// Set up default mongoose connection
if (process.env.MONGO_URI && process.env.NODE_ENV !== 'test') {
	setupDBClient().then(() => logger.log('Mongo Connected!'))

	// const authOptions = {} as any

	// if (process.env.MONGO_DB_USERNAME && process.env.MONGO_DB_PASSWORD) {
	// 	authOptions.user = process.env.MONGO_DB_USERNAME
	// 	authOptions.pass = process.env.MONGO_DB_PASSWORD
	// }

	// mongoose.connect(process.env.MONGO_URI, {
	// 	...authOptions,
	// 	useFindAndModify: false,
	// 	useNewUrlParser: true,
	// 	useUnifiedTopology: true
	// }).then(() => logger.log('Mongo Connected!'))
} else if (process.env.NODE_ENV !== 'test') {
	logger.error('Error: Failed to start MongoDB', process.env.MONGO_URI)
}

// Start the APP
if (process.env.NODE_ENV !== 'test') {
	// socket config
	setUpIOConnection(server)
	
	// Start the APP
	server.listen(process.env.API_PORT, () =>
		logger.log('Server started on : ' + process.env.WEB_PORT))
}

module.exports = app
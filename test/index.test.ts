import 'dotenv/config'
import * as mongoose from 'mongoose'
import { createUser } from '../src/controllers/users'
import { UserSchemaModel } from '../src/models/user'

export const TEST_ADMIN_USER_EMAIL = 'test@admin.com'
export const TEST_ADMIN_USER_PASSWORD = 'test@admin.com'

const initializeMongo = async () => {
	// Initialize Mongo
	mongoose.set('useNewUrlParser', true)
	mongoose.set('useFindAndModify', false)
	mongoose.set('useCreateIndex', true)
	mongoose.set('useUnifiedTopology', true)

	const mongoDB = process.env.MONGO_URI_TEST
	await mongoose.connect(mongoDB)
		.then(() => console.log(`Test database connected. ${mongoDB}\n`))
		.catch(err => console.error(`Failed to connect to ${mongoDB} ${err}\n`))
}

/**
 * Dummy data
 */

export const createAdminUser = async () => {
	await UserSchemaModel.deleteMany({})
	return createUser({ name: 'Admin', email: TEST_ADMIN_USER_EMAIL, password: TEST_ADMIN_USER_PASSWORD, role: 'super-admin' })
}

before(async () => {
	await initializeMongo()
})

after(async () => {
	await mongoose.disconnect()
		.then(() => console.log(`Mongo disconnected`))
		.catch(err => console.log(`Mongo disconnected with error ${err}`))
})

// Add other tests here
// require('./users.test')
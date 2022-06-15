import * as chai from 'chai'
import * as supertest from 'supertest'

import { createAdminUser, TEST_ADMIN_USER_EMAIL, TEST_ADMIN_USER_PASSWORD } from './index.test'

import { loginUser, signJWTToken } from '../src/controllers/auth'
import { JWTToken } from '../src/interfaces/auth'

process.env.NODE_ENV = 'test'
const app = require('../src/index')
const expect = chai.expect

chai.use(require('chai-like'))
chai.use(require('chai-things'))

// Variables to use throughout the chain
let adminJWTToken = null

/**
 * Utility functions
 */
const clearTables = async () => {}

const shouldRequireAuthentication = (route: string): Promise<JWTToken> => {
	it('should require authentication', (done: any) => {
		supertest(app).get(route).expect(401, done)
	})
	
	return loginUser(TEST_ADMIN_USER_EMAIL, TEST_ADMIN_USER_PASSWORD)
}

/**
 * Tests
 * -----
 * 1. CRUD Operations
 */
describe('Users', () => {
	before(clearTables)
	before(async () => 	{
		const admin = await createAdminUser()
		adminJWTToken = signJWTToken(admin).token
	})
	
	shouldRequireAuthentication('/admin/users')

	describe('GET /admin/users', () => {
		it('should list all users for an admin', (done: any) => {
			supertest(app)
				.get(`/admin/users`)
				.set('Authorization', `Bearer ${adminJWTToken}`)
				.expect(200)
				.end((err, res) => {
					expect(res.body).to.be.an('array')
					expect(res.body).to.have.lengthOf(1)
					done()
				})
		})
	})



})
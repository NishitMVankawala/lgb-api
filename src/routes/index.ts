import * as express from 'express'
import { adminAuthenticator, userAuthenticator,
	selfJobPostAuthenticator, selfQuoteAuthenticator,
	isUserInvolvedAuthenticator, tradepersonUserAuthenticator,
	isUserMilestoneAuthenticator, selfTicketAuthenticator
 } from '../middlewares/authenticator'

import * as authAPI from './auth'
import * as adminAuthAPI from './adminAuth'
import * as adminUsersAPI from './adminUsers'
import * as usersAPI from './users'
import * as profileAPI from './profile'
import * as postsAPI from './posts'
import * as feedAPI from './feed'
import * as notificationsAPI from './notifications'
import * as jobPostAPI from './jobPost'
import * as quotesAPI from './quote'
import * as faqAPI from './faqs'
import * as faqCategoriesAPI from './faqCategories'
import * as pagesAPI from './page'
import * as pageCategoriesAPI from './pageCategory'
import * as assetsAPI from './assets'
import * as conversationsAPI from './message'
import * as ticketsAPI from './ticket'

// Setup Router
const router = express.Router()

router.get('/', (req, res, next) => {
	res.end('LGB Portal APIs')
})

/**
 * User Authentication Routes
 *
 * 1. Authentication
 * 2. Login
 * 3. Recover Password
 */
router.get('/auth', userAuthenticator, authAPI.authenticate)
router.post('/auth/login', authAPI.loginMiddleware, authAPI.login)
router.post('/auth/login-phone', authAPI.loginPhoneMiddleware, authAPI.loginPhone)
router.post('/auth/register', authAPI.registerMiddleware, authAPI.register)
router.post('/auth/forgot', authAPI.forgotMiddleware, authAPI.forgot)
router.post('/auth/recover', authAPI.recoverMiddleware, authAPI.recover)

/**
 * Admin User Authentication Routes
 *
 * 1. Authentication
 * 2. Login
 */
 router.get('/admin/auth', adminAuthenticator, adminAuthAPI.authenticate)
 router.post('/admin/auth/login', adminAuthAPI.loginAdminMiddleware, adminAuthAPI.adminLogin)

/**
 * Admin | Admin User Routes
 */
router.get('/admin/admin-users', adminAuthenticator, adminUsersAPI.adminIndex)
router.post('/admin/admin-users', adminAuthenticator, adminUsersAPI.createMiddleware, adminUsersAPI.adminCreate)
router.get('/admin/admin-users/:userId', adminAuthenticator, adminUsersAPI.adminFetch)
router.patch('/admin/admin-users/:userId', adminAuthenticator, adminUsersAPI.updateMiddleware, adminUsersAPI.adminUpdate)
router.delete('/admin/admin-users/:userId', adminAuthenticator, adminUsersAPI.adminRemove)

/**
 * 	User Profile Routes
 *
 */
router.get('/my-profile', userAuthenticator, profileAPI.fetch)
router.patch('/my-profile', userAuthenticator, profileAPI.updateSelf)
router.get('/my-profile/followable/interests', userAuthenticator, profileAPI.fetchInterests)
router.get('/my-profile/followable/people/:s?', profileAPI.fetchFollowablePeople)
router.get('/my-profile/followable/companies/:s?', profileAPI.fetchFollowableCompanies)

/**
 * Public profile
 *
 * 1. Fetch
 * 2. Follow & UnFollow Users
 */
router.get('/profile/:userId', userAuthenticator, profileAPI.fetchPublic)
router.put('/profile/:userId/follow', userAuthenticator, profileAPI.follow)
router.put('/profile/:userId/un-follow', userAuthenticator, profileAPI.unfollow)

/**
 * Admin | User Routes
 */
router.get('/admin/users', adminAuthenticator, usersAPI.adminIndex)
router.post('/admin/users', adminAuthenticator, usersAPI.createMiddleware, usersAPI.adminCreate)
router.get('/admin/users/:userId', adminAuthenticator, usersAPI.adminFetch)
router.patch('/admin/users/:userId', adminAuthenticator, usersAPI.updateMiddleware, usersAPI.adminUpdate)
router.delete('/admin/users/:userId', adminAuthenticator, usersAPI.adminRemove)

/**
 *  Job Search
 */
router.get('/jobs/search/map', jobPostAPI.searchAllJobPostByMap)
router.get('/jobs/search/:q/:categoryId?', userAuthenticator, jobPostAPI.searchAllJobPost)

/**
 *  Job Post
 */
router.get('/my-jobs/:jobId', userAuthenticator, jobPostAPI.fetch)
router.get('/my-jobs/by-status/:status', userAuthenticator, jobPostAPI.status)
router.post('/my-jobs', userAuthenticator, jobPostAPI.createMiddleware, jobPostAPI.create)
router.patch('/my-jobs/:jobId', userAuthenticator, selfJobPostAuthenticator, jobPostAPI.updateMiddleware, jobPostAPI.update)
router.put('/my-jobs/:jobId/publish', userAuthenticator, selfJobPostAuthenticator, jobPostAPI.publish)
router.delete('/my-jobs/:jobId', userAuthenticator, selfJobPostAuthenticator, jobPostAPI.remove)
router.get('/my-jobs/:jobId/quote', userAuthenticator, jobPostAPI.fetchQuote)

router.put('/jobs/:jobId/request-meeting', userAuthenticator, jobPostAPI.meeting)

/**
 * Job Post - Quotes Specific
 */
router.post('/jobs/:jobId/quote', userAuthenticator, quotesAPI.apply)
router.get('/jobs/:jobId/quote/:quoteId', userAuthenticator, quotesAPI.fetch)
router.patch('/jobs/:jobId/quote/:quoteId', userAuthenticator, quotesAPI.update)
router.put('/jobs/:jobId/quote/:quoteId/publish', userAuthenticator, quotesAPI.publish)
router.put('/jobs/:jobId/quote/:quoteId/accept', userAuthenticator, quotesAPI.accept)

/**
 * Job Post - Milestones
 */
router.post('/jobs/:jobId/milestones', userAuthenticator, jobPostAPI.milestoneIndex)
router.get('/jobs/:jobId/milestones', userAuthenticator, isUserMilestoneAuthenticator, jobPostAPI.milestoneFetch)
router.patch('/jobs/:jobId/milestones/:milestoneId', userAuthenticator, isUserMilestoneAuthenticator, jobPostAPI.updateJobMilestone)

// router.get('/my-quotes', userAuthenticator, selfQuoteAuthenticator, quotesAPI.fetch)
// router.get('/my-quotes/:quoteId/preview', userAuthenticator, selfQuoteAuthenticator, quotesAPI.preview)
// router.patch('/my-quotes/:quoteId', userAuthenticator, selfQuoteAuthenticator, quotesAPI.update)

/**
 * Users Rating
 */
router.post('/jobs/:jobId/rating', userAuthenticator, isUserInvolvedAuthenticator, jobPostAPI.rating)
router.get('/my-ratings', userAuthenticator,tradepersonUserAuthenticator,jobPostAPI.fetchRating)

/**
 *  Self Ticket
 */
router.post('/my-tickets', userAuthenticator, ticketsAPI.create)
router.get('/my-tickets/:ticketId', userAuthenticator,selfTicketAuthenticator, ticketsAPI.fetch)
router.get('/my-tickets', userAuthenticator, selfTicketAuthenticator, ticketsAPI.index)

/**
 *  Admin | Job Post
 */
router.patch('/admin/job-posts/:jobPostId', adminAuthenticator, jobPostAPI.updateMiddleware, jobPostAPI.adminUpdate)
router.get('/admin/job-posts/:jobPostId', adminAuthenticator, jobPostAPI.adminFetch)
router.get('/admin/job-posts', adminAuthenticator, jobPostAPI.adminIndex)


/**
 *  Admin Ticket
 */
router.patch('/admin/tickets/:ticketId', userAuthenticator,adminAuthenticator, ticketsAPI.updateTicketMiddleware, ticketsAPI.adminUpdate)
router.delete('/admin/tickets/:ticketId', userAuthenticator,adminAuthenticator, ticketsAPI.adminRemove)
router.get('/admin/tickets', userAuthenticator,adminAuthenticator, ticketsAPI.adminIndex)


/**
 * Admin | FAQ
 */
router.get('/admin/faq', adminAuthenticator, faqAPI.adminIndex)
router.get('/admin/faq/by-category/:faqCategoryId', adminAuthenticator, faqAPI.adminIndex)
router.post('/admin/faq', adminAuthenticator, faqAPI.createMiddleware, faqAPI.adminCreate)
router.put('/admin/faq/order', adminAuthenticator, faqAPI.adminOrder)
router.get('/admin/faq/:faqId', adminAuthenticator, faqAPI.adminFetch)
router.patch('/admin/faq/:faqId', adminAuthenticator, faqAPI.updateMiddleware, faqAPI.adminUpdate)
router.delete('/admin/faq/:faqId', adminAuthenticator, faqAPI.adminRemove)

router.get('/admin/faq-categories', adminAuthenticator, faqCategoriesAPI.adminIndex)
router.post('/admin/faq-categories', adminAuthenticator, faqCategoriesAPI.createMiddleware, faqCategoriesAPI.adminCreate)
router.put('/admin/faq-categories/order', adminAuthenticator, faqCategoriesAPI.adminOrder)
router.get('/admin/faq-categories/:faqCategoryId', adminAuthenticator, faqCategoriesAPI.adminFetch)
router.patch('/admin/faq-categories/:faqCategoryId', adminAuthenticator, faqCategoriesAPI.updateMiddleware, faqCategoriesAPI.adminUpdate)
router.delete('/admin/faq-categories/:faqCategoryId', adminAuthenticator, faqCategoriesAPI.adminRemove)

/**
 * Admin | Page
 */
router.post('/admin/pages', adminAuthenticator, pagesAPI.createMiddleware, pagesAPI.adminCreate)
router.patch('/admin/pages/:pageId', adminAuthenticator, pagesAPI.createMiddleware, pagesAPI.adminUpdate)
router.get('/admin/pages/:pageId', adminAuthenticator, pagesAPI.adminSingleFetch)
router.get('/admin/pages', adminAuthenticator, pagesAPI.adminFetch)
router.put('/admin/pages/order', adminAuthenticator, pagesAPI.adminOrder)
router.delete('/admin/pages/:pageId', adminAuthenticator, pagesAPI.adminRemove)

/**
 * Public | Pages
 */
router.get('/pages/:pageSlug', pagesAPI.fetchBySlugs)
router.get('/pages/:pageId', pagesAPI.publicSingleFetch)

/**
 * Message | Chat
 */
// router.post('/message', conversationsAPI.createMiddleware, conversationsAPI.create)

/**
 * Conversations API
 */
router.get('/conversations', userAuthenticator, conversationsAPI.index)
router.post('/conversations', userAuthenticator, conversationsAPI.create)
router.get('/conversations/:id', userAuthenticator, conversationsAPI.fetch)
router.get('/conversations-participants/:q', userAuthenticator, conversationsAPI.searchParticipants)


/**
 * Admin | Page-Category
 */
router.post('/admin/page-categories', adminAuthenticator, pageCategoriesAPI.createMiddleware, pageCategoriesAPI.adminCreate)
router.patch('/admin/page-categories/:pageCategoryId', adminAuthenticator, pageCategoriesAPI.createMiddleware, pageCategoriesAPI.adminUpdate)
router.get('/admin/page-categories/:pageCategoryId', adminAuthenticator, pageCategoriesAPI.adminSingleFetch)
router.get('/admin/page-categories', adminAuthenticator, pageCategoriesAPI.adminFetch)
router.put('/admin/page-categories/order', adminAuthenticator, pageCategoriesAPI.adminOrder)
router.delete('/admin/page-categories/:pageCategoryId', adminAuthenticator, pageCategoriesAPI.adminRemove)

/**
 * User Feed & Posts
 */
router.get('/feed', userAuthenticator, feedAPI.fetch)
router.get('/posts/:tags', userAuthenticator, postsAPI.fetchByTags)
router.post('/posts', userAuthenticator, postsAPI.createMiddleware, postsAPI.create)
router.get('/posts/:postId', userAuthenticator, postsAPI.fetch)
router.put('/posts/:postId/like', userAuthenticator, postsAPI.updatePostLikeMiddleware, postsAPI.like)

router.post('/posts/:postId/comments', userAuthenticator, postsAPI.createComment)
router.get('/posts/:postId/comments', [ userAuthenticator ], postsAPI.indexComment)

/**
 * Notifications
 */
router.get('/notifications', userAuthenticator, notificationsAPI.index)
router.put('/notifications/seen', userAuthenticator, notificationsAPI.seenMiddleware, notificationsAPI.seen)


/**
 * Media and Assets
 *
 * 1. Create an assets API to upload images and other media assets
 */
router.post('/assets', assetsAPI.storeMiddleware, assetsAPI.store)

export default router
import * as mongoose from 'mongoose'

export const mongooseHistoryOptions = {
	mongoose: mongoose, // A mongoose instance
	userCollection: 'users',
	userFieldName: 'user', // Name of the property for the user
	timestampFieldName: 'timestamp', // Name of the property of the timestamp
	methodFieldName: 'method', // Name of the property of the method
	collectionIdType: false, // Cast type for _id (support for other binary types like uuid) defaults to ObjectId
	ignore: ['createdAt', 'updatedAt'], // List of fields to ignore when compare changes
	noDiffSave: true, // If true save event even if there are no changes
	noDiffSaveOnMethods: [], // If a method is in this list, it saves history even if there is no diff.
	noEventSave: false, // If false save only when __history property is passed
	modelName: '__histories', // Name of the collection for the histories
	embeddedDocument: false, // Is this a sub document
	embeddedModelName: '', // Name of model if used with embedded document
	
	// If true save only the _id of the populated fields
	// If false save the whole object of the populated fields
	// If false and a populated field property changes it triggers a new history
	// You need to populate the field after a change is made on the original document or it will not catch the differences
	ignorePopulatedFields: true
}

export const mongooseMPUserHistoryOptions = {
	...mongooseHistoryOptions,
	modelName: '__mpuser_histories',
	ignore: ['createdAt', 'updatedAt']
}
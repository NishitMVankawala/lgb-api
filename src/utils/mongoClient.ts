import * as mongoose from 'mongoose'

// Connect to DB
export const setupDBClient = async () => {
    const authOptions = {} as any

    if (process.env.MONGO_DB_USERNAME && process.env.MONGO_DB_PASSWORD) {
        authOptions.user = process.env.MONGO_DB_USERNAME
        authOptions.pass = process.env.MONGO_DB_PASSWORD
    }

    return await mongoose.connect(process.env.MONGO_URI,
        {...authOptions, useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true})
}
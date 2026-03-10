import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI



declare global {
    var mongooseCache: {
        conn: typeof mongoose | null
        promise: Promise<typeof mongoose> | null
    }
}

let cached = global.mongooseCache || (global.mongooseCache = {
    conn: null,
    promise: null
})

export const connectToDatabase = async () => {
    if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined")

    if (cached.conn) return cached.conn

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false
        }).then((mongoose) => {
            return mongoose
        })
    }

    try {
        cached.conn = await cached.promise
        console.info("Connected to MongoDB")
    } catch (error) {
        cached.promise = null
        console.error("MongoDB connection error", error)
        throw error
    }
    return cached.conn
}

import { MongoClient } from "mongodb";

const mongoClient = new MongoClient(
    `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`,
    {
        auth: {
            username: process.env.MONGODB_USER,
            password: process.env.MONGODB_PASSWORD,
        }
    }
);

export const db = mongoClient.db(process.env.MONGODB_DATABASE);
export default db;

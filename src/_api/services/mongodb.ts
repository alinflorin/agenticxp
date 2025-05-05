import { MongoClient } from "mongodb";
import { ConnectionEntity } from "../models/connection-entity";

const mongoClient = new MongoClient(
    `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`,
    {
        auth: {
            username: process.env.MONGODB_USER,
            password: process.env.MONGODB_PASSWORD,
        },
        authSource: process.env.MONGODB_DATABASE,
        ignoreUndefined: true
    }
);

export const db = mongoClient.db(process.env.MONGODB_DATABASE);

export const connectionsCollection = db.collection<ConnectionEntity>("connections");

export default db;

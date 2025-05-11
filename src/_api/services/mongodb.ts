import { MongoClient } from "mongodb";
import { ConnectionEntity } from "../models/entities/connection-entity";
import { McpServerEntity } from "../models/entities/mcp-server-entity";
import { AgentEntity } from "../models/entities/agent-entity";
import { ChatEntity } from "../models/entities/chat-entity";

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
export const mcpServersCollection = db.collection<McpServerEntity>("mcpServers");
export const agentsCollection = db.collection<AgentEntity>("agents");
export const chatsCollection = db.collection<ChatEntity>("chats");

export default db;

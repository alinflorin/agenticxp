import { FastifyInstance, FastifyPluginAsync } from "fastify";
import db from "../services/mongodb";

export const healthRoute: FastifyPluginAsync = (
    fastify: FastifyInstance
): Promise<void> => {
    fastify.get("/health", async (_, res) => {
        const x = await db.stats();
        console.log(x);
        res.send({ healthy: true });
    });

    return Promise.resolve();
};

export default healthRoute;

import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { UserProfile } from "@/shared-models/user-profile";

export const userProfileRoute: FastifyPluginAsync = (
    fastify: FastifyInstance
): Promise<void> => {
    fastify.get("/api/user-profile", async (req) => {
        return { is_admin: req.user?.is_admin || false } as UserProfile;
    });

    return Promise.resolve();
};

export default userProfileRoute;

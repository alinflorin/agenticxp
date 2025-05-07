import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { UserProfile } from "@/shared-schemas/user-profile";
import userProfileSchema from "@/shared-schemas/user-profile";

export const userProfileRoute: FastifyPluginAsync = (
    fastify: FastifyInstance
): Promise<void> => {
    fastify.get("/api/user-profile", {
                schema: {
                    description: "Get the profile of the user",
                    operationId: "userprofile_get",
                    summary: "Get the profile of the user",
                    response: {
                        200: userProfileSchema,
                    }
                },
            }, async (req) => {
        return { is_admin: req.user?.is_admin || false } as UserProfile;
    });

    return Promise.resolve();
};

export default userProfileRoute;

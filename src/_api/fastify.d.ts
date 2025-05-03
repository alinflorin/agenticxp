import { User } from "./models/user";

declare module "fastify" {
    interface FastifyRequest {
        user?: User;
    }
}

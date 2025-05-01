import { User } from "./_api/models/user";

declare module "fastify" {
    interface FastifyRequest {
      user?: User;
    }
  }
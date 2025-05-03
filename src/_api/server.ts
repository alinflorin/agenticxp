import './loadEnv';
import Fastify from "fastify";
import helloRoute from "./routes/hello";
import opaMiddleware from "./middlewares/opa-middleware";
import userProfileRoute from "./routes/user-profile";
import spaRoute from "./routes/spa";
import healthRoute from "./routes/health";

(async () => {
    try {
        const fastify = Fastify({
            logger: {
                level: "warn",
            },
        });
        opaMiddleware(fastify);


        await fastify.register(healthRoute);
        await fastify.register(spaRoute);
        await fastify.register(userProfileRoute);
        await fastify.register(helloRoute);

        const start = async () => {
            try {
                await fastify.listen({ port: 3000, host: "0.0.0.0" });
                console.log(`Server listening on port 3000`);
            } catch (err) {
                fastify.log.error(err);
                process.exit(1);
            }
        };

        process.on("SIGTERM", async () => {
            try {
                await fastify.close();
            } catch (err: unknown) {
                console.error(err);
            }
            process.exit(0);
        });

        await start();
    } catch (err: unknown) {
        console.error(err);
        process.exit(1);
    }
})();

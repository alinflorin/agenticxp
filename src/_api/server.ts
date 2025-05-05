import "./loadEnv";
import "./extendYup";
import Fastify from "fastify";
import helloRoute from "./routes/hello";
import opaMiddleware from "./middlewares/opa-middleware";
import userProfileRoute from "./routes/user-profile";
import spaRoute from "./routes/spa";
import healthRoute from "./routes/health";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { version } from "@/version";
import path from "path";
import connectionsRoute from "./routes/connections";
import {
    type YupTypeProvider,
    jsonSchemaTransformer,
    createValidatorCompiler,
    defaultYupValidatorCompilerOptions,
    createSerializerCompiler
} from "fastify-type-provider-yup";


const isDev = process.argv[process.argv.length - 1].endsWith(".ts");
console.log("Is Dev: ", isDev);

(async () => {
    try {
        const fastify = Fastify({
            logger: {
                level: "warn",
            },
        }).withTypeProvider<YupTypeProvider>();

        fastify.setValidatorCompiler(createValidatorCompiler({...defaultYupValidatorCompilerOptions}));
        fastify.setSerializerCompiler(createSerializerCompiler({...defaultYupValidatorCompilerOptions}));


        await fastify.register(swagger, {
            openapi: {
                info: {
                    title: "AgenticXP API",
                    version: version,
                },
                components: {
                    securitySchemes: {
                        OpenID: {
                            type: "openIdConnect",
                            openIdConnectUrl:
                                process.env.OIDC_ISSUER +
                                "/.well-known/openid-configuration",
                        },
                    },
                },
                security: [{ OpenID: [] }],
            },
            transform: jsonSchemaTransformer,
        });

        await fastify.register(swaggerUi, {
            routePrefix: "/swagger",
            baseDir: isDev ? undefined : path.resolve("./dist/server/swagger"),
            logo: {
                content: "",
                type: "",
            },
            uiConfig: {
                persistAuthorization: true,
                deepLinking: false,
                docExpansion: "list",
                syntaxHighlight: {
                    activate: true,
                },
                tryItOutEnabled: true,
            },
            initOAuth: {
                appName: "agenticxp",
                clientId: "agenticxp",
                scopes: ["openid", "profile", "email", "offline_access"],
                scopeSeparator: " ",
            },
        });

        opaMiddleware(fastify);

        await fastify.register(healthRoute);
        await fastify.register(userProfileRoute);
        await fastify.register(helloRoute);
        await fastify.register(connectionsRoute);
        await fastify.register(spaRoute);

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

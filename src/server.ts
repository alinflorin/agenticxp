import { config } from "dotenv";
config({ override: true, path: "./.env.local" });
import Fastify from "fastify";
import fs from "fs";
import path from "path";
import mime from "mime";
import helloRoute from "./_api/routes/hello";
import opaMiddleware from "./_api/middlewares/opa-middleware";

interface FileData {
    content: Buffer<ArrayBufferLike>;
    mimeType: string | false;
}

function scanDirectory(directory: string): { [key: string]: FileData } {
    const result: { [key: string]: FileData } = {};
    function readDirRecursively(dir: string): void {
        const files = fs.readdirSync(dir);
        files.forEach((file) => {
            const fullPath = path.join(dir, file);
            const stats = fs.statSync(fullPath);
            if (stats.isDirectory()) {
                readDirRecursively(fullPath);
            } else {
                const mimeType = mime.getType(fullPath);
                const content = fs.readFileSync(fullPath);
                result[fullPath] = {
                    content,
                    mimeType: mimeType ?? "application/octet-stream",
                };
            }
        });
    }
    readDirRecursively(directory);
    return result;
}

let staticFiles: { [key: string]: FileData } = {};
try {
    staticFiles = scanDirectory("./dist/client");
    if (staticFiles["dist/client/index.html"]) {
        const envVars = `<script>
      ${Object.keys(process.env)
          .filter((k) => k.toLowerCase().startsWith("vite_"))
          .map((x) => "window." + x + " = '" + process.env[x] + "';")
          .join(" ")}
    </script>`;
        staticFiles["dist/client/index.html"].content = Buffer.from(
            staticFiles["dist/client/index.html"].content
                .toString()
                .replaceAll("</head>", `${envVars}</head>`)
        );
    }
    console.log(`Loaded static files: ` + Object.keys(staticFiles));
} catch {
    console.error("Error while reading static files");
}

(async () => {
    try {
        const fastify = Fastify({
            logger: {
                level: "warn",
            },
        });

        fastify.get("/health", async (_, res) => {
            res.send({ healthy: true });
        });

        // UI
        fastify.get("/*", async (req, res) => {
            let checkPath = `dist/client${req.url.split("?")[0]}`;
            if (!staticFiles[checkPath]) {
                // is it a file?
                if (
                    checkPath
                        .split("/")[checkPath.split("/").length - 1].split(".").length >= 2
                ) {
                    res.status(404).send("Not found");
                    return;
                }
                checkPath = "dist/client/index.html";
            }
            if (!staticFiles[checkPath]) {
                res.status(404).send("SPA Not found");
                return;
            }
            let cc = `public, max-age=31536000, immutable`;
            if (checkPath === "dist/client/index.html") {
                cc = `public, max-age=0, must-revalidate`;
            }
            res.header("Content-Type", staticFiles[checkPath].mimeType)
                .header("Cache-Control", cc)
                .status(200)
                .send(staticFiles[checkPath].content);
        });

        opaMiddleware(fastify);
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

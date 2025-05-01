import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { FileData } from "../models/file-data";
import { scanDirectory } from "../helpers/files-helper";

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

export const spaRoute: FastifyPluginAsync = (
    fastify: FastifyInstance
): Promise<void> => {
    fastify.get("/*", async (req, res) => {
        let checkPath = `dist/client${req.url.split("?")[0]}`;
        if (!staticFiles[checkPath]) {
            // is it a file?
            if (
                checkPath.split("/")[checkPath.split("/").length - 1].split(".")
                    .length >= 2
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

    return Promise.resolve();
};

export default spaRoute;

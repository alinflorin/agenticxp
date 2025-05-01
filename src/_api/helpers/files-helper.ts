import { FileData } from "../models/file-data";
import fs from "fs";
import path from "path";
import mime from "mime";

export function scanDirectory(directory: string): { [key: string]: FileData } {
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

export interface FileData {
    content: Buffer<ArrayBufferLike>;
    mimeType: string | false;
}
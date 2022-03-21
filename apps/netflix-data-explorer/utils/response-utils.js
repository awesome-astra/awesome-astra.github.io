"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendFile = void 0;
function sendFile(res, mime, filename = '', buffer, bufferLength) {
    res.writeHead(200, {
        'Content-Type': mime,
        'Content-disposition': `attachment; filename="${filename}"`,
        'Content-Length': bufferLength || buffer.length,
    });
    res.end(buffer);
}
exports.sendFile = sendFile;
//# sourceMappingURL=response-utils.js.map
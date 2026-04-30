import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const port = Number(process.env.PORT) || 4173;
const host = process.env.HOST || "0.0.0.0";
const distDir = resolve("dist");
const indexFile = join(distDir, "index.html");

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function sendFile(response, filePath) {
  const contentType = contentTypes[extname(filePath)] ?? "application/octet-stream";

  response.writeHead(200, {
    "Cache-Control": filePath === indexFile ? "no-cache" : "public, max-age=31536000, immutable",
    "Content-Type": contentType,
  });

  createReadStream(filePath).pipe(response);
}

function resolveStaticPath(url = "/") {
  const pathname = decodeURIComponent(url.split("?")[0] ?? "/");
  const normalizedPath = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(distDir, normalizedPath);

  if (!filePath.startsWith(distDir)) {
    return indexFile;
  }

  if (existsSync(filePath) && statSync(filePath).isFile()) {
    return filePath;
  }

  return indexFile;
}

const server = createServer((request, response) => {
  if (!existsSync(indexFile)) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Build output not found. Run npm run build before npm run start.");
    return;
  }

  sendFile(response, resolveStaticPath(request.url));
});

server.listen(port, host, () => {
  console.log(`Static server listening on http://${host}:${port}`);
});

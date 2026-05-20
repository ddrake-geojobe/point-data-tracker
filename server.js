import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;
const POINTS_FILE = path.join(__dirname, "data", "points.json");

const MIME_TYPES = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
};

function readPoints() {
  return JSON.parse(fs.readFileSync(POINTS_FILE, "utf-8"));
}

function writePoints(data) {
  fs.writeFileSync(POINTS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function serveStatic(req, res) {
  const urlPath = req.url === "/" ? "/index.html" : req.url;
  const filePath = path.join(__dirname, urlPath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] ?? "application/octet-stream",
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // GET /api/points
  if (method === "GET" && url === "/api/points") {
    // simulate 5 second delay
    setTimeout(() => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(readPoints()));
    }, 5000);
    return;
  }

  // PUT /api/points/:id
  const updateMatch = url.match(/^\/api\/points\/(\d+)$/);
  if (method === "PUT" && updateMatch) {
    const id = parseInt(updateMatch[1], 10);
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const updated = JSON.parse(body);
      const points = readPoints();
      const index = points.findIndex((p) => p.id === id);
      if (index === -1) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Point not found" }));
        return;
      }
      points[index] = { ...points[index], ...updated, id };
      writePoints(points);
      // 5 second delay
      setTimeout(() => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(points[index]));
      }, 5000);
    });
    return;
  }

  // POST /api/points/
  if (method === "POST") {
    // append to JSON
    console.log("Post", req);
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const newLoc = JSON.parse(body);
      const points = readPoints();
      points.push(newLoc);
      writePoints(points);
      setTimeout(() => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(newLoc));
      }, 2000);
    });

    return;
  }

  // Static files
  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Point Tracker running at http://localhost:${PORT}`);
});

const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    fs.readFile("index.html", "utf8", (err, data) => {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(data);
    });
  } else if (req.url === "/about") {
    fs.readFile("about.html", "utf8", (err, data) => {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(data);
    });
  } else {
    fs.readFile("error.html", "utf8", (err, data) => {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(data);
    });
  }
});

server.listen(8888, () => {
  console.log("Serveur en ligne sur http://localhost:8888");
});

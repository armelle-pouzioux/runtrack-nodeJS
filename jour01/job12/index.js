const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  
  fs.readFile("index.html", (err, data) => {
    if (err) {

      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Erreur serveur !");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    }
  });
});

server.listen(8888, () => {
  console.log("Serveur en ligne sur http://localhost:8888");
});

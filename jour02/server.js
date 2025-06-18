const http = require("http");       
const routes = require("./routes.js");

const server = http.createServer((req, res) => {
    routes(req, res);
});

module.exports = server;
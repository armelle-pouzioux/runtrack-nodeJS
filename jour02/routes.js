const fs = require("fs");
const dataPath = "./data.json";

function routes(req, res) {
  const myUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = myUrl.pathname;
  const method = req.method;

  // Middleware CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // GET /tasks
  if (pathname === "/tasks" && method === "GET") {
    const data = fs.readFileSync(dataPath, "utf8");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);
  }

  // POST /tasks
  else if (pathname === "/tasks" && method === "POST") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      let newTask;
      try {
        newTask = JSON.parse(body);
      } catch (err) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("JSON invalide.");
        return;
      }

      const tasks = JSON.parse(fs.readFileSync(dataPath, "utf8"));

      newTask.id = Date.now();
      tasks.push(newTask);

      fs.writeFileSync(dataPath, JSON.stringify(tasks, null, 2));

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newTask));
    });
  }

  // PUT /tasks/:id
  else if (pathname.startsWith("/tasks/") && method === "PUT") {
    const id = pathname.split("/")[2];
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("ID invalide.");
      return;
    }

    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      let updatedTask;
      try {
        updatedTask = JSON.parse(body);
      } catch (err) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("JSON invalide.");
        return;
      }

      let tasks = JSON.parse(fs.readFileSync(dataPath, "utf8"));
      const taskIndex = tasks.findIndex(t => t.id === parsedId);

      if (taskIndex === -1) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Tâche non trouvée.");
        return;
      }

      tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
      fs.writeFileSync(dataPath, JSON.stringify(tasks, null, 2));

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(tasks[taskIndex]));
    });
  }

  // DELETE /tasks/:id
  else if (pathname.startsWith("/tasks/") && method === "DELETE") {
    const id = pathname.split("/")[2];
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("ID invalide.");
      return;
    }

    let tasks = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    const taskIndex = tasks.findIndex(t => t.id === parsedId);

    if (taskIndex === -1) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Tâche non trouvée.");
      return;
    }

    const deletedTask = tasks.splice(taskIndex, 1);
    fs.writeFileSync(dataPath, JSON.stringify(tasks, null, 2));

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(deletedTask[0]));
  }

  // Route non trouvée
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Route non trouvée.");
  }
}

module.exports = routes;

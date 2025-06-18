fs = require("fs");
const message = "Je manipule les fichiers avec un module node !";
fs.writeFileSync("data.txt", message, "utf8");

console.log("Le fichier a été mis à jour !");
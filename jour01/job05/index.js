const path = require("path");

console.log("le fichier est " + __filename);
console.log("le nom du fichier est " + path.basename(__filename));
console.log("l'extension est " + path.extname(__filename));
console.log("le répertoire est " + path.dirname(__filename));
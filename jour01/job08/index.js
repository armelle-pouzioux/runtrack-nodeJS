const fs = require("fs");

const contenu = fs.readFileSync("data.txt", "utf8");

let resultat = "";

for (let i = 0; i < contenu.length; i += 2) {
  resultat += contenu[i];
}

console.log(resultat);

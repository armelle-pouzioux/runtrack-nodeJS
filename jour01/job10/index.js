const myURL = new URL("https://www.google.com&search=nodejs");

console.log("Le protocole est :", myURL.protocol);
console.log("Le nom d'hôte est :", myURL.hostname);
console.log("Le chemin est :", myURL.pathname);
console.log("La chaîne de requête est :", myURL.search);

myURL.hostname="www.laplateforme.io";

myURL.searchParams.append("search", "nodejs");

console.log("nouvelle URL :", myURL.href);
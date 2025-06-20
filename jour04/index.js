const { MongoClient } = require("mongodb");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function initData(db) {
  const yearCol = db.collection("year");
  const studentCol = db.collection("student");

  const yearsExist = await yearCol.countDocuments();
  if (yearsExist === 0) {
    await yearCol.insertMany([
      { name: "Bachelor 1" },
      { name: "Bachelor 2" },
      { name: "Bachelor 3" },
    ]);
  }

  const studentsExist = await studentCol.countDocuments();
  if (studentsExist === 0) {
    const years = await yearCol.find().toArray();
    await studentCol.insertMany([
      {
        firstname: "Bob",
        lastname: "LeBricoleur",
        students_number: "S10001",
        year_id: years[0]._id,
      },
      {
        firstname: "John",
        lastname: "Doe",
        students_number: "S10002",
        year_id: years[1]._id,
      },
      {
        firstname: "Marine",
        lastname: "Dupont",
        students_number: "S10003",
        year_id: years[2]._id,
      },
    ]);
  }
}

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function showStudents(db) {
  const students = await db
    .collection("student")
    .aggregate([
      {
        $lookup: {
          from: "year",
          localField: "year_id",
          foreignField: "_id",
          as: "yearInfo",
        },
      },
      {
        $unwind: "$yearInfo",
      },
    ])
    .toArray();

  console.log("\n🎓 Étudiants avec cursus :");
  students.forEach((s) => {
    console.log(`- ${s.firstname} ${s.lastname} (${s.students_number}) → ${s.yearInfo.name}`);
  });
}

async function addStudent(db) {
  const firstname = await ask("Prénom : ");
  const lastname = await ask("Nom : ");
  const number = await ask("Numéro étudiant (ex: S10004) : ");
  const cursus = await ask("Cursus (Bachelor 1, 2 ou 3) : ");

  const year = await db.collection("year").findOne({ name: cursus });
  if (!year) return console.log("❌ Cursus invalide.");

  await db.collection("student").insertOne({
    firstname,
    lastname,
    students_number: number,
    year_id: year._id,
  });
  console.log("✅ Etudiant ajouté !");
}

async function updateStudent(db) {
  const number = await ask("Numéro étudiant : ");
  const cursus = await ask("Nouveau cursus : ");

  const year = await db.collection("year").findOne({ name: cursus });
  if (!year) return console.log("❌ Cursus invalide.");

  const result = await db.collection("student").updateOne(
    { students_number: number },
    { $set: { year_id: year._id } }
  );

  if (result.modifiedCount === 0) {
    console.log("❌ Aucun étudiant mis à jour.");
  } else {
    console.log("✅ Mise à jour réussie.");
  }
}

async function deleteStudent(db) {
  const number = await ask("Numéro étudiant à supprimer : ");
  const result = await db.collection("student").deleteOne({ students_number: number });
  if (result.deletedCount === 0) {
    console.log("❌ Aucun étudiant trouvé.");
  } else {
    console.log("🗑️ Etudiant supprimé.");
  }
}

async function menu(db) {
  while (true) {
    console.log("\n=== MENU ===");
    console.log("1. Voir tous les étudiants");
    console.log("2. Ajouter un étudiant");
    console.log("3. Modifier un étudiant");
    console.log("4. Supprimer un étudiant");
    console.log("5. Quitter\n");

    const choice = await ask("👉 Choix : ");

    switch (choice) {
      case "1":
        await showStudents(db);
        break;
      case "2":
        await addStudent(db);
        break;
      case "3":
        await updateStudent(db);
        break;
      case "4":
        await deleteStudent(db);
        break;
      case "5":
        console.log("👋 Au revoir !");
        rl.close();
        return;
      default:
        console.log("❌ Choix invalide");
    }
  }
}

async function main() {
  try {
    await client.connect();
    const db = client.db("LaPlateforme");
    await initData(db);
    console.log("✅ Connected to database");
    await menu(db);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main();

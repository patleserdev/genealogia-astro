// migrate-relations-to-objectid.ts
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config(); // charge .env

const uri = process.env.MONGO_URI;

async function migrate() {

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("genealogie"); // <- adapte le nom de ta DB
    const relations = db.collection("relations");

    const allRelations = await relations.find({}).toArray();
    console.log(`Relations à vérifier : ${allRelations.length}`);

    let migratedCount = 0;

    for (const r of allRelations) {
      const update= {};

      if (typeof r.from === "string") update.from = new ObjectId(r.from);
      if (typeof r.to === "string") update.to = new ObjectId(r.to);

      if (Object.keys(update).length > 0) {
        await relations.updateOne({ _id: r._id }, { $set: update });
        migratedCount++;
        console.log(`Migrated relation ${r._id.toString()}`);
      }
    }

    console.log(`Migration terminée : ${migratedCount} documents modifiés.`);
  } catch (err) {
    console.error("Erreur pendant la migration :", err);
  } finally {
    await client.close();
  }
}

migrate();
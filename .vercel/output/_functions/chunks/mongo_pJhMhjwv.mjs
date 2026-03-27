import { MongoClient } from 'mongodb';
import 'dotenv/config';

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error("MONGO_URI manquant dans .env");
}
const client = new MongoClient(uri);
const clientPromise = client.connect().then((c) => {
  console.log("✅ MongoDB connecté");
  return c;
});
const connectedClient = await clientPromise;
const db = connectedClient.db("genealogie");
const persons = db.collection("persons");
const relations = db.collection("relations");
const loginLogs = db.collection("login_logs");

export { db as d, loginLogs as l, persons as p, relations as r };

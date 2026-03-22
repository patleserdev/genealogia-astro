import { MongoClient } from "mongodb";
import type { Person } from "../models/Person.ts";
import type { Relation } from "../models/Relation.ts";
import 'dotenv/config'
import type { LoginLog } from "../models/LoginLogs.ts";

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGO_URI manquant dans .env");
}

const client = new MongoClient(uri);

// La promesse de connexion, partagée partout
const clientPromise: Promise<MongoClient> = client.connect().then((c) => {
  console.log("✅ MongoDB connecté");
  return c;
});

// Pour tes collections, on attend que le client soit connecté
const connectedClient = await clientPromise;
export const db = connectedClient.db("genealogie");
export const persons = db.collection<Person>("persons");
export const relations = db.collection<Relation>("relations");
export const loginLogs = db.collection<LoginLog>('login_logs')
// Export pour Auth.js
export { clientPromise };
export default client;
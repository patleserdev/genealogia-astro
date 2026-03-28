import { MongoClient } from "mongodb";
import type { Person } from "../models/Person.ts";
import type { Relation } from "../models/Relation.ts";
import 'dotenv/config'
import type { LoginLog } from "../models/LoginLogs.ts";



const uri = process.env.MONGO_URI;
if (!uri) throw new Error("MONGO_URI manquant");

// Réutilise la connexion entre les invocations Vercel
const globalWithMongo = global as typeof globalThis & {
  _mongoClient?: MongoClient;
};

if (!globalWithMongo._mongoClient) {
  globalWithMongo._mongoClient = new MongoClient(uri);
  await globalWithMongo._mongoClient.connect();
  console.log("✅ MongoDB connecté");
}

const client = globalWithMongo._mongoClient;

export const db        = client.db("genealogie");
export const persons   = db.collection<Person>("persons");
export const relations = db.collection<Relation>("relations");
export const loginLogs = db.collection<LoginLog>("login_logs");

export const clientPromise = Promise.resolve(client);
export default client;
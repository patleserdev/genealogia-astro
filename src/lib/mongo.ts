import { MongoClient } from "mongodb";
import type { Person } from "../models/Person.ts";
import type { Relation } from "../models/Relation.ts";

const uri = import.meta.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGO_URI manquant dans .env");
}

const client = new MongoClient(uri);

export const db = client.db("genealogie");
export const persons = db.collection<Person>("persons");
export const relations = db.collection<Relation>("relations");

await client.connect();
console.log("✅ MongoDB connecté");

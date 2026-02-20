import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://genealogia:aU19hP6qGxosaQMH@cluster0.y8zvwuk.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);
const db = client.db("genealogie");
const persons = db.collection("persons");
const relations = db.collection("relations");
await client.connect();
console.log("✅ MongoDB connecté");

export { persons as p, relations as r };

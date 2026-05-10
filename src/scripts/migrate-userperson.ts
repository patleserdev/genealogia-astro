import "dotenv/config"
import { ObjectId } from "mongodb";
import { db } from "../lib/mongo";


const users = await db.collection("users").find().toArray()
const persons = await db.collection("persons").find().toArray()

for (const person of persons) {
  await db.collection("user_persons").updateOne(
    {
      userId: new ObjectId('69c0083de036051133c5e185'),
      personId: person._id
    },
    {
      $setOnInsert: {
        role: "owner",
        source: "created",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    },
    { upsert: true }
  )
}

console.log("✅ Migration userpersons OK");
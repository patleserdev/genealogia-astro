
import "dotenv/config"
import { db } from "../lib/mongo";

// src/scripts/migrate-users.ts
await db.collection("users").updateMany(
  { role: { $exists: false } },
  { $set: { role: "OWNER" } }
);
console.log("✅ Migration users OK");
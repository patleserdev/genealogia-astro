import type { APIRoute } from "astro"
import { db } from "../../../lib/mongo.ts"

// src/pages/api/persons/search.ts
export const GET: APIRoute = async ({ url }) => {
    const q = url.searchParams.get('q') ?? ''
  
    const persons = await db.collection('persons').find({
      active: true,
      $or: [
        { prenom: { $regex: q, $options: 'i' } },
        { nom:    { $regex: q, $options: 'i' } },
      ],
    })
    .limit(10)
    .toArray()
  
    return new Response(JSON.stringify(persons))
  }
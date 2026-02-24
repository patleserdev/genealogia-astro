// src/pages/api/tree.ts
import type { APIRoute } from "astro";
import { ObjectId } from "mongodb";
import { persons, relations } from "../../lib/mongo";

export const GET: APIRoute = async ({ url }) => {
  const id = new ObjectId(url.searchParams.get("id")!);

  const allPersons = await persons.find({}).toArray();
  const allRelations = await relations.find({ type: "PARENT" }).toArray();

  const personMap = new Map(allPersons.map(p => [p._id.toString(), p]));
  const childrenMap = new Map<string, string[]>();
  const parentMap = new Map<string, string[]>();

  for (const rel of allRelations) {
    const from = rel.from.toString();
    const to = rel.to.toString();

    if (!childrenMap.has(from)) childrenMap.set(from, []);
    if (!parentMap.has(to)) parentMap.set(to, []);

    childrenMap.get(from)!.push(to);
    parentMap.get(to)!.push(from);
  }

  const buildLevels = (rootId: string, depth = 2) => {
    const levels: any[] = [];

    let current = [rootId];
    levels.push(current);

    for (let i = 0; i < depth; i++) {
      const next: string[] = [];
      for (const id of current) {
        next.push(...(childrenMap.get(id) || []));
      }
      levels.push(next);
      current = next;
    }

    return levels.map(level =>
      level.map(id => personMap.get(id))
    );
  };

  return new Response(JSON.stringify(buildLevels(id.toString(), 2)), {
    headers: { "Content-Type": "application/json" }
  });
};
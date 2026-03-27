import { ObjectId } from 'mongodb';
import { p as persons, r as relations } from '../../chunks/mongo_pJhMhjwv.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async ({ url }) => {
  const id = new ObjectId(url.searchParams.get("id"));
  const allPersons = await persons.find({}).toArray();
  const allRelations = await relations.find({ type: "PARENT" }).toArray();
  const personMap = new Map(allPersons.map((p) => [p._id.toString(), p]));
  const childrenMap = /* @__PURE__ */ new Map();
  const parentMap = /* @__PURE__ */ new Map();
  for (const rel of allRelations) {
    const from = rel.from.toString();
    const to = rel.to.toString();
    if (!childrenMap.has(from)) childrenMap.set(from, []);
    if (!parentMap.has(to)) parentMap.set(to, []);
    childrenMap.get(from).push(to);
    parentMap.get(to).push(from);
  }
  const buildLevels = (rootId, depth = 2) => {
    const levels = [];
    let current = [rootId];
    levels.push(current);
    for (let i = 0; i < depth; i++) {
      const next = [];
      for (const id2 of current) {
        next.push(...childrenMap.get(id2) || []);
      }
      levels.push(next);
      current = next;
    }
    return levels.map(
      (level) => level.map((id2) => personMap.get(id2))
    );
  };
  return new Response(JSON.stringify(buildLevels(id.toString(), 2)), {
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

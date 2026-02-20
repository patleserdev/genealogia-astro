import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute, o as Fragment } from '../../chunks/astro/server_CVCXfxKo.mjs';
import 'piccolore';
import { $ as $$Baselayout } from '../../chunks/Baselayout_CrTDqnb9.mjs';
import { p as persons, r as relations } from '../../chunks/mongo_Dkx7giOQ.mjs';
import { ObjectId } from 'mongodb';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const personId = new ObjectId(id);
  const person = await persons.findOne({ _id: personId });
  if (!person) throw new Error("Personne non trouv\xE9e");
  const allSpouseRels = await relations.find({
    type: "CONJOINT",
    $or: [{ from: personId }, { to: personId }]
  }).toArray();
  const myChildRels = await relations.find({
    type: "PARENT",
    from: personId
  }).toArray();
  const parentRels = await relations.find({
    type: "PARENT",
    to: personId
  }).toArray();
  const spouseEntries = [];
  for (const rel of allSpouseRels) {
    const spouseId = rel.from.toString() === id ? rel.to : rel.from;
    const spousePerson = await persons.findOne({ _id: spouseId });
    const allCoupleChildRels = await relations.find({
      type: "PARENT",
      coupleRelationId: rel._id
      // ← cherche via l'index du couple, pas via "from"
    }).toArray();
    const allChildIds = [...new Set(allCoupleChildRels.map((r) => r.to.toString()))];
    const childObjs = allChildIds.length > 0 ? await persons.find({ _id: { $in: allChildIds.map((i) => new ObjectId(i)) } }).toArray() : [];
    spouseEntries.push({
      relId: rel._id.toString(),
      spousePerson,
      status: rel.status ?? "ACTIVE",
      dateDebut: rel.dateDebut,
      dateFin: rel.dateFin,
      children: childObjs
    });
  }
  const orphanChildRels = myChildRels.filter((r) => !r.coupleRelationId);
  const orphanChildren = orphanChildRels.length > 0 ? await persons.find({ _id: { $in: orphanChildRels.map((r) => r.to) } }).toArray() : [];
  const parentIds = parentRels.map((r) => r.from);
  const parentObjs = parentIds.length > 0 ? await persons.find({ _id: { $in: parentIds } }).toArray() : [];
  return renderTemplate`${renderComponent($$result, "Baselayout", $$Baselayout, { "title": `${person.prenom} ${person.nom}` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h2 class="text-2xl font-bold mb-4">${person.prenom} ${person.nom}</h2>  <div class="bg-white shadow-md rounded-lg p-6 max-w-lg mb-6"> <p><span class="font-semibold">Email :</span> ${person.email || "Non renseign\xE9"}</p> <p><span class="font-semibold">Date de naissance :</span> ${person.dateNaissance || "Non renseign\xE9e"}</p> ${person.dateDeces && renderTemplate`<p><span class="font-semibold">Date de décès :</span> ${person.dateDeces}</p>`} <p><span class="font-semibold">Sexe :</span> ${person.sexe || "Non renseign\xE9"}</p> ${person.notes && renderTemplate`<p class="mt-2 text-gray-600 italic">${person.notes}</p>`} </div> <div class="grid gap-6 max-w-lg"> <!-- Parents --> <div class="bg-white shadow-md rounded-lg p-4"> <h3 class="font-semibold mb-2 text-gray-700 text-lg">Parents</h3> ${parentObjs.length > 0 ? renderTemplate`<ul class="space-y-1"> ${parentObjs.map((p) => renderTemplate`<li> <a${addAttribute(`/persons/${p._id}`, "href")} class="text-blue-600 hover:underline"> ${p.prenom} ${p.nom} </a> </li>`)} </ul>` : renderTemplate`<p class="text-gray-400">Aucun parent enregistré</p>`} </div> <!-- Conjoints & ex-conjoints avec leurs enfants --> <div class="bg-white shadow-md rounded-lg p-4"> <h3 class="font-semibold mb-3 text-gray-700 text-lg">Relations & Enfants</h3> ${spouseEntries.length > 0 ? renderTemplate`<div class="space-y-4"> ${spouseEntries.map((entry) => renderTemplate`<div${addAttribute(`border rounded-lg p-3 ${entry.status === "ACTIVE" ? "border-green-300 bg-green-50" : "border-gray-200 bg-gray-50"}`, "class")}> <!-- En-tête conjoint --> <div class="flex items-center gap-2 mb-2"> <span${addAttribute(`text-xs font-medium px-2 py-0.5 rounded-full ${entry.status === "ACTIVE" ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-600"}`, "class")}> ${entry.status === "ACTIVE" ? "Conjoint(e)" : "Ex-conjoint(e)"} </span> ${entry.spousePerson ? renderTemplate`<a${addAttribute(`/persons/${entry.spousePerson._id}`, "href")} class="font-medium text-blue-600 hover:underline"> ${entry.spousePerson.prenom} ${entry.spousePerson.nom} </a>` : renderTemplate`<span class="text-gray-400 italic">Personne supprimée</span>`} </div> <!-- Dates union --> ${(entry.dateDebut || entry.dateFin) && renderTemplate`<p class="text-xs text-gray-500 mb-2"> ${entry.dateDebut && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`Depuis le ${entry.dateDebut}` })}`} ${entry.dateFin && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` — jusqu'au ${entry.dateFin}` })}`} </p>`} <!-- Enfants de ce couple --> ${entry.children.length > 0 ? renderTemplate`<div> <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
Enfants communs (${entry.children.length})
</p> <ul class="space-y-0.5"> ${entry.children.map((c) => renderTemplate`<li class="flex items-center gap-1 text-sm"> <span class="text-gray-400">↳</span> <a${addAttribute(`/persons/${c._id}`, "href")} class="text-blue-600 hover:underline"> ${c.prenom} ${c.nom} </a> ${c.dateNaissance && renderTemplate`<span class="text-gray-400 text-xs">(${c.dateNaissance})</span>`} </li>`)} </ul> </div>` : renderTemplate`<p class="text-xs text-gray-400 italic">Aucun enfant commun enregistré</p>`} </div>`)} </div>` : renderTemplate`<p class="text-gray-400">Aucune relation enregistrée</p>`} </div> <!-- Enfants sans couple associé --> ${orphanChildren.length > 0 && renderTemplate`<div class="bg-white shadow-md rounded-lg p-4"> <h3 class="font-semibold mb-2 text-gray-700 text-lg">Enfants (sans relation associée)</h3> <ul class="space-y-1"> ${orphanChildren.map((c) => renderTemplate`<li> <a${addAttribute(`/persons/${c._id}`, "href")} class="text-blue-600 hover:underline"> ${c.prenom} ${c.nom} </a> ${c.dateNaissance && renderTemplate`<span class="text-gray-400 text-xs ml-2">(${c.dateNaissance})</span>`} </li>`)} </ul> </div>`} </div> <a href="/" class="mt-6 inline-block text-blue-600 hover:underline">← Retour à l'accueil</a> ` })}`;
}, "C:/lacapsule-testsperso/genealogia-astro/src/pages/person/[id].astro", void 0);

const $$file = "C:/lacapsule-testsperso/genealogia-astro/src/pages/person/[id].astro";
const $$url = "/person/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

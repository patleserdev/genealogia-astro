import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute, o as Fragment } from '../../chunks/astro/server_Cr2bBY3R.mjs';
import 'piccolore';
import { $ as $$Baselayout } from '../../chunks/Baselayout_BtxBugC6.mjs';
import { d as db, p as persons, r as relations } from '../../chunks/mongo_pJhMhjwv.mjs';
import { ObjectId } from 'mongodb';
import { f as formatFullName } from '../../chunks/formatName_BxoIGF2R.mjs';
import { f as formatDateFR } from '../../chunks/formatDate_DWbQ-kky.mjs';
import { v as verifyToken } from '../../chunks/auth_C0Ch4QAz.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const token = Astro2.cookies.get("token")?.value;
  if (!token) return Astro2.redirect("/login");
  let user = null;
  try {
    const payload = verifyToken(token);
    user = await db.collection("users").findOne({ _id: new ObjectId(payload.userId) });
  } catch {
    return Astro2.redirect("/login");
  }
  const { id } = Astro2.params;
  const personId = new ObjectId(id);
  const person = await persons.findOne({ _id: personId });
  if (!person) throw new Error("Personne non trouv\xE9e");
  const allSpouseRels = await relations.find({
    type: "CONJOINT",
    $or: [{ from: personId }, { to: personId }]
  }).toArray();
  const parentRels = await relations.find({
    type: "PARENT",
    to: personId
  }).toArray();
  const myChildRels = await relations.find({
    type: "PARENT",
    from: personId
  }).toArray();
  const spouseEntries = [];
  for (const rel of allSpouseRels) {
    const fromId = typeof rel.from === "string" ? new ObjectId(rel.from) : rel.from;
    const toId = typeof rel.to === "string" ? new ObjectId(rel.to) : rel.to;
    const spouseId = fromId.equals(personId) ? toId : fromId;
    const spousePerson = await persons.findOne({ _id: spouseId });
    const coupleId = typeof rel._id === "string" ? new ObjectId(rel._id) : rel._id;
    const childrenRels = await relations.find({
      type: "PARENT",
      coupleRelationId: coupleId
    }).toArray();
    const childrenIds = childrenRels.map(
      (r) => typeof r.to === "string" ? new ObjectId(r.to) : r.to
    );
    const children = childrenIds.length > 0 ? await persons.find({ _id: { $in: childrenIds } }).toArray() : [];
    spouseEntries.push({
      relId: rel._id.toString(),
      spousePerson,
      status: rel.status ?? "ACTIVE",
      dateDebut: rel.dateDebut,
      dateFin: rel.dateFin,
      children
    });
  }
  const orphanChildRels = myChildRels.filter((r) => !r.coupleRelationId);
  const orphanChildren = orphanChildRels.length > 0 ? await persons.find({
    _id: {
      $in: orphanChildRels.map(
        (r) => typeof r.to === "string" ? new ObjectId(r.to) : r.to
      )
    }
  }).toArray() : [];
  const parentIds = parentRels.map(
    (r) => typeof r.from === "string" ? new ObjectId(r.from) : r.from
  );
  for (const rel of parentRels) {
    if (rel.coupleRelationId) {
      const coupleRel = await relations.findOne({ _id: rel.coupleRelationId });
      if (coupleRel) {
        const fromId = typeof coupleRel.from === "string" ? new ObjectId(coupleRel.from) : coupleRel.from;
        const toId = typeof coupleRel.to === "string" ? new ObjectId(coupleRel.to) : coupleRel.to;
        const otherParentId = fromId.equals(parentIds[0]) ? toId : fromId;
        if (!parentIds.some((id2) => id2.equals(otherParentId))) {
          parentIds.push(otherParentId);
        }
      }
    }
  }
  const parentObjs = parentIds.length > 0 ? await persons.find({ _id: { $in: parentIds } }).toArray() : [];
  const siblings = [];
  for (const rel of parentRels) {
    if (rel.coupleRelationId) {
      const siblingRels = await relations.find({
        type: "PARENT",
        coupleRelationId: rel.coupleRelationId,
        to: { $ne: personId }
        // exclure la personne elle-même
      }).toArray();
      for (const sibRel of siblingRels) {
        const sibId = typeof sibRel.to === "string" ? new ObjectId(sibRel.to) : sibRel.to;
        if (!siblings.some((s) => s._id.equals(sibId))) {
          const sibPerson = await persons.findOne({ _id: sibId });
          if (sibPerson) siblings.push(sibPerson);
        }
      }
    }
  }
  return renderTemplate`${renderComponent($$result, "Baselayout", $$Baselayout, { "title": `${formatFullName(person.prenom, person.nom)}` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-4xl mx-auto px-6 py-8 space-y-6"> <!-- En-tête --> <div class="flex items-center justify-between"> <a href="/persons" class="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 transition-colors"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path> </svg>
Retour
</a> <div class="flex items-center gap-2"> <a${addAttribute(`/tree/${person._id}`, "href")} class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:border-amber-300 hover:text-amber-700 text-sm font-medium transition-colors"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 7h6M3 12h6M3 17h6M13 7l4 5-4 5M17 12H21"></path> </svg>
Vue arbre
</a> <a${addAttribute(`/addperson?id=${person._id}&returnUrl=${encodeURIComponent(Astro2.url.pathname)}`, "href")} class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition-colors"> <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-1.414a2 2 0 01.586-1.414z"></path> </svg>
Modifier
</a> </div> </div> <!-- Carte identité --> <div class="bg-white border border-stone-200 rounded-xl p-6"> <div class="flex items-start gap-5"> <!-- Avatar --> <div class="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center shrink-0"> <span class="text-xl font-semibold text-amber-700"> ${person.prenom.charAt(0).toUpperCase()}${person.nom.charAt(0).toUpperCase()} </span> </div> <!-- Infos --> <div class="flex-1 min-w-0"> <h1 class="text-2xl font-semibold text-stone-800 tracking-tight"> ${formatFullName(person.prenom, person.nom)} </h1> <div class="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-4"> <div> <p class="text-xs text-stone-400 mb-0.5">Naissance</p> <p class="text-sm font-medium text-stone-800"> ${formatDateFR(person.dateNaissance) ?? "\u2014"} </p> </div> ${person.dateDeces && renderTemplate`<div> <p class="text-xs text-stone-400 mb-0.5">Décès</p> <p class="text-sm font-medium text-stone-800">${formatDateFR(person.dateDeces)}</p> </div>`} <div> <p class="text-xs text-stone-400 mb-0.5">Sexe</p> <p class="text-sm font-medium text-stone-800"> ${person.sexe === "M" ? "Homme" : person.sexe === "F" ? "Femme" : person.sexe ?? "\u2014"} </p> </div> <div> <p class="text-xs text-stone-400 mb-0.5">Email</p> <p class="text-sm font-medium text-stone-800 truncate">${person.email ?? "\u2014"}</p> </div> </div> ${person.notes && renderTemplate`<p class="mt-3 text-sm text-stone-500 italic border-t border-stone-100 pt-3"> ${person.notes} </p>`} </div> </div> </div> <!-- Grille relations --> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"> <!-- Parents --> <div class="bg-white border border-stone-200 rounded-xl p-5"> <div class="flex items-center gap-2 mb-4"> <div class="w-6 h-6 rounded-md bg-amber-50 flex items-center justify-center"> <svg class="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"></path> </svg> </div> <h3 class="text-xs font-semibold text-stone-500 uppercase tracking-wider">
Parents
</h3> <span class="ml-auto text-xs text-stone-400">${parentObjs.length}</span> </div> ${parentObjs.length > 0 ? renderTemplate`<ul class="space-y-2"> ${parentObjs.map((p) => renderTemplate`<li> <a${addAttribute(`/person/${p._id}`, "href")} class="flex items-center gap-2.5 group"> <div class="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center shrink-0 text-xs font-medium text-stone-600 group-hover:bg-amber-50 group-hover:text-amber-700 transition-colors"> ${p.prenom.charAt(0)}${p.nom.charAt(0)} </div> <span class="text-sm text-stone-700 group-hover:text-amber-700 transition-colors"> ${formatFullName(p.prenom, p.nom)} </span> </a> </li>`)} </ul>` : renderTemplate`<p class="text-sm text-stone-400">Aucun parent enregistré</p>`} </div> <!-- Frères & Sœurs --> <div class="bg-white border border-stone-200 rounded-xl p-5"> <div class="flex items-center gap-2 mb-4"> <div class="w-6 h-6 rounded-md bg-stone-100 flex items-center justify-center"> <svg class="w-3.5 h-3.5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197"></path> </svg> </div> <h3 class="text-xs font-semibold text-stone-500 uppercase tracking-wider">
Frères & Sœurs
</h3> <span class="ml-auto text-xs text-stone-400">${siblings.length}</span> </div> ${siblings.length > 0 ? renderTemplate`<ul class="space-y-2"> ${siblings.map((s) => renderTemplate`<li> <a${addAttribute(`/person/${s._id}`, "href")} class="flex items-center gap-2.5 group"> <div class="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center shrink-0 text-xs font-medium text-stone-600 group-hover:bg-amber-50 group-hover:text-amber-700 transition-colors"> ${s.prenom.charAt(0)}${s.nom.charAt(0)} </div> <div> <span class="text-sm text-stone-700 group-hover:text-amber-700 transition-colors block"> ${formatFullName(s.prenom, s.nom)} </span> ${s.dateNaissance && renderTemplate`<span class="text-xs text-stone-400">${formatDateFR(s.dateNaissance)}</span>`} </div> </a> </li>`)} </ul>` : renderTemplate`<p class="text-sm text-stone-400">Aucun frère ou sœur enregistré</p>`} </div> <!-- Relations & Enfants --> <div class="bg-white border border-stone-200 rounded-xl p-5"> <div class="flex items-center gap-2 mb-4"> <div class="w-6 h-6 rounded-md bg-pink-50 flex items-center justify-center"> <svg class="w-3.5 h-3.5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path> </svg> </div> <h3 class="text-xs font-semibold text-stone-500 uppercase tracking-wider">
Relations & Enfants
</h3> <span class="ml-auto text-xs text-stone-400">${spouseEntries.length}</span> </div> ${spouseEntries.length > 0 ? renderTemplate`<div class="space-y-3"> ${spouseEntries.map((entry) => renderTemplate`<div${addAttribute(`rounded-xl p-3 border ${entry.status === "ACTIVE" ? "border-green-200 bg-green-50" : "border-stone-200 bg-stone-50"}`, "class")}> <!-- Conjoint --> <div class="flex items-center gap-2 mb-2"> <span${addAttribute(`text-xs font-medium px-2 py-0.5 rounded-full ${entry.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-stone-200 text-stone-500"}`, "class")}> ${entry.status === "ACTIVE" ? "Conjoint(e)" : "Ex-conjoint(e)"} </span> ${entry.spousePerson ? renderTemplate`<a${addAttribute(`/person/${entry.spousePerson._id}`, "href")} class="text-sm font-medium text-stone-800 hover:text-amber-700 transition-colors"> ${formatFullName(entry.spousePerson.prenom, entry.spousePerson.nom)} </a>` : renderTemplate`<span class="text-sm text-stone-400 italic">Personne supprimée</span>`} </div> ${(entry.dateDebut || entry.dateFin) && renderTemplate`<p class="text-xs text-stone-400 mb-2"> ${entry.dateDebut && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`Depuis le ${formatDateFR(entry.dateDebut)}` })}`} ${entry.dateFin && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` — ${formatDateFR(entry.dateFin)}` })}`} </p>`} ${entry.children.length > 0 ? renderTemplate`<div> <p class="text-xs font-medium text-stone-400 uppercase tracking-wide mb-1.5">
Enfants · ${entry.children.length} </p> <ul class="space-y-1"> ${entry.children.map((c) => renderTemplate`<li class="flex items-center gap-1.5"> <span class="text-stone-300">↳</span> <a${addAttribute(`/person/${c._id}`, "href")} class="text-sm text-stone-700 hover:text-amber-700 transition-colors"> ${formatFullName(c.prenom, c.nom)} </a> ${c.dateNaissance && renderTemplate`<span class="text-xs text-stone-400 ml-auto">${c.dateNaissance}</span>`} </li>`)} </ul> </div>` : renderTemplate`<p class="text-xs text-stone-400 italic">Aucun enfant commun</p>`} </div>`)} </div>` : renderTemplate`<p class="text-sm text-stone-400">Aucune relation enregistrée</p>`} </div> <!-- Enfants sans couple associé --> ${orphanChildren.length > 0 && renderTemplate`<div class="bg-white border border-stone-200 rounded-xl p-5"> <div class="flex items-center gap-2 mb-4"> <div class="w-6 h-6 rounded-md bg-amber-50 flex items-center justify-center"> <svg class="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197"></path> </svg> </div> <h3 class="text-xs font-semibold text-stone-500 uppercase tracking-wider">
Enfants sans relation associée
</h3> <span class="ml-auto text-xs text-stone-400">${orphanChildren.length}</span> </div> <ul class="space-y-2"> ${orphanChildren.map((c) => renderTemplate`<li> <a${addAttribute(`/person/${c._id}`, "href")} class="flex items-center gap-2.5 group"> <div class="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center shrink-0 text-xs font-medium text-stone-600 group-hover:bg-amber-50 group-hover:text-amber-700 transition-colors"> ${c.prenom.charAt(0)}${c.nom.charAt(0)} </div> <div> <span class="text-sm text-stone-700 group-hover:text-amber-700 transition-colors block"> ${formatFullName(c.prenom, c.nom)} </span> ${c.dateNaissance && renderTemplate`<span class="text-xs text-stone-400">${formatDateFR(c.dateNaissance)}</span>`} </div> </a> </li>`)} </ul> </div>`} </div> </div> ` })}`;
}, "C:/lacapsule-testsperso/genealogia-astro/src/pages/persons/[id].astro", void 0);

const $$file = "C:/lacapsule-testsperso/genealogia-astro/src/pages/persons/[id].astro";
const $$url = "/persons/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

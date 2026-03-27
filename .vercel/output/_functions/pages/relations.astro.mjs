import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute, o as Fragment } from '../chunks/astro/server_Cr2bBY3R.mjs';
import 'piccolore';
import { $ as $$DeleteButton } from '../chunks/DeleteButton_efOkMzT5.mjs';
import { $ as $$Baselayout } from '../chunks/Baselayout_BtxBugC6.mjs';
import { d as db, r as relations, p as persons } from '../chunks/mongo_pJhMhjwv.mjs';
import { ObjectId } from 'mongodb';
import { f as formatFullName } from '../chunks/formatName_BxoIGF2R.mjs';
import { f as formatDateFR } from '../chunks/formatDate_DWbQ-kky.mjs';
import { v as verifyToken } from '../chunks/auth_C0Ch4QAz.mjs';
/* empty css                                     */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$Relations = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Relations;
  const token = Astro2.cookies.get("token")?.value;
  if (!token) return Astro2.redirect("/login");
  let user = null;
  try {
    const payload = verifyToken(token);
    user = await db.collection("users").findOne({ _id: new ObjectId(payload.userId) });
  } catch {
    return Astro2.redirect("/login");
  }
  const allRelations = await relations.find({}).toArray();
  const personIds = Array.from(
    new Set(allRelations.flatMap((r) => [r.from.toString(), r.to.toString()]))
  );
  const personsObjs = await persons.find({ _id: { $in: personIds.map((id) => new ObjectId(id)) } }).toArray();
  const personsMap = Object.fromEntries(
    personsObjs.map((p) => [p._id.toString(), p])
  );
  const conjointRels = allRelations.filter((r) => r.type === "CONJOINT");
  const parentRels = allRelations.filter((r) => r.type === "PARENT");
  return renderTemplate`${renderComponent($$result, "Baselayout", $$Baselayout, { "title": "Relations", "data-astro-cid-jzridu6h": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-4xl mx-auto px-6 py-8 space-y-6" data-astro-cid-jzridu6h> <!-- En-tête --> <div class="flex items-center justify-between" data-astro-cid-jzridu6h> <div data-astro-cid-jzridu6h> <h1 class="text-2xl font-semibold text-stone-800 tracking-tight" data-astro-cid-jzridu6h>Relations</h1> <p class="text-sm text-stone-500 mt-0.5" data-astro-cid-jzridu6h> ${conjointRels.length} couple${conjointRels.length > 1 ? "s" : ""} · ${parentRels.length} lien${parentRels.length > 1 ? "s" : ""} parent/enfant
</p> </div> <a href="/relations/add" class="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors" data-astro-cid-jzridu6h> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-jzridu6h> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" data-astro-cid-jzridu6h></path> </svg>
Ajouter
</a> </div> <!-- Filtres --> <div class="bg-white border border-stone-200 rounded-xl p-4 space-y-3" data-astro-cid-jzridu6h> <!-- Recherche --> <div class="relative" data-astro-cid-jzridu6h> <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-jzridu6h> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" data-astro-cid-jzridu6h></path> </svg> <input id="search-input" type="text" placeholder="Rechercher par nom ou prénom…" class="w-full pl-9 pr-4 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition" data-astro-cid-jzridu6h> </div> <!-- Boutons filtre --> <div class="flex flex-wrap gap-2" data-astro-cid-jzridu6h> <button data-filter="all" class="filter-btn px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors" data-astro-cid-jzridu6h>
Tous
</button> <button data-filter="CONJOINT" class="filter-btn px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors" data-astro-cid-jzridu6h>
Couples
</button> <button data-filter="PARENT" class="filter-btn px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors" data-astro-cid-jzridu6h>
Parent / Enfant
</button> <div class="w-px bg-stone-200 mx-1 self-stretch" id="status-divider" data-astro-cid-jzridu6h></div> <div id="status-filters" class="flex gap-2" data-astro-cid-jzridu6h> <button data-status="all" class="status-btn px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors" data-astro-cid-jzridu6h>
Tous statuts
</button> <button data-status="ACTIVE" class="status-btn px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors" data-astro-cid-jzridu6h>
En couple
</button> <button data-status="DIVORCED" class="status-btn px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors" data-astro-cid-jzridu6h>
Divorcé
</button> </div> <span id="result-count" class="ml-auto text-xs text-stone-400 self-center" data-astro-cid-jzridu6h></span> </div> </div> <!-- Section Couples --> <section id="section-conjoint" class="space-y-2" data-astro-cid-jzridu6h> <div class="flex items-center gap-2 mb-1" data-astro-cid-jzridu6h> <div class="w-6 h-6 rounded-md bg-pink-50 flex items-center justify-center" data-astro-cid-jzridu6h> <svg class="w-3.5 h-3.5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-jzridu6h> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" data-astro-cid-jzridu6h></path> </svg> </div> <h2 class="text-xs font-semibold text-stone-500 uppercase tracking-wider" data-astro-cid-jzridu6h>
Couples · <span class="conjoint-count" data-astro-cid-jzridu6h>${conjointRels.length}</span> </h2> </div> <div class="space-y-2" id="list-conjoint" data-astro-cid-jzridu6h> ${conjointRels.map((r) => {
    const from = personsMap[r.from.toString()];
    const to = personsMap[r.to.toString()];
    const fromName = `${from?.prenom ?? ""} ${from?.nom ?? ""}`.toLowerCase();
    const toName = `${to?.prenom ?? ""} ${to?.nom ?? ""}`.toLowerCase();
    return renderTemplate`<div class="rel-row bg-white border border-stone-200 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 hover:border-stone-300 hover:shadow-sm transition group" data-type="CONJOINT"${addAttribute(r.status ?? "", "data-status")}${addAttribute(`${fromName} ${toName}`, "data-search")} data-astro-cid-jzridu6h> <!-- Badge statut --> <span${addAttribute(`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full w-fit ${r.status === "ACTIVE" ? "bg-green-50 text-green-700 border border-green-200" : "bg-stone-100 text-stone-500 border border-stone-200"}`, "class")} data-astro-cid-jzridu6h> ${r.status === "ACTIVE" ? "En couple" : "Divorc\xE9"} </span> <!-- Noms --> <div class="flex items-center gap-2 flex-1 text-sm font-medium text-stone-800" data-astro-cid-jzridu6h> <a${addAttribute(`/person/${from?._id}`, "href")} class="hover:text-amber-700 transition-colors" data-astro-cid-jzridu6h> ${formatFullName(from?.prenom, from?.nom)} </a> <svg class="w-6 h-6 text-stone-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-jzridu6h> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h8M12 8l4 4-4 4" data-astro-cid-jzridu6h></path> </svg> <a${addAttribute(`/person/${to?._id}`, "href")} class="hover:text-amber-700 transition-colors" data-astro-cid-jzridu6h> ${formatFullName(to?.prenom, to?.nom)} </a> </div> <!-- Dates --> ${(r.dateDebut || r.dateFin) && renderTemplate`<p class="text-xs text-stone-400 whitespace-nowrap" data-astro-cid-jzridu6h> ${r.dateDebut && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-jzridu6h": true }, { "default": async ($$result3) => renderTemplate`Depuis ${formatDateFR(r.dateDebut)}` })}`} ${r.dateFin && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-jzridu6h": true }, { "default": async ($$result3) => renderTemplate` — ${formatDateFR(r.dateFin)}` })}`} </p>`} <!-- Actions --> <div class="flex items-center gap-1 sm:ml-auto opacity-60 group-hover:opacity-100 transition-opacity shrink-0" data-astro-cid-jzridu6h> <a${addAttribute(`/relations/add?id=${r._id}&returnUrl=${encodeURIComponent(Astro2.url.pathname)}`, "href")} class="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors" title="Modifier" data-astro-cid-jzridu6h> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-jzridu6h> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-1.414a2 2 0 01.586-1.414z" data-astro-cid-jzridu6h></path> </svg> </a> <div class="p-1.5 rounded-lg text-stone-500 hover:text-red-500 hover:bg-red-50 transition-colors" data-astro-cid-jzridu6h> ${renderComponent($$result2, "DeleteButton", $$DeleteButton, { "type": "relation", "id": r._id, "data-astro-cid-jzridu6h": true })} </div> </div> </div>`;
  })} </div> </section> <!-- Section Parent/Enfant --> <section id="section-parent" class="space-y-2" data-astro-cid-jzridu6h> <div class="flex items-center gap-2 mb-1" data-astro-cid-jzridu6h> <div class="w-6 h-6 rounded-md bg-amber-50 flex items-center justify-center" data-astro-cid-jzridu6h> <svg class="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-jzridu6h> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" data-astro-cid-jzridu6h></path> </svg> </div> <h2 class="text-xs font-semibold text-stone-500 uppercase tracking-wider" data-astro-cid-jzridu6h>
Parent / Enfant · <span class="parent-count" data-astro-cid-jzridu6h>${parentRels.length}</span> </h2> </div> <div class="space-y-2" id="list-parent" data-astro-cid-jzridu6h> ${parentRels.map((r) => {
    const from = personsMap[r.from.toString()];
    const to = personsMap[r.to.toString()];
    const fromName = `${from?.prenom ?? ""} ${from?.nom ?? ""}`.toLowerCase();
    const toName = `${to?.prenom ?? ""} ${to?.nom ?? ""}`.toLowerCase();
    return renderTemplate`<div class="rel-row bg-white border border-stone-200 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 hover:border-stone-300 hover:shadow-sm transition group" data-type="PARENT" data-status=""${addAttribute(`${fromName} ${toName}`, "data-search")} data-astro-cid-jzridu6h> <div class="flex items-center gap-3 flex-1 text-sm" data-astro-cid-jzridu6h> <div class="flex items-center gap-1.5" data-astro-cid-jzridu6h> <span class="text-xs text-stone-400 font-medium uppercase tracking-wide" data-astro-cid-jzridu6h>Parent</span> <a${addAttribute(`/person/${from?._id}`, "href")} class="font-medium text-stone-800 hover:text-amber-700 transition-colors" data-astro-cid-jzridu6h> ${formatFullName(from?.prenom, from?.nom)} </a> </div> <svg class="w-6 h-6 text-stone-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-jzridu6h> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" data-astro-cid-jzridu6h></path> </svg> <div class="flex items-center gap-1.5" data-astro-cid-jzridu6h> <span class="text-xs text-stone-400 font-medium uppercase tracking-wide" data-astro-cid-jzridu6h>Enfant</span> <a${addAttribute(`/person/${to?._id}`, "href")} class="font-medium text-stone-800 hover:text-amber-700 transition-colors" data-astro-cid-jzridu6h> ${formatFullName(to?.prenom, to?.nom)} </a> </div> </div> <!-- Actions --> <div class="flex items-center gap-1 sm:ml-auto opacity-60 group-hover:opacity-100 transition-opacity shrink-0" data-astro-cid-jzridu6h> <a${addAttribute(`/relations/add ?id=${r._id}&returnUrl=${encodeURIComponent(Astro2.url.pathname)}`, "href")} class="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors" title="Modifier" data-astro-cid-jzridu6h> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-jzridu6h> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-1.414a2 2 0 01.586-1.414z" data-astro-cid-jzridu6h></path> </svg> </a> <div class="p-1.5 rounded-lg text-stone-500 hover:text-red-500 hover:bg-red-50 transition-colors" data-astro-cid-jzridu6h> ${renderComponent($$result2, "DeleteButton", $$DeleteButton, { "type": "relation", "id": r._id, "data-astro-cid-jzridu6h": true })} </div> </div> </div>`;
  })} </div> </section> <!-- Aucun résultat --> <div id="no-results" class="hidden text-center py-12" data-astro-cid-jzridu6h> <div class="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3" data-astro-cid-jzridu6h> <svg class="w-6 h-6 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-jzridu6h> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" data-astro-cid-jzridu6h></path> </svg> </div> <p class="text-sm text-stone-400" data-astro-cid-jzridu6h>Aucune relation trouvée</p> </div> </div> ` })}  ${renderScript($$result, "C:/lacapsule-testsperso/genealogia-astro/src/pages/relations.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/lacapsule-testsperso/genealogia-astro/src/pages/relations.astro", void 0);

const $$file = "C:/lacapsule-testsperso/genealogia-astro/src/pages/relations.astro";
const $$url = "/relations";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Relations,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

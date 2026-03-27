import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../chunks/astro/server_Cr2bBY3R.mjs';
import 'piccolore';
import { ObjectId } from 'mongodb';
import { $ as $$DeleteButton } from '../chunks/DeleteButton_efOkMzT5.mjs';
import { $ as $$Baselayout } from '../chunks/Baselayout_BtxBugC6.mjs';
import { v as verifyToken } from '../chunks/auth_C0Ch4QAz.mjs';
import { d as db, p as persons } from '../chunks/mongo_pJhMhjwv.mjs';
import { f as formatDateFR } from '../chunks/formatDate_DWbQ-kky.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Persons = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Persons;
  const token = Astro2.cookies.get("token")?.value;
  if (!token) return Astro2.redirect("/login");
  let user = null;
  try {
    const payload = verifyToken(token);
    user = await db.collection("users").findOne({ _id: new ObjectId(payload.userId) });
  } catch {
    return Astro2.redirect("/login");
  }
  const data = await persons.find({ active: true }).toArray();
  const personsList = data.map((p) => ({
    _id: p._id.toString(),
    prenom: p.prenom,
    nom: p.nom,
    dateNaissance: p.dateNaissance,
    email: p.email
  })).sort((a, b) => {
    if (!a.dateNaissance) return 1;
    if (!b.dateNaissance) return -1;
    return new Date(a.dateNaissance).getTime() - new Date(b.dateNaissance).getTime();
  });
  return renderTemplate`${renderComponent($$result, "Baselayout", $$Baselayout, { "title": "Personnes" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-4xl mx-auto px-6 py-8 space-y-6"> <!-- En-tête --> <div class="flex items-center justify-between"> <div> <h1 class="text-2xl font-semibold text-stone-800 tracking-tight">Personnes</h1> <p class="text-sm text-stone-500 mt-0.5">${personsList.length} personne${personsList.length > 1 ? "s" : ""} dans l'arbre</p> </div> <a href="/persons/new" class="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path> </svg>
Ajouter
</a> </div> <!-- Barre recherche + tri --> <div class="flex gap-3"> <div class="relative flex-1"> <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"></path> </svg> <input id="search-input" type="text" placeholder="Rechercher par nom ou prénom…" class="w-full pl-9 pr-4 py-2.5 rounded-lg border border-stone-200 bg-white text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"> </div> <button id="sort-toggle" data-order="asc" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-stone-200 bg-white text-stone-600 text-sm font-medium hover:bg-stone-50 transition-colors whitespace-nowrap"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path> </svg> <span id="sort-label">A → Z</span> </button> </div> <!-- Liste --> <div id="persons-list" class="space-y-2"> ${personsList.map((p) => renderTemplate`<div class="person-card bg-white border border-stone-200 rounded-xl px-5 py-4 flex items-center justify-between hover:border-stone-300 hover:shadow-sm transition group"${addAttribute(p.nom.toLowerCase(), "data-nom")}${addAttribute(p.prenom.toLowerCase(), "data-prenom")}> <!-- Infos --> <div class="flex items-center gap-4 min-w-0"> <div class="w-9 h-9 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0"> <span class="text-sm font-medium text-amber-700"> ${p.prenom.charAt(0).toUpperCase()}${p.nom.charAt(0).toUpperCase()} </span> </div> <div class="min-w-0"> <p class="text-sm font-medium text-stone-800 capitalize truncate"> ${p.prenom} ${p.nom} </p> <div class="flex items-center gap-3 mt-0.5"> ${p.dateNaissance && renderTemplate`<span class="text-xs text-stone-400">Né(e) le ${formatDateFR(p.dateNaissance)}</span>`} ${p.email && renderTemplate`<span class="text-xs text-stone-400 truncate">${p.email}</span>`} </div> </div> </div> <!-- Actions --> <div class="flex items-center gap-1 shrink-0 ml-4 opacity-60 group-hover:opacity-100 transition-opacity"> <a${addAttribute(`/persons/${p._id}`, "href")} class="p-2 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors" title="Voir"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path> </svg> </a> <a${addAttribute(`/tree/${p._id}`, "href")} class="p-2 rounded-lg text-stone-500 hover:text-amber-700 hover:bg-amber-50 transition-colors" title="Vue arbre"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h6M3 12h6M3 17h6M13 7l4 5-4 5M17 12H21"></path> </svg> </a> <a${addAttribute(`/persons/new?id=${p._id}`, "href")} class="p-2 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors" title="Modifier"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-1.414a2 2 0 01.586-1.414z"></path> </svg> </a> <div class="p-2 rounded-lg text-stone-500 hover:text-red-500 hover:bg-red-50 transition-colors" title="Supprimer"> ${renderComponent($$result2, "DeleteButton", $$DeleteButton, { "type": "person", "id": p._id })} </div> </div> </div>`)} </div> <!-- Aucun résultat --> <div id="no-results" class="hidden text-center py-12"> <div class="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3"> <svg class="w-6 h-6 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"></path> </svg> </div> <p class="text-sm text-stone-400">Aucune personne trouvée</p> </div> </div> ` })} ${renderScript($$result, "C:/lacapsule-testsperso/genealogia-astro/src/pages/persons.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/lacapsule-testsperso/genealogia-astro/src/pages/persons.astro", void 0);

const $$file = "C:/lacapsule-testsperso/genealogia-astro/src/pages/persons.astro";
const $$url = "/persons";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Persons,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

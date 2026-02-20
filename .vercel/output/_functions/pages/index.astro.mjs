import { e as createComponent, k as renderComponent, n as renderScript, r as renderTemplate, m as maybeRenderHead, g as addAttribute } from '../chunks/astro/server_C_XB61DQ.mjs';
import 'piccolore';
import { $ as $$Baselayout } from '../chunks/Baselayout_s9RJkwsr.mjs';
import { p as persons } from '../chunks/mongo_Dkx7giOQ.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const data = await persons.find({ active: true }).toArray();
  const personsList = data.map((p) => ({
    _id: p._id.toString(),
    prenom: p.prenom,
    nom: p.nom,
    dateNaissance: p.dateNaissance,
    email: p.email
  }));
  return renderTemplate`${renderComponent($$result, "Baselayout", $$Baselayout, { "title": "Accueil" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h2 class="text-2xl font-bold mb-6 text-gray-800">Liste des personnes</h2> <div class="grid gap-4"> ${personsList.map((p) => renderTemplate`<div class="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"> <div> <p class="font-semibold text-gray-800 capitalize">${p.prenom} ${p.nom}</p> ${p.dateNaissance && renderTemplate`<p class="text-sm text-gray-500">Né(e) le : ${p.dateNaissance}</p>`} ${p.email && renderTemplate`<p class="text-sm text-gray-500">${p.email}</p>`} </div> <div class="flex gap-2 items-center"> <a${addAttribute(`/persons/${p._id}`, "href")} class="text-blue-600 hover:underline text-sm font-medium">
Voir
</a> <a${addAttribute(`/addperson?id=${p._id}`, "href")} class="text-amber-600 hover:underline text-sm font-medium">
Modifier
</a> <button${addAttribute(p._id, "data-id")}${addAttribute(`${p.prenom} ${p.nom}`, "data-nom")} class="delete-btn bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 text-sm font-medium transition-colors">
Supprimer
</button> </div> </div>`)} </div> ` })} ${renderScript($$result, "C:/lacapsule-testsperso/genealogia-astro/src/pages/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/lacapsule-testsperso/genealogia-astro/src/pages/index.astro", void 0);

const $$file = "C:/lacapsule-testsperso/genealogia-astro/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

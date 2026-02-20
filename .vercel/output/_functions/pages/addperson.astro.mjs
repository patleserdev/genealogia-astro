import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, l as defineScriptVars, g as addAttribute, m as maybeRenderHead } from '../chunks/astro/server_C_XB61DQ.mjs';
import 'piccolore';
import { $ as $$Baselayout } from '../chunks/Baselayout_s9RJkwsr.mjs';
import { p as persons } from '../chunks/mongo_Dkx7giOQ.mjs';
import { ObjectId } from 'mongodb';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const prerender = false;
const $$Addperson = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Addperson;
  const { id } = Astro2.url.searchParams ? { id: Astro2.url.searchParams.get("id") } : { id: null };
  let person = null;
  if (id) {
    person = await persons.findOne({ _id: new ObjectId(id) });
  }
  return renderTemplate`${renderComponent($$result, "Baselayout", $$Baselayout, { "title": person ? "Modifier une personne" : "Ajouter une personne" }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<h2 class="text-2xl font-bold mb-6 text-gray-800"> ', ' </h2> <form id="form" class="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto space-y-4"> <!-- Pr\xE9nom --> <div class="flex flex-col"> <label class="mb-1 font-medium text-gray-700">Pr\xE9nom</label> <input name="prenom" placeholder="Pr\xE9nom" required', ' class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"> </div> <!-- Nom --> <div class="flex flex-col"> <label class="mb-1 font-medium text-gray-700">Nom</label> <input name="nom" placeholder="Nom" required', ' class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"> </div> <!-- Email --> <div class="flex flex-col"> <label class="mb-1 font-medium text-gray-700">Adresse email</label> <input type="email" name="email" placeholder="Adresse email"', ' class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"> </div> <!-- Date de naissance --> <div class="flex flex-col"> <label class="mb-1 font-medium text-gray-700">Date de naissance</label> <input type="date" name="dateNaissance"', ' class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"> </div> <!-- Sexe --> <div class="flex flex-col"> <label class="mb-1 font-medium text-gray-700">Sexe</label> <select name="sexe" class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"> <option value="M"', '>Homme</option> <option value="F"', '>Femme</option> <option value="Autre"', '>Autre</option> </select> </div> <button type="submit" class="w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"> ', " </button> ", " </form> <script>(function(){", '\n    const form = document.getElementById("form");\n\n    form.addEventListener("submit", async (e) => {\n      e.preventDefault();\n      const data = Object.fromEntries(new FormData(form));\n\n      if (personId) {\n        // Mode \xE9dition \u2192 PATCH\n        await fetch(`/api/persons/${personId}`, {\n          method: "PATCH",\n          headers: { "Content-Type": "application/json" },\n          body: JSON.stringify(data),\n        });\n      } else {\n        // Mode cr\xE9ation \u2192 POST\n        await fetch("/api/persons", {\n          method: "POST",\n          headers: { "Content-Type": "application/json" },\n          body: JSON.stringify(data),\n        });\n      }\n\n      window.location.href = "/";\n    });\n  })();<\/script> '], [" ", '<h2 class="text-2xl font-bold mb-6 text-gray-800"> ', ' </h2> <form id="form" class="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto space-y-4"> <!-- Pr\xE9nom --> <div class="flex flex-col"> <label class="mb-1 font-medium text-gray-700">Pr\xE9nom</label> <input name="prenom" placeholder="Pr\xE9nom" required', ' class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"> </div> <!-- Nom --> <div class="flex flex-col"> <label class="mb-1 font-medium text-gray-700">Nom</label> <input name="nom" placeholder="Nom" required', ' class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"> </div> <!-- Email --> <div class="flex flex-col"> <label class="mb-1 font-medium text-gray-700">Adresse email</label> <input type="email" name="email" placeholder="Adresse email"', ' class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"> </div> <!-- Date de naissance --> <div class="flex flex-col"> <label class="mb-1 font-medium text-gray-700">Date de naissance</label> <input type="date" name="dateNaissance"', ' class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"> </div> <!-- Sexe --> <div class="flex flex-col"> <label class="mb-1 font-medium text-gray-700">Sexe</label> <select name="sexe" class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"> <option value="M"', '>Homme</option> <option value="F"', '>Femme</option> <option value="Autre"', '>Autre</option> </select> </div> <button type="submit" class="w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"> ', " </button> ", " </form> <script>(function(){", '\n    const form = document.getElementById("form");\n\n    form.addEventListener("submit", async (e) => {\n      e.preventDefault();\n      const data = Object.fromEntries(new FormData(form));\n\n      if (personId) {\n        // Mode \xE9dition \u2192 PATCH\n        await fetch(\\`/api/persons/\\${personId}\\`, {\n          method: "PATCH",\n          headers: { "Content-Type": "application/json" },\n          body: JSON.stringify(data),\n        });\n      } else {\n        // Mode cr\xE9ation \u2192 POST\n        await fetch("/api/persons", {\n          method: "POST",\n          headers: { "Content-Type": "application/json" },\n          body: JSON.stringify(data),\n        });\n      }\n\n      window.location.href = "/";\n    });\n  })();<\/script> '])), maybeRenderHead(), person ? `Modifier ${person.prenom} ${person.nom}` : "Ajouter une personne", addAttribute(person?.prenom ?? "", "value"), addAttribute(person?.nom ?? "", "value"), addAttribute(person?.email ?? "", "value"), addAttribute(person?.dateNaissance ?? "", "value"), addAttribute(person?.sexe === "M", "selected"), addAttribute(person?.sexe === "F", "selected"), addAttribute(person?.sexe === "Autre", "selected"), person ? "Enregistrer les modifications" : "Ajouter", person && renderTemplate`<a href="/" class="block text-center text-sm text-gray-500 hover:underline">
Annuler
</a>`, defineScriptVars({ personId: id })) })}`;
}, "C:/lacapsule-testsperso/genealogia-astro/src/pages/addperson.astro", void 0);

const $$file = "C:/lacapsule-testsperso/genealogia-astro/src/pages/addperson.astro";
const $$url = "/addperson";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Addperson,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

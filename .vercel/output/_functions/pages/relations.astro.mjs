import { e as createComponent, m as maybeRenderHead, g as addAttribute, n as renderScript, r as renderTemplate, h as createAstro, k as renderComponent } from '../chunks/astro/server_C_XB61DQ.mjs';
import 'piccolore';
import 'clsx';
import { $ as $$Baselayout } from '../chunks/Baselayout_s9RJkwsr.mjs';
import { r as relations, p as persons } from '../chunks/mongo_Dkx7giOQ.mjs';
import { ObjectId } from 'mongodb';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$DeleteButton = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DeleteButton;
  const { relationId } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<button class="delete-relation-btn px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"${addAttribute(relationId, "data-relation-id")}>
Supprimer
</button> ${renderScript($$result, "C:/lacapsule-testsperso/genealogia-astro/src/components/DeleteButton.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/lacapsule-testsperso/genealogia-astro/src/components/DeleteButton.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const prerender = false;
const $$Relations = createComponent(async ($$result, $$props, $$slots) => {
  const allRelations = await relations.find({}).toArray();
  const personIds = Array.from(
    new Set(allRelations.flatMap((r) => [r.from.toString(), r.to.toString()]))
  );
  const personsObjs = await persons.find({ _id: { $in: personIds.map((id) => new ObjectId(id)) } }).toArray();
  const personsMap = Object.fromEntries(
    personsObjs.map((p) => [p._id.toString(), p])
  );
  return renderTemplate`${renderComponent($$result, "Baselayout", $$Baselayout, { "title": "Toutes les relations" }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<h2 class="text-2xl font-bold mb-4">Toutes les relations</h2> <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden"> <thead class="bg-gray-100 border-b"> <tr> <th class="p-2 text-left">Type</th> <th class="p-2 text-left">De</th> <th class="p-2 text-left">Vers</th> <th class="p-2 text-left">Statut</th> <th class="p-2 text-left">Actions</th> </tr> </thead> <tbody> ', ' </tbody> </table> <script>\n        document.querySelectorAll(\'form[id^="form-"]\').forEach((form) => {\n            form.addEventListener("submit", async (e) => {\n                e.preventDefault();\n                const data = Object.fromEntries(new FormData(form));\n                const id = form.id.replace("form-", "");\n                await fetch(`/api/relations/${id}`, {\n                    method: "PATCH",\n                    headers: { "Content-Type": "application/json" },\n                    body: JSON.stringify(data),\n                });\n                location.reload();\n            });\n        });\n    <\/script> '], [" ", '<h2 class="text-2xl font-bold mb-4">Toutes les relations</h2> <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden"> <thead class="bg-gray-100 border-b"> <tr> <th class="p-2 text-left">Type</th> <th class="p-2 text-left">De</th> <th class="p-2 text-left">Vers</th> <th class="p-2 text-left">Statut</th> <th class="p-2 text-left">Actions</th> </tr> </thead> <tbody> ', ' </tbody> </table> <script>\n        document.querySelectorAll(\'form[id^="form-"]\').forEach((form) => {\n            form.addEventListener("submit", async (e) => {\n                e.preventDefault();\n                const data = Object.fromEntries(new FormData(form));\n                const id = form.id.replace("form-", "");\n                await fetch(\\`/api/relations/\\${id}\\`, {\n                    method: "PATCH",\n                    headers: { "Content-Type": "application/json" },\n                    body: JSON.stringify(data),\n                });\n                location.reload();\n            });\n        });\n    <\/script> '])), maybeRenderHead(), allRelations.map((r) => renderTemplate`<tr class="border-b hover:bg-gray-50"> <td class="p-2 border-1 p-1 bg-green-200">${r.type}</td> <td class="p-2"> ${personsMap[r.from.toString()]?.prenom.toUpperCase()}${" "} ${personsMap[r.from.toString()]?.nom} </td> <td class="p-2"> ${personsMap[r.to.toString()]?.prenom}${" "} ${personsMap[r.to.toString()]?.nom} </td> <td class="p-2">${r.status || "\u2014"}</td> <td class="p-2 flex flex-row gap-2"> <form${addAttribute(`form-${r._id}`, "id")} class="flex gap-2 items-center"> <select name="status" class="border rounded px-2 py-1"> <option value="ACTIVE"${addAttribute(r.status === "ACTIVE", "selected")}>
ACTIVE
</option> <option value="DIVORCED"${addAttribute(r.status === "DIVORCED", "selected")}>
DIVORCED
</option> </select> <button class="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
Modifier
</button> </form> ${renderComponent($$result2, "DeleteButton", $$DeleteButton, { "relationId": r._id })} </td> </tr>`)) })}`;
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

import { e as createComponent, k as renderComponent, n as renderScript, r as renderTemplate, m as maybeRenderHead, g as addAttribute } from '../chunks/astro/server_CVCXfxKo.mjs';
import 'piccolore';
import { $ as $$Baselayout } from '../chunks/Baselayout_CrTDqnb9.mjs';
import { p as persons, r as relations } from '../chunks/mongo_Dkx7giOQ.mjs';
export { renderers } from '../renderers.mjs';

const $$Addrelation = createComponent(async ($$result, $$props, $$slots) => {
  const persons$1 = await persons.find({ active: true }).toArray();
  const coupleRelations = await relations.find({ type: "CONJOINT" }).toArray();
  function isMajeur(dateNaissance) {
    if (!dateNaissance) return true;
    const birth = new Date(dateNaissance);
    const majority = new Date(birth);
    majority.setFullYear(majority.getFullYear() + 18);
    return majority <= /* @__PURE__ */ new Date();
  }
  const personsData = persons$1.map((p) => ({
    _id: p._id.toString(),
    prenom: p.prenom,
    nom: p.nom,
    sexe: p.sexe,
    dateNaissance: p.dateNaissance,
    majeur: isMajeur(p.dateNaissance)
  }));
  const majeurs = personsData.filter((p) => p.majeur);
  const coupleRelationsData = coupleRelations.map((r) => {
    const p1 = personsData.find((p) => p._id === r.from.toString());
    const p2 = personsData.find((p) => p._id === r.to.toString());
    return {
      _id: r._id.toString(),
      label: p1 && p2 ? `${p1.prenom} ${p1.nom} & ${p2.prenom} ${p2.nom}${r.status === "DIVORCED" ? " (divorc\xE9s)" : ""}` : r._id.toString()
    };
  });
  return renderTemplate`---
${renderComponent($$result, "Baselayout", $$Baselayout, { "title": "Ajouter une relation" }, { "default": async ($$result2) => renderTemplate`${maybeRenderHead()}<h2 class="text-2xl font-bold mb-6">Ajouter une relation</h2><form id="relationForm" class="bg-white shadow-md p-6 rounded-md max-w-lg space-y-5"><!-- Type --><div class="flex flex-col"><label class="mb-1 font-medium text-gray-700">Type de relation</label><select name="type" id="type" class="border border-gray-300 rounded-md px-3 py-2"><option value="PARENT">👨‍👧 Déclarer un enfant</option><option value="CONJOINT">💍 Déclarer un(e) conjoint(e)</option></select></div><!-- ========== BLOC PARENT ========== --><div id="parentFields" class="space-y-4"><!-- Enfant --><div class="flex flex-col"><label class="mb-1 font-medium text-gray-700">Enfant</label><select name="child" id="child" class="capitalize border border-gray-300 rounded-md px-3 py-2">${personsData.map((p) => renderTemplate`<option${addAttribute(p._id, "value")}>${p.prenom}&nbsp;${p.nom}</option>`)}</select></div><div class="border-t pt-4 space-y-4"><p class="text-sm text-gray-500 font-medium uppercase tracking-wide">Parents de cet enfant</p><!-- Parent 1 --><div class="flex flex-col"><label class="mb-1 font-medium text-gray-700">Parent 1</label><select name="parent1" id="parent1" class="capitalize border border-gray-300 rounded-md px-3 py-2"><option value="">— Non renseigné —</option>${personsData.map((p) => renderTemplate`<option${addAttribute(p._id, "value")}>${p.prenom}&nbsp;${p.nom}</option>`)}</select></div><!-- Parent 2 --><div class="flex flex-col"><label class="mb-1 font-medium text-gray-700">Parent 2</label><select name="parent2" id="parent2" class="capitalize border border-gray-300 rounded-md px-3 py-2"><option value="">— Non renseigné —</option>${personsData.map((p) => renderTemplate`<option${addAttribute(p._id, "value")}>${p.prenom}&nbsp;${p.nom}</option>`)}</select></div><!-- Lier à un couple existant --><div class="flex flex-col"><label class="mb-1 font-medium text-gray-700">
Issu de l'union <span class="text-gray-400 font-normal">(optionnel)</span></label><select name="coupleRelationId" id="coupleRelationId" class="capitalize border border-gray-300 rounded-md px-3 py-2"><option value="">— Non précisé —</option>${coupleRelationsData.map((r) => renderTemplate`<option${addAttribute(r._id, "value")}>${r.label}</option>`)}</select><p class="text-xs text-gray-400 mt-1">
Si le couple est déjà enregistré, sélectionne-le pour lier automatiquement les enfants.
</p></div></div></div><!-- ========== BLOC CONJOINT ========== --><div id="conjointFields" class="hidden space-y-4"><div class="flex flex-col"><label class="mb-1 font-medium text-gray-700">Conjoint(e) A</label><select name="from" id="from" class="capitalize border border-gray-300 rounded-md px-3 py-2">${majeurs.map((p) => renderTemplate`<option${addAttribute(p._id, "value")}>${p.prenom}&nbsp;${p.nom}</option>`)}</select></div><div class="flex flex-col"><label class="mb-1 font-medium text-gray-700">Conjoint(e) B</label><select name="to" id="to" class="capitalize border border-gray-300 rounded-md px-3 py-2">${majeurs.map((p) => renderTemplate`<option${addAttribute(p._id, "value")}>${p.prenom}&nbsp;${p.nom}</option>`)}</select></div><div class="border-t pt-4 space-y-4"><p class="text-sm text-gray-500 font-medium uppercase tracking-wide">Options union</p><div class="flex flex-col"><label class="mb-1 font-medium text-gray-700">Statut</label><select name="status" id="status" class="border border-gray-300 rounded-md px-3 py-2"><option value="ACTIVE">✅ En couple</option><option value="DIVORCED">❌ Divorcé(e) / Séparé(e)</option></select></div><div class="grid grid-cols-2 gap-4"><div class="flex flex-col"><label class="mb-1 font-medium text-gray-700">Date de début</label><input type="date" name="dateDebut" id="dateDebut" class="border border-gray-300 rounded-md px-3 py-2"></div><div class="flex flex-col"><label class="mb-1 font-medium text-gray-700">Date de fin</label><input type="date" name="dateFin" id="dateFin" class="border border-gray-300 rounded-md px-3 py-2"></div></div></div></div><button type="submit" class="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition-colors w-full">
Créer
</button></form>` })}${renderScript($$result, "C:/lacapsule-testsperso/genealogia-astro/src/pages/addrelation.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/lacapsule-testsperso/genealogia-astro/src/pages/addrelation.astro", void 0);

const $$file = "C:/lacapsule-testsperso/genealogia-astro/src/pages/addrelation.astro";
const $$url = "/addrelation";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Addrelation,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

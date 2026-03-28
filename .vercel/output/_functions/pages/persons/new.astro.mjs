import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, n as defineScriptVars, g as addAttribute, m as maybeRenderHead } from '../../chunks/astro/server_DzJdx5CC.mjs';
import 'piccolore';
import { $ as $$Baselayout } from '../../chunks/Baselayout_DbP0pFxM.mjs';
import { v as verifyToken } from '../../chunks/auth_C0Ch4QAz.mjs';
import { db, persons } from '../../chunks/mongo_DDLBCJZd.mjs';
import { ObjectId } from 'mongodb';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const prerender = false;
const $$New = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$New;
  const token = Astro2.cookies.get("token")?.value;
  if (!token) return Astro2.redirect("/login");
  let user = null;
  try {
    const payload = verifyToken(token);
    user = await db.collection("users").findOne({ _id: new ObjectId(payload.userId) });
  } catch {
    return Astro2.redirect("/login");
  }
  const id = Astro2.url.searchParams.get("id");
  const returnUrl = Astro2.url.searchParams.get("returnUrl") || "/persons";
  let person = null;
  if (id) {
    person = await persons.findOne({ _id: new ObjectId(id) });
  }
  const isEdit = !!person;
  let spouseEntries = [];
  let orphanChildren = [];
  if (isEdit && person) {
    const { relations } = await import('../../chunks/mongo_DDLBCJZd.mjs');
    const allSpouseRels = await relations.find({
      type: "CONJOINT",
      $or: [{ from: person._id }, { to: person._id }]
    }).toArray();
    const myChildRels = await relations.find({
      type: "PARENT",
      from: person._id
    }).toArray();
    for (const rel of allSpouseRels) {
      const fromId = typeof rel.from === "string" ? new ObjectId(rel.from) : rel.from;
      const toId = typeof rel.to === "string" ? new ObjectId(rel.to) : rel.to;
      const spouseId = fromId.equals(person._id) ? toId : fromId;
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
        spousePerson,
        status: rel.status ?? "ACTIVE",
        children
      });
    }
    const orphanChildRels = myChildRels.filter((r) => !r.coupleRelationId);
    orphanChildren = orphanChildRels.length > 0 ? await persons.find({
      _id: { $in: orphanChildRels.map(
        (r) => typeof r.to === "string" ? new ObjectId(r.to) : r.to
      ) }
    }).toArray() : [];
  }
  return renderTemplate`${renderComponent($$result, "Baselayout", $$Baselayout, { "title": isEdit ? "Modifier une personne" : "Ajouter une personne" }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<div class="max-w-4xl mx-auto px-6 py-8"> <!-- En-t\xEAte --> <div class="flex items-center justify-between mb-6"> <div> <h1 class="text-2xl font-semibold text-stone-800 tracking-tight"> ', ' </h1> <p class="text-sm text-stone-500 mt-0.5"> ', " </p> </div> <a", ' class="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 transition-colors"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path> </svg>\nRetour\n</a> </div> <div class="grid lg:grid-cols-3 gap-6"> <!-- Formulaire (2/3) --> <div class="lg:col-span-2"> <form id="form" class="bg-white border border-stone-200 rounded-xl p-6 space-y-5"> <h2 class="text-xs font-semibold text-stone-500 uppercase tracking-wider">\nInformations personnelles\n</h2> <!-- Pr\xE9nom + Nom --> <div class="grid grid-cols-2 gap-3"> <div> <label class="block text-xs text-stone-500 mb-1">Pr\xE9nom <span class="text-red-400">*</span></label> <input type="text" name="prenom" required placeholder="Jean"', ' class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"> </div> <div> <label class="block text-xs text-stone-500 mb-1">Nom <span class="text-red-400">*</span></label> <input type="text" name="nom" required placeholder="Dupont"', ' class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"> </div> </div> <!-- Email --> <div> <label class="block text-xs text-stone-500 mb-1">Email</label> <input type="email" name="email" placeholder="jean@exemple.com"', ' class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"> </div> <!-- Naissance + D\xE9c\xE8s --> <div class="grid grid-cols-2 gap-3"> <div> <label class="block text-xs text-stone-500 mb-1">Date de naissance</label> <input type="date" name="dateNaissance"', ' class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"> </div> <div> <label class="block text-xs text-stone-500 mb-1">Date de d\xE9c\xE8s</label> <input type="date" name="dateDeces"', ' class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"> </div> </div> <!-- Sexe --> <div> <label class="block text-xs text-stone-500 mb-1">Sexe</label> <select name="sexe" class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"> <option value="">\u2014 Non renseign\xE9 \u2014</option> <option value="M"', '>Homme</option> <option value="F"', '>Femme</option> <option value="Autre"', '>Autre</option> </select> </div> <!-- Notes --> <div> <label class="block text-xs text-stone-500 mb-1">Notes</label> <textarea name="notes" rows="3" placeholder="Informations compl\xE9mentaires\u2026" class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition resize-none">', '</textarea> </div> <!-- Erreur --> <p id="errorMsg" class="hidden text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"></p> <!-- Actions --> <div class="flex items-center gap-3 pt-1"> <button type="submit" id="submitBtn" class="flex-1 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"> ', " </button> <a", ' class="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-medium rounded-lg transition-colors">\nAnnuler\n</a> </div> </form> </div> <!-- Colonne droite --> <div class="space-y-4"> <!-- Aper\xE7u --> <div class="bg-white border border-stone-200 rounded-xl p-5 sticky top-20 space-y-4"> <h2 class="text-xs font-semibold text-stone-500 uppercase tracking-wider">Aper\xE7u</h2> <div class="flex items-center gap-3"> <div id="previewAvatar" class="w-12 h-12 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0"> <svg class="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path> </svg> </div> <div> <p id="previewName" class="text-sm font-medium text-stone-400 italic">Pr\xE9nom Nom</p> <p id="previewMeta" class="text-xs text-stone-400 mt-0.5"></p> </div> </div> <div class="h-px bg-stone-100"></div> <div class="space-y-2 text-xs text-stone-500"> <div class="flex justify-between"> <span>Email</span> <span id="previewEmail" class="text-stone-800 font-medium">\u2014</span> </div> <div class="flex justify-between"> <span>Naissance</span> <span id="previewDob" class="text-stone-800 font-medium">\u2014</span> </div> <div class="flex justify-between"> <span>D\xE9c\xE8s</span> <span id="previewDod" class="text-stone-800 font-medium">\u2014</span> </div> <div class="flex justify-between"> <span>Sexe</span> <span id="previewSexe" class="text-stone-800 font-medium">\u2014</span> </div> </div> </div> <!-- Relations (mode \xE9dition uniquement) --> ', " </div> </div> </div> <script>(function(){", `
    const form       = document.getElementById("form");
    const submitBtn  = document.getElementById("submitBtn");
    const errorMsg   = document.getElementById("errorMsg");

    // \u2500\u2500 Aper\xE7u live \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    const previewAvatar = document.getElementById("previewAvatar");
    const previewName   = document.getElementById("previewName");
    const previewMeta   = document.getElementById("previewMeta");
    const previewEmail  = document.getElementById("previewEmail");
    const previewDob    = document.getElementById("previewDob");
    const previewDod    = document.getElementById("previewDod");
    const previewSexe   = document.getElementById("previewSexe");

    function updatePreview() {
      const prenom = form.prenom.value.trim();
      const nom    = form.nom.value.trim();
      const sexe   = form.sexe.value;
      const dob    = form.dateNaissance.value;
      const dod    = form.dateDeces.value;
      const email  = form.email.value.trim();

      if (prenom || nom) {
        previewName.textContent = \`\${prenom || '\u2026'} \${nom || '\u2026'}\`;
        previewName.className   = "text-sm font-medium text-stone-800";
        previewAvatar.innerHTML = \`<span class="text-sm font-semibold text-amber-700">\${(prenom.charAt(0) || '?').toUpperCase()}\${(nom.charAt(0) || '').toUpperCase()}</span>\`;
        previewAvatar.className = "w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0";
      } else {
        previewName.textContent = "Pr\xE9nom Nom";
        previewName.className   = "text-sm font-medium text-stone-400 italic";
        previewAvatar.innerHTML = \`<svg class="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>\`;
        previewAvatar.className = "w-12 h-12 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0";
      }

      const sexeLabel = sexe === 'M' ? 'Homme' : sexe === 'F' ? 'Femme' : sexe === 'Autre' ? 'Autre' : '\u2014';
      previewMeta.textContent = [sexeLabel !== '\u2014' ? sexeLabel : '', dob ? \`\xB0 \${dob}\` : ''].filter(Boolean).join(' \xB7 ') || '';

      previewEmail.textContent = email || '\u2014';
      previewDob.textContent   = dob   || '\u2014';
      previewDod.textContent   = dod   || '\u2014';
      previewSexe.textContent  = sexeLabel;
    }

    ['prenom','nom','email','dateNaissance','dateDeces','sexe'].forEach(name => {
      form[name]?.addEventListener('input',  updatePreview);
      form[name]?.addEventListener('change', updatePreview);
    });

    updatePreview();

    // \u2500\u2500 Soumission \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));

      submitBtn.disabled    = true;
      submitBtn.textContent = personId ? "Enregistrement\u2026" : "Cr\xE9ation en cours\u2026";
      errorMsg.classList.add("hidden");

      const res = personId
        ? await fetch(\`/api/persons/\${personId}\`, {
            method:  "PATCH",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(data),
          })
        : await fetch("/api/persons", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(data),
          });

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: null }));
        errorMsg.textContent = error ?? "Une erreur est survenue.";
        errorMsg.classList.remove("hidden");
        submitBtn.disabled    = false;
        submitBtn.textContent = personId ? "Enregistrer les modifications" : "Cr\xE9er la personne";
        return;
      }

      window.location.href = returnUrl;
    });
  })();<\/script> `], [" ", '<div class="max-w-4xl mx-auto px-6 py-8"> <!-- En-t\xEAte --> <div class="flex items-center justify-between mb-6"> <div> <h1 class="text-2xl font-semibold text-stone-800 tracking-tight"> ', ' </h1> <p class="text-sm text-stone-500 mt-0.5"> ', " </p> </div> <a", ' class="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 transition-colors"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path> </svg>\nRetour\n</a> </div> <div class="grid lg:grid-cols-3 gap-6"> <!-- Formulaire (2/3) --> <div class="lg:col-span-2"> <form id="form" class="bg-white border border-stone-200 rounded-xl p-6 space-y-5"> <h2 class="text-xs font-semibold text-stone-500 uppercase tracking-wider">\nInformations personnelles\n</h2> <!-- Pr\xE9nom + Nom --> <div class="grid grid-cols-2 gap-3"> <div> <label class="block text-xs text-stone-500 mb-1">Pr\xE9nom <span class="text-red-400">*</span></label> <input type="text" name="prenom" required placeholder="Jean"', ' class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"> </div> <div> <label class="block text-xs text-stone-500 mb-1">Nom <span class="text-red-400">*</span></label> <input type="text" name="nom" required placeholder="Dupont"', ' class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"> </div> </div> <!-- Email --> <div> <label class="block text-xs text-stone-500 mb-1">Email</label> <input type="email" name="email" placeholder="jean@exemple.com"', ' class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"> </div> <!-- Naissance + D\xE9c\xE8s --> <div class="grid grid-cols-2 gap-3"> <div> <label class="block text-xs text-stone-500 mb-1">Date de naissance</label> <input type="date" name="dateNaissance"', ' class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"> </div> <div> <label class="block text-xs text-stone-500 mb-1">Date de d\xE9c\xE8s</label> <input type="date" name="dateDeces"', ' class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"> </div> </div> <!-- Sexe --> <div> <label class="block text-xs text-stone-500 mb-1">Sexe</label> <select name="sexe" class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"> <option value="">\u2014 Non renseign\xE9 \u2014</option> <option value="M"', '>Homme</option> <option value="F"', '>Femme</option> <option value="Autre"', '>Autre</option> </select> </div> <!-- Notes --> <div> <label class="block text-xs text-stone-500 mb-1">Notes</label> <textarea name="notes" rows="3" placeholder="Informations compl\xE9mentaires\u2026" class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition resize-none">', '</textarea> </div> <!-- Erreur --> <p id="errorMsg" class="hidden text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"></p> <!-- Actions --> <div class="flex items-center gap-3 pt-1"> <button type="submit" id="submitBtn" class="flex-1 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"> ', " </button> <a", ' class="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-medium rounded-lg transition-colors">\nAnnuler\n</a> </div> </form> </div> <!-- Colonne droite --> <div class="space-y-4"> <!-- Aper\xE7u --> <div class="bg-white border border-stone-200 rounded-xl p-5 sticky top-20 space-y-4"> <h2 class="text-xs font-semibold text-stone-500 uppercase tracking-wider">Aper\xE7u</h2> <div class="flex items-center gap-3"> <div id="previewAvatar" class="w-12 h-12 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0"> <svg class="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path> </svg> </div> <div> <p id="previewName" class="text-sm font-medium text-stone-400 italic">Pr\xE9nom Nom</p> <p id="previewMeta" class="text-xs text-stone-400 mt-0.5"></p> </div> </div> <div class="h-px bg-stone-100"></div> <div class="space-y-2 text-xs text-stone-500"> <div class="flex justify-between"> <span>Email</span> <span id="previewEmail" class="text-stone-800 font-medium">\u2014</span> </div> <div class="flex justify-between"> <span>Naissance</span> <span id="previewDob" class="text-stone-800 font-medium">\u2014</span> </div> <div class="flex justify-between"> <span>D\xE9c\xE8s</span> <span id="previewDod" class="text-stone-800 font-medium">\u2014</span> </div> <div class="flex justify-between"> <span>Sexe</span> <span id="previewSexe" class="text-stone-800 font-medium">\u2014</span> </div> </div> </div> <!-- Relations (mode \xE9dition uniquement) --> ', " </div> </div> </div> <script>(function(){", `
    const form       = document.getElementById("form");
    const submitBtn  = document.getElementById("submitBtn");
    const errorMsg   = document.getElementById("errorMsg");

    // \u2500\u2500 Aper\xE7u live \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    const previewAvatar = document.getElementById("previewAvatar");
    const previewName   = document.getElementById("previewName");
    const previewMeta   = document.getElementById("previewMeta");
    const previewEmail  = document.getElementById("previewEmail");
    const previewDob    = document.getElementById("previewDob");
    const previewDod    = document.getElementById("previewDod");
    const previewSexe   = document.getElementById("previewSexe");

    function updatePreview() {
      const prenom = form.prenom.value.trim();
      const nom    = form.nom.value.trim();
      const sexe   = form.sexe.value;
      const dob    = form.dateNaissance.value;
      const dod    = form.dateDeces.value;
      const email  = form.email.value.trim();

      if (prenom || nom) {
        previewName.textContent = \\\`\\\${prenom || '\u2026'} \\\${nom || '\u2026'}\\\`;
        previewName.className   = "text-sm font-medium text-stone-800";
        previewAvatar.innerHTML = \\\`<span class="text-sm font-semibold text-amber-700">\\\${(prenom.charAt(0) || '?').toUpperCase()}\\\${(nom.charAt(0) || '').toUpperCase()}</span>\\\`;
        previewAvatar.className = "w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0";
      } else {
        previewName.textContent = "Pr\xE9nom Nom";
        previewName.className   = "text-sm font-medium text-stone-400 italic";
        previewAvatar.innerHTML = \\\`<svg class="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>\\\`;
        previewAvatar.className = "w-12 h-12 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0";
      }

      const sexeLabel = sexe === 'M' ? 'Homme' : sexe === 'F' ? 'Femme' : sexe === 'Autre' ? 'Autre' : '\u2014';
      previewMeta.textContent = [sexeLabel !== '\u2014' ? sexeLabel : '', dob ? \\\`\xB0 \\\${dob}\\\` : ''].filter(Boolean).join(' \xB7 ') || '';

      previewEmail.textContent = email || '\u2014';
      previewDob.textContent   = dob   || '\u2014';
      previewDod.textContent   = dod   || '\u2014';
      previewSexe.textContent  = sexeLabel;
    }

    ['prenom','nom','email','dateNaissance','dateDeces','sexe'].forEach(name => {
      form[name]?.addEventListener('input',  updatePreview);
      form[name]?.addEventListener('change', updatePreview);
    });

    updatePreview();

    // \u2500\u2500 Soumission \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));

      submitBtn.disabled    = true;
      submitBtn.textContent = personId ? "Enregistrement\u2026" : "Cr\xE9ation en cours\u2026";
      errorMsg.classList.add("hidden");

      const res = personId
        ? await fetch(\\\`/api/persons/\\\${personId}\\\`, {
            method:  "PATCH",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(data),
          })
        : await fetch("/api/persons", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(data),
          });

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: null }));
        errorMsg.textContent = error ?? "Une erreur est survenue.";
        errorMsg.classList.remove("hidden");
        submitBtn.disabled    = false;
        submitBtn.textContent = personId ? "Enregistrer les modifications" : "Cr\xE9er la personne";
        return;
      }

      window.location.href = returnUrl;
    });
  })();<\/script> `])), maybeRenderHead(), isEdit ? `Modifier ${person?.prenom} ${person?.nom}` : "Nouvelle personne", isEdit ? "Mettez \xE0 jour les informations" : "Renseignez les informations de la personne", addAttribute(returnUrl, "href"), addAttribute(person?.prenom ?? "", "value"), addAttribute(person?.nom ?? "", "value"), addAttribute(person?.email ?? "", "value"), addAttribute(person?.dateNaissance ?? "", "value"), addAttribute(person?.dateDeces ?? "", "value"), addAttribute(person?.sexe === "M", "selected"), addAttribute(person?.sexe === "F", "selected"), addAttribute(person?.sexe === "Autre", "selected"), person?.notes ?? "", isEdit ? "Enregistrer les modifications" : "Cr\xE9er la personne", addAttribute(returnUrl, "href"), isEdit && (spouseEntries.length > 0 || orphanChildren.length > 0) && renderTemplate`<div class="bg-white border border-stone-200 rounded-xl p-5 space-y-4"> <h2 class="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-2"> <svg class="w-3.5 h-3.5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path> </svg>
Relations
</h2> <!-- Conjoints & leurs enfants --> ${spouseEntries.length > 0 && renderTemplate`<div class="space-y-3"> ${spouseEntries.map((entry) => renderTemplate`<div${addAttribute(`rounded-lg p-3 border text-xs ${entry.status === "ACTIVE" ? "border-green-200 bg-green-50" : "border-stone-200 bg-stone-50"}`, "class")}> <!-- Badge + nom conjoint --> <div class="flex items-center gap-2 mb-2"> <span${addAttribute(`font-medium px-1.5 py-0.5 rounded-full ${entry.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-stone-200 text-stone-500"}`, "class")}> ${entry.status === "ACTIVE" ? "Conjoint(e)" : "Ex"} </span> ${entry.spousePerson ? renderTemplate`<a${addAttribute(`/persons/${entry.spousePerson._id}`, "href")} class="font-medium text-stone-800 hover:text-amber-700 transition-colors truncate"> ${entry.spousePerson.prenom} ${entry.spousePerson.nom} </a>` : renderTemplate`<span class="text-stone-400 italic">Personne supprimée</span>`} </div> <!-- Enfants du couple --> ${entry.children.length > 0 ? renderTemplate`<ul class="space-y-1 pl-1"><span class="font-bold">Enfants</span> ${entry.children.map((c) => renderTemplate`<li class="flex items-center gap-1.5 text-stone-600"> <span class="text-stone-300 text-xs">↳</span> <a${addAttribute(`/persons/${c._id}`, "href")} class="hover:text-amber-700 transition-colors truncate"> ${c.prenom} ${c.nom} </a> </li>`)} </ul>` : renderTemplate`<p class="text-stone-400 italic pl-1">Aucun enfant commun</p>`} </div>`)} </div>`} <!-- Enfants sans couple --> ${orphanChildren.length > 0 && renderTemplate`<div> <p class="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">
Enfants sans relation · ${orphanChildren.length} </p> <ul class="space-y-1.5"> ${orphanChildren.map((c) => renderTemplate`<li> <a${addAttribute(`/persons/${c._id}`, "href")} class="flex items-center gap-2 group"> <div class="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center shrink-0 text-xs font-medium text-stone-600 group-hover:bg-amber-50 group-hover:text-amber-700 transition-colors"> ${c.prenom.charAt(0)}${c.nom.charAt(0)} </div> <span class="text-xs text-stone-700 group-hover:text-amber-700 transition-colors"> ${c.prenom} ${c.nom} </span> </a> </li>`)} </ul> </div>`} </div>`, defineScriptVars({ personId: id, returnUrl })) })}`;
}, "C:/lacapsule-testsperso/genealogia-astro/src/pages/persons/new.astro", void 0);

const $$file = "C:/lacapsule-testsperso/genealogia-astro/src/pages/persons/new.astro";
const $$url = "/persons/new";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$New,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

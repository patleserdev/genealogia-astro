import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, n as defineScriptVars, g as addAttribute, m as maybeRenderHead } from '../../chunks/astro/server_Cr2bBY3R.mjs';
import 'piccolore';
import { $ as $$Baselayout } from '../../chunks/Baselayout_BtxBugC6.mjs';
import { v as verifyToken } from '../../chunks/auth_C0Ch4QAz.mjs';
import { d as db, p as persons } from '../../chunks/mongo_pJhMhjwv.mjs';
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
  return renderTemplate`${renderComponent($$result, "Baselayout", $$Baselayout, { "title": isEdit ? "Modifier une personne" : "Ajouter une personne" }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<div class="max-w-4xl mx-auto px-6 py-8"> <!-- En-t\xEAte --> <div class="flex items-center justify-between mb-6"> <div> <h1 class="text-2xl font-semibold text-stone-800 tracking-tight"> ', ' </h1> <p class="text-sm text-stone-500 mt-0.5"> ', " </p> </div> <a", ' class="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 transition-colors"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path> </svg>\nRetour\n</a> </div> <div class="grid lg:grid-cols-3 gap-6"> <!-- Formulaire (2/3) --> <div class="lg:col-span-2"> <form id="form" class="bg-white border border-stone-200 rounded-xl p-6 space-y-5"> <h2 class="text-xs font-semibold text-stone-500 uppercase tracking-wider">\nInformations personnelles\n</h2> <!-- Pr\xE9nom + Nom --> <div class="grid grid-cols-2 gap-3"> <div> <label class="block text-xs text-stone-500 mb-1">Pr\xE9nom <span class="text-red-400">*</span></label> <input type="text" name="prenom" required placeholder="Jean"', ' class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"> </div> <div> <label class="block text-xs text-stone-500 mb-1">Nom <span class="text-red-400">*</span></label> <input type="text" name="nom" required placeholder="Dupont"', ' class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"> </div> </div> <!-- Email --> <div> <label class="block text-xs text-stone-500 mb-1">Email</label> <input type="email" name="email" placeholder="jean@exemple.com"', ' class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"> </div> <!-- Naissance + D\xE9c\xE8s --> <div class="grid grid-cols-2 gap-3"> <div> <label class="block text-xs text-stone-500 mb-1">Date de naissance</label> <input type="date" name="dateNaissance"', ' class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"> </div> <div> <label class="block text-xs text-stone-500 mb-1">Date de d\xE9c\xE8s</label> <input type="date" name="dateDeces"', ' class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"> </div> </div> <!-- Sexe --> <div> <label class="block text-xs text-stone-500 mb-1">Sexe</label> <select name="sexe" class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"> <option value="">\u2014 Non renseign\xE9 \u2014</option> <option value="M"', '>Homme</option> <option value="F"', '>Femme</option> <option value="Autre"', '>Autre</option> </select> </div> <!-- Notes --> <div> <label class="block text-xs text-stone-500 mb-1">Notes</label> <textarea name="notes" rows="3" placeholder="Informations compl\xE9mentaires\u2026" class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition resize-none">', '</textarea> </div> <!-- Erreur --> <p id="errorMsg" class="hidden text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"></p> <!-- Actions --> <div class="flex items-center gap-3 pt-1"> <button type="submit" id="submitBtn" class="flex-1 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"> ', " </button> <a", ' class="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-medium rounded-lg transition-colors">\nAnnuler\n</a> </div> </form> </div> <!-- Aper\xE7u (1/3) --> <div> <div class="bg-white border border-stone-200 rounded-xl p-5 sticky top-20 space-y-4"> <h2 class="text-xs font-semibold text-stone-500 uppercase tracking-wider">Aper\xE7u</h2> <div class="flex items-center gap-3"> <div id="previewAvatar" class="w-12 h-12 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0"> <svg class="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path> </svg> </div> <div> <p id="previewName" class="text-sm font-medium text-stone-400 italic">Pr\xE9nom Nom</p> <p id="previewMeta" class="text-xs text-stone-400 mt-0.5"></p> </div> </div> <div class="h-px bg-stone-100"></div> <div class="space-y-2 text-xs text-stone-500"> <div class="flex justify-between"> <span>Email</span> <span id="previewEmail" class="text-stone-800 font-medium">\u2014</span> </div> <div class="flex justify-between"> <span>Naissance</span> <span id="previewDob" class="text-stone-800 font-medium">\u2014</span> </div> <div class="flex justify-between"> <span>D\xE9c\xE8s</span> <span id="previewDod" class="text-stone-800 font-medium">\u2014</span> </div> <div class="flex justify-between"> <span>Sexe</span> <span id="previewSexe" class="text-stone-800 font-medium">\u2014</span> </div> </div> </div> </div> </div> </div> <script>(function(){', `
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
  })();<\/script> `], [" ", '<div class="max-w-4xl mx-auto px-6 py-8"> <!-- En-t\xEAte --> <div class="flex items-center justify-between mb-6"> <div> <h1 class="text-2xl font-semibold text-stone-800 tracking-tight"> ', ' </h1> <p class="text-sm text-stone-500 mt-0.5"> ', " </p> </div> <a", ' class="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 transition-colors"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path> </svg>\nRetour\n</a> </div> <div class="grid lg:grid-cols-3 gap-6"> <!-- Formulaire (2/3) --> <div class="lg:col-span-2"> <form id="form" class="bg-white border border-stone-200 rounded-xl p-6 space-y-5"> <h2 class="text-xs font-semibold text-stone-500 uppercase tracking-wider">\nInformations personnelles\n</h2> <!-- Pr\xE9nom + Nom --> <div class="grid grid-cols-2 gap-3"> <div> <label class="block text-xs text-stone-500 mb-1">Pr\xE9nom <span class="text-red-400">*</span></label> <input type="text" name="prenom" required placeholder="Jean"', ' class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"> </div> <div> <label class="block text-xs text-stone-500 mb-1">Nom <span class="text-red-400">*</span></label> <input type="text" name="nom" required placeholder="Dupont"', ' class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"> </div> </div> <!-- Email --> <div> <label class="block text-xs text-stone-500 mb-1">Email</label> <input type="email" name="email" placeholder="jean@exemple.com"', ' class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"> </div> <!-- Naissance + D\xE9c\xE8s --> <div class="grid grid-cols-2 gap-3"> <div> <label class="block text-xs text-stone-500 mb-1">Date de naissance</label> <input type="date" name="dateNaissance"', ' class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"> </div> <div> <label class="block text-xs text-stone-500 mb-1">Date de d\xE9c\xE8s</label> <input type="date" name="dateDeces"', ' class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"> </div> </div> <!-- Sexe --> <div> <label class="block text-xs text-stone-500 mb-1">Sexe</label> <select name="sexe" class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"> <option value="">\u2014 Non renseign\xE9 \u2014</option> <option value="M"', '>Homme</option> <option value="F"', '>Femme</option> <option value="Autre"', '>Autre</option> </select> </div> <!-- Notes --> <div> <label class="block text-xs text-stone-500 mb-1">Notes</label> <textarea name="notes" rows="3" placeholder="Informations compl\xE9mentaires\u2026" class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition resize-none">', '</textarea> </div> <!-- Erreur --> <p id="errorMsg" class="hidden text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"></p> <!-- Actions --> <div class="flex items-center gap-3 pt-1"> <button type="submit" id="submitBtn" class="flex-1 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"> ', " </button> <a", ' class="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-medium rounded-lg transition-colors">\nAnnuler\n</a> </div> </form> </div> <!-- Aper\xE7u (1/3) --> <div> <div class="bg-white border border-stone-200 rounded-xl p-5 sticky top-20 space-y-4"> <h2 class="text-xs font-semibold text-stone-500 uppercase tracking-wider">Aper\xE7u</h2> <div class="flex items-center gap-3"> <div id="previewAvatar" class="w-12 h-12 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0"> <svg class="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path> </svg> </div> <div> <p id="previewName" class="text-sm font-medium text-stone-400 italic">Pr\xE9nom Nom</p> <p id="previewMeta" class="text-xs text-stone-400 mt-0.5"></p> </div> </div> <div class="h-px bg-stone-100"></div> <div class="space-y-2 text-xs text-stone-500"> <div class="flex justify-between"> <span>Email</span> <span id="previewEmail" class="text-stone-800 font-medium">\u2014</span> </div> <div class="flex justify-between"> <span>Naissance</span> <span id="previewDob" class="text-stone-800 font-medium">\u2014</span> </div> <div class="flex justify-between"> <span>D\xE9c\xE8s</span> <span id="previewDod" class="text-stone-800 font-medium">\u2014</span> </div> <div class="flex justify-between"> <span>Sexe</span> <span id="previewSexe" class="text-stone-800 font-medium">\u2014</span> </div> </div> </div> </div> </div> </div> <script>(function(){', `
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
  })();<\/script> `])), maybeRenderHead(), isEdit ? `Modifier ${person?.prenom} ${person?.nom}` : "Nouvelle personne", isEdit ? "Mettez \xE0 jour les informations" : "Renseignez les informations de la personne", addAttribute(returnUrl, "href"), addAttribute(person?.prenom ?? "", "value"), addAttribute(person?.nom ?? "", "value"), addAttribute(person?.email ?? "", "value"), addAttribute(person?.dateNaissance ?? "", "value"), addAttribute(person?.dateDeces ?? "", "value"), addAttribute(person?.sexe === "M", "selected"), addAttribute(person?.sexe === "F", "selected"), addAttribute(person?.sexe === "Autre", "selected"), person?.notes ?? "", isEdit ? "Enregistrer les modifications" : "Cr\xE9er la personne", addAttribute(returnUrl, "href"), defineScriptVars({ personId: id, returnUrl })) })}`;
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

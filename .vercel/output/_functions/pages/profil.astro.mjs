import { e as createComponent, r as renderTemplate, n as defineScriptVars, k as renderComponent, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../chunks/astro/server_DzJdx5CC.mjs';
import 'piccolore';
import { $ as $$Baselayout } from '../chunks/Baselayout_DbP0pFxM.mjs';
import { ObjectId } from 'mongodb';
import { db } from '../chunks/mongo_DDLBCJZd.mjs';
import { v as verifyToken } from '../chunks/auth_C0Ch4QAz.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Profil = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Profil;
  const token = Astro2.cookies.get("token")?.value;
  if (!token) return Astro2.redirect("/login");
  let person = null;
  let user = null;
  try {
    const payload = verifyToken(token);
    user = await db.collection("users").findOne({ _id: new ObjectId(payload.userId) });
    person = user?.personId ? await db.collection("persons").findOne({ _id: user.personId }) : null;
  } catch {
    return Astro2.redirect("/login");
  }
  return renderTemplate(_a || (_a = __template(["", " <script>(function(){", `
  const editBtn   = document.getElementById('editBtn')
  const cancelBtn = document.getElementById('cancelBtn')
  const viewMode  = document.getElementById('viewMode')
  const editForm  = document.getElementById('editForm')

  editBtn.addEventListener('click', () => {
    viewMode.classList.add('hidden')
    editForm.classList.remove('hidden')
    editBtn.classList.add('hidden')
  })

  cancelBtn.addEventListener('click', () => {
    viewMode.classList.remove('hidden')
    editForm.classList.add('hidden')
    editBtn.classList.remove('hidden')
  })

  editForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const saveBtn = document.getElementById('saveBtn')
    const saveMsg = document.getElementById('saveMsg')
    const data    = Object.fromEntries(new FormData(editForm))

    saveBtn.disabled    = true
    saveBtn.textContent = 'Enregistrement\u2026'
    saveMsg.classList.add('hidden')

    const res = await fetch('/api/me/update', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    })

    if (res.ok) {
      saveMsg.textContent = '\u2713 Sauvegard\xE9'
      saveMsg.className   = 'text-xs text-green-600 ml-auto'
      saveMsg.classList.remove('hidden')
      setTimeout(() => window.location.reload(), 800)
    } else {
      const { error } = await res.json()
      saveMsg.textContent = error ?? 'Erreur lors de la sauvegarde'
      saveMsg.className   = 'text-xs text-red-500 ml-auto'
      saveMsg.classList.remove('hidden')
      saveBtn.disabled    = false
      saveBtn.textContent = 'Enregistrer'
    }
  })

  if (personId) {
    fetch(\`/api/relations/\${personId}\`)
      .then(r => r.json())
      .then(({ parents, enfants, conjoints }) => {
        const container = document.getElementById('relationsPreview')
        const group = (label, items) => {
          if (!items?.length) return ''
          return \`
            <div>
              <p class="text-xs text-stone-400 font-medium uppercase tracking-wide mb-2">\${label}</p>
              <div class="flex flex-wrap gap-2">
                \${items.map(p => \`
                  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-700">
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-400 "></span>
                   <span class="capitalize"> \${p.prenom} \${p.nom}</span>
                  </span>\`).join('')}
              </div>
            </div>\`
        }
        const html = [
          group('Parents',   parents),
          group('Conjoints', conjoints),
          group('Enfants',   enfants),
        ].filter(Boolean).join('')
        container.innerHTML = html || '<p class="text-sm text-stone-400">Aucune relation enregistr\xE9e.</p>'
      })
      .catch(() => {
        document.getElementById('relationsPreview').innerHTML =
          '<p class="text-sm text-red-400">Impossible de charger les relations.</p>'
      })
  }
})();<\/script>`], ["", " <script>(function(){", `
  const editBtn   = document.getElementById('editBtn')
  const cancelBtn = document.getElementById('cancelBtn')
  const viewMode  = document.getElementById('viewMode')
  const editForm  = document.getElementById('editForm')

  editBtn.addEventListener('click', () => {
    viewMode.classList.add('hidden')
    editForm.classList.remove('hidden')
    editBtn.classList.add('hidden')
  })

  cancelBtn.addEventListener('click', () => {
    viewMode.classList.remove('hidden')
    editForm.classList.add('hidden')
    editBtn.classList.remove('hidden')
  })

  editForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const saveBtn = document.getElementById('saveBtn')
    const saveMsg = document.getElementById('saveMsg')
    const data    = Object.fromEntries(new FormData(editForm))

    saveBtn.disabled    = true
    saveBtn.textContent = 'Enregistrement\u2026'
    saveMsg.classList.add('hidden')

    const res = await fetch('/api/me/update', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    })

    if (res.ok) {
      saveMsg.textContent = '\u2713 Sauvegard\xE9'
      saveMsg.className   = 'text-xs text-green-600 ml-auto'
      saveMsg.classList.remove('hidden')
      setTimeout(() => window.location.reload(), 800)
    } else {
      const { error } = await res.json()
      saveMsg.textContent = error ?? 'Erreur lors de la sauvegarde'
      saveMsg.className   = 'text-xs text-red-500 ml-auto'
      saveMsg.classList.remove('hidden')
      saveBtn.disabled    = false
      saveBtn.textContent = 'Enregistrer'
    }
  })

  if (personId) {
    fetch(\\\`/api/relations/\\\${personId}\\\`)
      .then(r => r.json())
      .then(({ parents, enfants, conjoints }) => {
        const container = document.getElementById('relationsPreview')
        const group = (label, items) => {
          if (!items?.length) return ''
          return \\\`
            <div>
              <p class="text-xs text-stone-400 font-medium uppercase tracking-wide mb-2">\\\${label}</p>
              <div class="flex flex-wrap gap-2">
                \\\${items.map(p => \\\`
                  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-700">
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-400 "></span>
                   <span class="capitalize"> \\\${p.prenom} \\\${p.nom}</span>
                  </span>\\\`).join('')}
              </div>
            </div>\\\`
        }
        const html = [
          group('Parents',   parents),
          group('Conjoints', conjoints),
          group('Enfants',   enfants),
        ].filter(Boolean).join('')
        container.innerHTML = html || '<p class="text-sm text-stone-400">Aucune relation enregistr\xE9e.</p>'
      })
      .catch(() => {
        document.getElementById('relationsPreview').innerHTML =
          '<p class="text-sm text-red-400">Impossible de charger les relations.</p>'
      })
  }
})();<\/script>`])), renderComponent($$result, "Baselayout", $$Baselayout, { "title": "Mon profil" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="h-full bg-stone-50 flex overflow-hidden"> <!-- Colonne gauche : déco --> <div class="hidden lg:flex lg:w-5/12 bg-amber-800 flex-col justify-between p-12 relative overflow-hidden"> <div class="absolute inset-0 opacity-10"> <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"> <defs> <pattern id="tree" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse"> <circle cx="30" cy="30" r="1.5" fill="white"></circle> <line x1="30" y1="30" x2="30" y2="15" stroke="white" stroke-width="1"></line> <line x1="30" y1="22" x2="20" y2="14" stroke="white" stroke-width="0.8"></line> <line x1="30" y1="22" x2="40" y2="14" stroke="white" stroke-width="0.8"></line> <line x1="20" y1="14" x2="14" y2="8" stroke="white" stroke-width="0.6"></line> <line x1="20" y1="14" x2="26" y2="8" stroke="white" stroke-width="0.6"></line> <line x1="40" y1="14" x2="34" y2="8" stroke="white" stroke-width="0.6"></line> <line x1="40" y1="14" x2="46" y2="8" stroke="white" stroke-width="0.6"></line> </pattern> </defs> <rect width="100%" height="100%" fill="url(#tree)"></rect> </svg> </div> <!-- Infos utilisateur --> <div class="relative z-10"> <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/15 mb-6"> <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197"></path> </svg> </div> <h2 class="text-2xl font-semibold text-white tracking-tight capitalize"> ${person?.prenom ?? ""} ${person?.nom ?? "Mon profil"} </h2> <p class="text-amber-200 mt-1 text-sm">${user?.email}</p> ${person && renderTemplate`<a${addAttribute(`/tree/${person._id}`, "href")} class="inline-flex items-center gap-2 mt-6 px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white text-sm font-medium rounded-lg transition-colors"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 7h6M3 12h6M3 17h6M13 7l4 5-4 5M17 12H21"></path> </svg>
Voir mon arbre
</a>`} </div> <!-- Citation bas --> <div class="relative z-10"> <div class="h-px bg-white/20 mb-6"></div> <p class="text-amber-100 text-sm italic leading-relaxed">
"Un peuple sans histoire est comme un arbre sans racines."
</p> <p class="text-amber-300 text-xs mt-2">— Marcus Garvey</p> </div> </div> <!-- Colonne droite : contenu --> <div class="flex-1 flex flex-col overflow-hidden"> <div class="flex-1 overflow-y-auto"> <div class="min-h-full px-6 py-8 max-w-xl mx-auto space-y-5"> <!-- En-tête mobile --> <div class="lg:hidden flex items-center justify-between"> <div> <h1 class="text-xl font-semibold text-stone-800">Mon profil</h1> <p class="text-xs text-stone-500">${user?.email}</p> </div> ${person && renderTemplate`<a${addAttribute(`/tree/${person._id}`, "href")} class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-lg transition-colors"> <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 7h6M3 12h6M3 17h6M13 7l4 5-4 5M17 12H21"></path> </svg>
Mon arbre
</a>`} </div> <!-- Titre desktop --> <div class="hidden lg:block"> <h1 class="text-2xl font-semibold text-stone-800 tracking-tight">Mon profil</h1> </div> <!-- Carte infos personnelles --> <div class="bg-white rounded-2xl border border-stone-200 shadow-sm p-6"> <div class="flex items-center justify-between mb-5"> <h2 class="text-sm font-medium text-stone-800">Informations personnelles</h2> <button id="editBtn" class="text-xs text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1 transition-colors"> <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-1.414a2 2 0 01.586-1.414z"></path> </svg>
Modifier
</button> </div> <!-- Vue lecture --> <div id="viewMode" class="space-y-4"> <div class="grid grid-cols-2 gap-4"> <div> <p class="text-xs text-stone-400 mb-0.5 ">Prénom</p> <p class="text-sm font-medium text-stone-800 capitalize">${person?.prenom ?? "\u2014"}</p> </div> <div> <p class="text-xs text-stone-400 mb-0.5 ">Nom</p> <p class="text-sm font-medium text-stone-800 capitalize">${person?.nom ?? "\u2014"}</p> </div> </div> <div class="grid grid-cols-2 gap-4"> <div> <p class="text-xs text-stone-400 mb-0.5">Date de naissance</p> <p class="text-sm font-medium text-stone-800">${person?.dateNaissance ?? "\u2014"}</p> </div> <div> <p class="text-xs text-stone-400 mb-0.5">Sexe</p> <p class="text-sm font-medium text-stone-800"> ${person?.sexe === "M" ? "Homme" : person?.sexe === "F" ? "Femme" : person?.sexe ?? "\u2014"} </p> </div> </div> ${person?.notes && renderTemplate`<div> <p class="text-xs text-stone-400 mb-0.5">Notes</p> <p class="text-sm text-stone-700">${person.notes}</p> </div>`} </div> <!-- Formulaire édition --> <form id="editForm" class="hidden space-y-4"> <div class="grid grid-cols-2 gap-3"> <div> <label class="block text-xs text-stone-500 mb-1">Prénom</label> <input type="text" name="prenom"${addAttribute(person?.prenom ?? "", "value")} class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"> </div> <div> <label class="block text-xs text-stone-500 mb-1">Nom</label> <input type="text" name="nom"${addAttribute(person?.nom ?? "", "value")} class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"> </div> </div> <div class="grid grid-cols-2 gap-3"> <div> <label class="block text-xs text-stone-500 mb-1">Date de naissance</label> <input type="date" name="dateNaissance"${addAttribute(person?.dateNaissance ?? "", "value")} class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"> </div> <div> <label class="block text-xs text-stone-500 mb-1">Sexe</label> <select name="sexe" class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"> <option value="">—</option> <option value="M"${addAttribute(person?.sexe === "M", "selected")}>Homme</option> <option value="F"${addAttribute(person?.sexe === "F", "selected")}>Femme</option> <option value="Autre"${addAttribute(person?.sexe === "Autre", "selected")}>Autre</option> </select> </div> </div> <div> <label class="block text-xs text-stone-500 mb-1">Notes</label> <textarea name="notes" rows="3" class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition resize-none">${person?.notes ?? ""}</textarea> </div> <div class="flex items-center gap-3 pt-1"> <button type="submit" id="saveBtn" class="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors">
Enregistrer
</button> <button type="button" id="cancelBtn" class="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-medium rounded-lg transition-colors">
Annuler
</button> <p id="saveMsg" class="text-xs ml-auto hidden"></p> </div> </form> </div> <!-- Carte relations --> ${person && renderTemplate`<div class="bg-white rounded-2xl border border-stone-200 shadow-sm p-6"> <div class="flex items-center justify-between mb-4"> <h2 class="text-sm font-medium text-stone-800">Mes relations</h2> <a${addAttribute(`/tree/${person._id}`, "href")} class="text-xs text-amber-700 hover:underline font-medium">
Voir l'arbre complet →
</a> </div> <div id="relationsPreview" class="space-y-2"> <p class="text-sm text-stone-400">Chargement…</p> </div> </div>`} <!-- Déconnexion --> <div class="text-center pb-4"> <a href="/api/auth/logout" class="text-xs text-stone-400 hover:text-red-500 transition-colors">
Se déconnecter
</a> </div> </div> </div> </div> </div> ` }), defineScriptVars({ personId: person?._id?.toString() ?? null }));
}, "C:/lacapsule-testsperso/genealogia-astro/src/pages/profil.astro", void 0);

const $$file = "C:/lacapsule-testsperso/genealogia-astro/src/pages/profil.astro";
const $$url = "/profil";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Profil,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

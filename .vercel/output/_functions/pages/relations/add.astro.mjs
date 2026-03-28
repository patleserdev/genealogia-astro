import { e as createComponent, r as renderTemplate, n as defineScriptVars, k as renderComponent, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../../chunks/astro/server_DzJdx5CC.mjs';
import 'piccolore';
import { $ as $$Baselayout } from '../../chunks/Baselayout_DbP0pFxM.mjs';
import { db, persons, relations } from '../../chunks/mongo_DDLBCJZd.mjs';
import { ObjectId } from 'mongodb';
import { a as formatDateForInput } from '../../chunks/formatDate_DWbQ-kky.mjs';
import { f as formatFullName } from '../../chunks/formatName_BxoIGF2R.mjs';
import { v as verifyToken } from '../../chunks/auth_C0Ch4QAz.mjs';
/* empty css                                  */
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const prerender = false;
const $$Add = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Add;
  const token = Astro2.cookies.get("token")?.value;
  if (!token) return Astro2.redirect("/login");
  let user = null;
  try {
    const payload = verifyToken(token);
    user = await db.collection("users").findOne({ _id: new ObjectId(payload.userId) });
  } catch {
    return Astro2.redirect("/login");
  }
  const relationId = Astro2.url.searchParams.get("id");
  const returnUrl = Astro2.url.searchParams.get("returnUrl") || "/relations";
  const persons$1 = await persons.find({ active: true }).toArray();
  let relation = null;
  if (relationId && ObjectId.isValid(relationId)) {
    relation = await relations.findOne({ _id: new ObjectId(relationId) });
  }
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
    majeur: isMajeur(p.dateNaissance)
  })).sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  const majeurs = personsData.filter((p) => p.majeur);
  const coupleRelationsData = coupleRelations.map((r) => {
    const p1 = personsData.find((p) => p._id === r.from.toString());
    const p2 = personsData.find((p) => p._id === r.to.toString());
    return {
      _id: r._id.toString(),
      label: p1 && p2 ? `${formatFullName(p1.prenom, p1.nom)} & ${formatFullName(p2.prenom, p2.nom)}${r.status === "DIVORCED" ? " (divorc\xE9s)" : ""}` : r._id.toString()
    };
  });
  const currentCoupleRelationId = relation?.coupleRelationId?.toString() ?? "";
  const isEdit = !!relation;
  const initialType = relation?.type ?? "PARENT";
  return renderTemplate(_a || (_a = __template(["", "  <script>(function(){", `
  const form          = document.getElementById("relationForm");
  const typeHidden    = document.getElementById("typeHidden");
  const parentFields  = document.getElementById("parentFields");
  const conjointFields = document.getElementById("conjointFields");
  const submitBtn     = document.getElementById("submitBtn");
  const errorMsg      = document.getElementById("errorMsg");
  const recapContent  = document.getElementById("recapContent");
  const btnParent     = document.getElementById("btnParent");
  const btnConjoint   = document.getElementById("btnConjoint");

  const persons = JSON.parse(personsData);

  function getName(id) {
    const p = persons.find(p => p._id === id);
    return p ? \`\${p.prenom} \${p.nom}\` : '\u2014';
  }

  // \u2500\u2500 Type toggle \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function setType(type) {
    typeHidden.value = type;
    const isConjoint = type === "CONJOINT";

    btnParent.classList.toggle("active",   !isConjoint);
    btnConjoint.classList.toggle("active",  isConjoint);

    parentFields.classList.toggle("hidden",   isConjoint);
    conjointFields.classList.toggle("hidden", !isConjoint);

    updateRecap();
  }

  btnParent.addEventListener("click",   () => setType("PARENT"));
  btnConjoint.addEventListener("click", () => setType("CONJOINT"));

  // Init
  setType(initialType);

  // \u2500\u2500 R\xE9sum\xE9 live \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function updateRecap() {
    const type = typeHidden.value;

    if (type === "CONJOINT") {
      const fromId = document.getElementById("from")?.value;
      const toId   = document.getElementById("to")?.value;
      const status = document.getElementById("status")?.value;

      if (!fromId || !toId) {
        recapContent.innerHTML = '<p class="text-sm text-stone-400 italic">S\xE9lectionnez les deux conjoints.</p>';
        return;
      }

      const statusLabel = status === 'ACTIVE' ? 'En couple' : 'Divorc\xE9s';
      const statusColor = status === 'ACTIVE' ? 'text-green-700 bg-green-50 border-green-200' : 'text-stone-500 bg-stone-50 border-stone-200';

      recapContent.innerHTML = \`
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-xs font-medium text-amber-700 shrink-0">
            \${getName(fromId).charAt(0)}
          </div>
          <span class="text-sm font-medium text-stone-800">\${getName(fromId)}</span>
        </div>
        <div class="flex items-center gap-2 pl-3">
          <svg class="w-3.5 h-3.5 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
          <span class="text-xs px-2 py-0.5 rounded-full border \${statusColor}">\${statusLabel}</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-xs font-medium text-amber-700 shrink-0">
            \${getName(toId).charAt(0)}
          </div>
          <span class="text-sm font-medium text-stone-800">\${getName(toId)}</span>
        </div>\`;
    } else {
      const parentId = document.getElementById("parent1")?.value;
      const childId  = document.getElementById("child")?.value;

      if (!parentId || !childId) {
        recapContent.innerHTML = '<p class="text-sm text-stone-400 italic">S\xE9lectionnez le parent et l\\'enfant.</p>';
        return;
      }

      recapContent.innerHTML = \`
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-xs font-medium text-amber-700 shrink-0">
            \${getName(parentId).charAt(0)}
          </div>
          <div>
            <p class="text-xs text-stone-400">Parent</p>
            <p class="text-sm font-medium text-stone-800">\${getName(parentId)}</p>
          </div>
        </div>
        <div class="flex items-center gap-2 pl-3">
          <svg class="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"/>
          </svg>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-xs font-medium text-stone-600 shrink-0">
            \${getName(childId).charAt(0)}
          </div>
          <div>
            <p class="text-xs text-stone-400">Enfant</p>
            <p class="text-sm font-medium text-stone-800">\${getName(childId)}</p>
          </div>
        </div>\`;
    }
  }

  // \xC9couter les changements de select
  ['from', 'to', 'status', 'parent1', 'child'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', updateRecap);
  });

  // \u2500\u2500 Soumission \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd   = new FormData(form);
    const type = fd.get("type");
    let payload = {};

    errorMsg.classList.add("hidden");

    if (type === "CONJOINT") {
      if (fd.get("from") === fd.get("to")) {
        errorMsg.textContent = "Les deux conjoints ne peuvent pas \xEAtre la m\xEAme personne.";
        errorMsg.classList.remove("hidden");
        return;
      }
      payload = {
        type,
        from:      fd.get("from"),
        to:        fd.get("to"),
        status:    fd.get("status"),
        dateDebut: fd.get("dateDebut") ? new Date(fd.get("dateDebut")) : null,
        dateFin:   fd.get("dateFin")   ? new Date(fd.get("dateFin"))   : null,
      };
    } else {
      if (fd.get("parent1") === fd.get("child")) {
        errorMsg.textContent = "Le parent et l'enfant ne peuvent pas \xEAtre la m\xEAme personne.";
        errorMsg.classList.remove("hidden");
        return;
      }
      payload = {
        type:   "PARENT",
        from:   fd.get("parent1"),
        to:     fd.get("child"),
        ...(fd.get("coupleRelationId") ? { coupleRelationId: fd.get("coupleRelationId") } : {}),
      };
    }

    submitBtn.disabled    = true;
    submitBtn.textContent = "Enregistrement\u2026";

    const res = await fetch(
      relationId ? \`/api/relations/\${relationId}\` : "/api/relations",
      { method: relationId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
    );

    if (!res.ok) {
      const text = await res.text().catch(() => "Erreur inconnue");
      errorMsg.textContent = text;
      errorMsg.classList.remove("hidden");
      submitBtn.disabled    = false;
      submitBtn.textContent = relationId ? "Enregistrer les modifications" : "Cr\xE9er la relation";
      return;
    }

    window.location.href = returnUrl;
  });
})();<\/script>`], ["", "  <script>(function(){", `
  const form          = document.getElementById("relationForm");
  const typeHidden    = document.getElementById("typeHidden");
  const parentFields  = document.getElementById("parentFields");
  const conjointFields = document.getElementById("conjointFields");
  const submitBtn     = document.getElementById("submitBtn");
  const errorMsg      = document.getElementById("errorMsg");
  const recapContent  = document.getElementById("recapContent");
  const btnParent     = document.getElementById("btnParent");
  const btnConjoint   = document.getElementById("btnConjoint");

  const persons = JSON.parse(personsData);

  function getName(id) {
    const p = persons.find(p => p._id === id);
    return p ? \\\`\\\${p.prenom} \\\${p.nom}\\\` : '\u2014';
  }

  // \u2500\u2500 Type toggle \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function setType(type) {
    typeHidden.value = type;
    const isConjoint = type === "CONJOINT";

    btnParent.classList.toggle("active",   !isConjoint);
    btnConjoint.classList.toggle("active",  isConjoint);

    parentFields.classList.toggle("hidden",   isConjoint);
    conjointFields.classList.toggle("hidden", !isConjoint);

    updateRecap();
  }

  btnParent.addEventListener("click",   () => setType("PARENT"));
  btnConjoint.addEventListener("click", () => setType("CONJOINT"));

  // Init
  setType(initialType);

  // \u2500\u2500 R\xE9sum\xE9 live \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function updateRecap() {
    const type = typeHidden.value;

    if (type === "CONJOINT") {
      const fromId = document.getElementById("from")?.value;
      const toId   = document.getElementById("to")?.value;
      const status = document.getElementById("status")?.value;

      if (!fromId || !toId) {
        recapContent.innerHTML = '<p class="text-sm text-stone-400 italic">S\xE9lectionnez les deux conjoints.</p>';
        return;
      }

      const statusLabel = status === 'ACTIVE' ? 'En couple' : 'Divorc\xE9s';
      const statusColor = status === 'ACTIVE' ? 'text-green-700 bg-green-50 border-green-200' : 'text-stone-500 bg-stone-50 border-stone-200';

      recapContent.innerHTML = \\\`
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-xs font-medium text-amber-700 shrink-0">
            \\\${getName(fromId).charAt(0)}
          </div>
          <span class="text-sm font-medium text-stone-800">\\\${getName(fromId)}</span>
        </div>
        <div class="flex items-center gap-2 pl-3">
          <svg class="w-3.5 h-3.5 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
          <span class="text-xs px-2 py-0.5 rounded-full border \\\${statusColor}">\\\${statusLabel}</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-xs font-medium text-amber-700 shrink-0">
            \\\${getName(toId).charAt(0)}
          </div>
          <span class="text-sm font-medium text-stone-800">\\\${getName(toId)}</span>
        </div>\\\`;
    } else {
      const parentId = document.getElementById("parent1")?.value;
      const childId  = document.getElementById("child")?.value;

      if (!parentId || !childId) {
        recapContent.innerHTML = '<p class="text-sm text-stone-400 italic">S\xE9lectionnez le parent et l\\\\'enfant.</p>';
        return;
      }

      recapContent.innerHTML = \\\`
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-xs font-medium text-amber-700 shrink-0">
            \\\${getName(parentId).charAt(0)}
          </div>
          <div>
            <p class="text-xs text-stone-400">Parent</p>
            <p class="text-sm font-medium text-stone-800">\\\${getName(parentId)}</p>
          </div>
        </div>
        <div class="flex items-center gap-2 pl-3">
          <svg class="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"/>
          </svg>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-xs font-medium text-stone-600 shrink-0">
            \\\${getName(childId).charAt(0)}
          </div>
          <div>
            <p class="text-xs text-stone-400">Enfant</p>
            <p class="text-sm font-medium text-stone-800">\\\${getName(childId)}</p>
          </div>
        </div>\\\`;
    }
  }

  // \xC9couter les changements de select
  ['from', 'to', 'status', 'parent1', 'child'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', updateRecap);
  });

  // \u2500\u2500 Soumission \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd   = new FormData(form);
    const type = fd.get("type");
    let payload = {};

    errorMsg.classList.add("hidden");

    if (type === "CONJOINT") {
      if (fd.get("from") === fd.get("to")) {
        errorMsg.textContent = "Les deux conjoints ne peuvent pas \xEAtre la m\xEAme personne.";
        errorMsg.classList.remove("hidden");
        return;
      }
      payload = {
        type,
        from:      fd.get("from"),
        to:        fd.get("to"),
        status:    fd.get("status"),
        dateDebut: fd.get("dateDebut") ? new Date(fd.get("dateDebut")) : null,
        dateFin:   fd.get("dateFin")   ? new Date(fd.get("dateFin"))   : null,
      };
    } else {
      if (fd.get("parent1") === fd.get("child")) {
        errorMsg.textContent = "Le parent et l'enfant ne peuvent pas \xEAtre la m\xEAme personne.";
        errorMsg.classList.remove("hidden");
        return;
      }
      payload = {
        type:   "PARENT",
        from:   fd.get("parent1"),
        to:     fd.get("child"),
        ...(fd.get("coupleRelationId") ? { coupleRelationId: fd.get("coupleRelationId") } : {}),
      };
    }

    submitBtn.disabled    = true;
    submitBtn.textContent = "Enregistrement\u2026";

    const res = await fetch(
      relationId ? \\\`/api/relations/\\\${relationId}\\\` : "/api/relations",
      { method: relationId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
    );

    if (!res.ok) {
      const text = await res.text().catch(() => "Erreur inconnue");
      errorMsg.textContent = text;
      errorMsg.classList.remove("hidden");
      submitBtn.disabled    = false;
      submitBtn.textContent = relationId ? "Enregistrer les modifications" : "Cr\xE9er la relation";
      return;
    }

    window.location.href = returnUrl;
  });
})();<\/script>`])), renderComponent($$result, "Baselayout", $$Baselayout, { "title": isEdit ? "Modifier une relation" : "Ajouter une relation", "data-astro-cid-k74lnhcn": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-4xl mx-auto px-6 py-8" data-astro-cid-k74lnhcn> <!-- En-tête --> <div class="flex items-center justify-between mb-6" data-astro-cid-k74lnhcn> <div data-astro-cid-k74lnhcn> <h1 class="text-2xl font-semibold text-stone-800 tracking-tight" data-astro-cid-k74lnhcn> ${isEdit ? "Modifier la relation" : "Nouvelle relation"} </h1> <p class="text-sm text-stone-500 mt-0.5" data-astro-cid-k74lnhcn> ${isEdit ? "Mettez \xE0 jour les informations" : "D\xE9finissez le lien entre deux personnes"} </p> </div> <a${addAttribute(returnUrl, "href")} class="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 transition-colors" data-astro-cid-k74lnhcn> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-k74lnhcn> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" data-astro-cid-k74lnhcn></path> </svg>
Retour
</a> </div> <div class="grid lg:grid-cols-3 gap-6" data-astro-cid-k74lnhcn> <!-- Formulaire (2/3) --> <div class="lg:col-span-2 space-y-5" data-astro-cid-k74lnhcn> <form id="relationForm" class="space-y-5" data-astro-cid-k74lnhcn> <!-- Type de relation --> <div class="bg-white border border-stone-200 rounded-xl p-5" data-astro-cid-k74lnhcn> <label class="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3" data-astro-cid-k74lnhcn>
Type de relation
</label> <div class="grid grid-cols-2 gap-2" data-astro-cid-k74lnhcn> <button type="button" data-type="PARENT" id="btnParent" class="type-btn flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left" data-astro-cid-k74lnhcn> <div class="type-btn-icon w-8 h-8 rounded-lg flex items-center justify-center shrink-0" data-astro-cid-k74lnhcn> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-k74lnhcn> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" data-astro-cid-k74lnhcn></path> </svg> </div> <div data-astro-cid-k74lnhcn> <p class="text-sm font-medium" data-astro-cid-k74lnhcn>Parent / Enfant</p> <p class="text-xs text-stone-400" data-astro-cid-k74lnhcn>Lien de filiation</p> </div> </button> <button type="button" data-type="CONJOINT" id="btnConjoint" class="type-btn flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left" data-astro-cid-k74lnhcn> <div class="type-btn-icon w-8 h-8 rounded-lg flex items-center justify-center shrink-0" data-astro-cid-k74lnhcn> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-k74lnhcn> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" data-astro-cid-k74lnhcn></path> </svg> </div> <div data-astro-cid-k74lnhcn> <p class="text-sm font-medium" data-astro-cid-k74lnhcn>Couple</p> <p class="text-xs text-stone-400" data-astro-cid-k74lnhcn>Lien conjugal</p> </div> </button> </div> <input type="hidden" name="type" id="typeHidden"${addAttribute(initialType, "value")} data-astro-cid-k74lnhcn> </div> <!-- Champs PARENT --> <div id="parentFields" class="bg-white border border-stone-200 rounded-xl p-5 space-y-4" data-astro-cid-k74lnhcn> <h2 class="text-xs font-semibold text-stone-500 uppercase tracking-wider" data-astro-cid-k74lnhcn>
Relation parent / enfant
</h2> <div class="grid grid-cols-2 gap-3" data-astro-cid-k74lnhcn> <div data-astro-cid-k74lnhcn> <label class="block text-xs text-stone-500 mb-1" data-astro-cid-k74lnhcn>Parent</label> <select name="parent1" id="parent1" class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition" data-astro-cid-k74lnhcn> <option value="" data-astro-cid-k74lnhcn>— Non renseigné —</option> ${personsData.map((p) => renderTemplate`<option${addAttribute(p._id, "value")}${addAttribute(relation?.from?.toString() === p._id, "selected")} data-astro-cid-k74lnhcn> ${formatFullName(p.prenom, p.nom)} </option>`)} </select> </div> <div data-astro-cid-k74lnhcn> <label class="block text-xs text-stone-500 mb-1" data-astro-cid-k74lnhcn>Enfant</label> <select name="child" id="child" class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition" data-astro-cid-k74lnhcn> ${personsData.map((p) => renderTemplate`<option${addAttribute(p._id, "value")}${addAttribute(relation?.to?.toString() === p._id, "selected")} data-astro-cid-k74lnhcn> ${formatFullName(p.prenom, p.nom)} </option>`)} </select> </div> </div> <div data-astro-cid-k74lnhcn> <label class="block text-xs text-stone-500 mb-1" data-astro-cid-k74lnhcn>
Couple associé <span class="text-stone-400" data-astro-cid-k74lnhcn>(optionnel)</span> </label> <select name="coupleRelationId" id="coupleRelationId" class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition" data-astro-cid-k74lnhcn> <option value="" data-astro-cid-k74lnhcn>— Aucun couple —</option> ${coupleRelationsData.map((c) => renderTemplate`<option${addAttribute(c._id, "value")}${addAttribute(currentCoupleRelationId === c._id, "selected")} data-astro-cid-k74lnhcn> ${c.label} </option>`)} </select> </div> </div> <!-- Champs CONJOINT --> <div id="conjointFields" class="hidden bg-white border border-stone-200 rounded-xl p-5 space-y-4" data-astro-cid-k74lnhcn> <h2 class="text-xs font-semibold text-stone-500 uppercase tracking-wider" data-astro-cid-k74lnhcn>
Relation de couple
</h2> <div class="grid grid-cols-2 gap-3" data-astro-cid-k74lnhcn> <div data-astro-cid-k74lnhcn> <label class="block text-xs text-stone-500 mb-1" data-astro-cid-k74lnhcn>Conjoint A</label> <select name="from" id="from" class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition" data-astro-cid-k74lnhcn> ${majeurs.map((p) => renderTemplate`<option${addAttribute(p._id, "value")}${addAttribute(relation?.from?.toString() === p._id, "selected")} data-astro-cid-k74lnhcn> ${formatFullName(p.prenom, p.nom)} </option>`)} </select> </div> <div data-astro-cid-k74lnhcn> <label class="block text-xs text-stone-500 mb-1" data-astro-cid-k74lnhcn>Conjoint B</label> <select name="to" id="to" class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition" data-astro-cid-k74lnhcn> ${majeurs.map((p) => renderTemplate`<option${addAttribute(p._id, "value")}${addAttribute(relation?.to?.toString() === p._id, "selected")} data-astro-cid-k74lnhcn> ${formatFullName(p.prenom, p.nom)} </option>`)} </select> </div> </div> <div data-astro-cid-k74lnhcn> <label class="block text-xs text-stone-500 mb-1" data-astro-cid-k74lnhcn>Statut</label> <select name="status" id="status" class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition" data-astro-cid-k74lnhcn> <option value="ACTIVE"${addAttribute(relation?.status === "ACTIVE", "selected")} data-astro-cid-k74lnhcn>En couple</option> <option value="DIVORCED"${addAttribute(relation?.status === "DIVORCED", "selected")} data-astro-cid-k74lnhcn>Divorcé</option> </select> </div> <div class="grid grid-cols-2 gap-3" data-astro-cid-k74lnhcn> <div data-astro-cid-k74lnhcn> <label class="block text-xs text-stone-500 mb-1" data-astro-cid-k74lnhcn>Date de début</label> <input type="date" name="dateDebut"${addAttribute(formatDateForInput(relation?.dateDebut), "value")} class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition" data-astro-cid-k74lnhcn> </div> <div data-astro-cid-k74lnhcn> <label class="block text-xs text-stone-500 mb-1" data-astro-cid-k74lnhcn>Date de fin</label> <input type="date" name="dateFin"${addAttribute(formatDateForInput(relation?.dateFin), "value")} class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition" data-astro-cid-k74lnhcn> </div> </div> </div> <!-- Erreur --> <p id="errorMsg" class="hidden text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2" data-astro-cid-k74lnhcn></p> <!-- Actions --> <div class="flex items-center gap-3" data-astro-cid-k74lnhcn> <button type="submit" id="submitBtn" class="flex-1 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors" data-astro-cid-k74lnhcn> ${isEdit ? "Enregistrer les modifications" : "Cr\xE9er la relation"} </button> <a${addAttribute(returnUrl, "href")} class="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-medium rounded-lg transition-colors" data-astro-cid-k74lnhcn>
Annuler
</a> </div> </form> </div> <!-- Panneau résumé (1/3) --> <div data-astro-cid-k74lnhcn> <div class="bg-white border border-stone-200 rounded-xl p-5 sticky top-20 space-y-4" data-astro-cid-k74lnhcn> <h2 class="text-xs font-semibold text-stone-500 uppercase tracking-wider" data-astro-cid-k74lnhcn>Résumé</h2> <div id="recapContent" class="space-y-3" data-astro-cid-k74lnhcn> <p class="text-sm text-stone-400 italic" data-astro-cid-k74lnhcn>Sélectionnez les personnes pour voir le résumé.</p> </div> </div> </div> </div> </div> ` }), defineScriptVars({ relationId, returnUrl, initialType, personsData: JSON.stringify(personsData) }));
}, "C:/lacapsule-testsperso/genealogia-astro/src/pages/relations/add.astro", void 0);

const $$file = "C:/lacapsule-testsperso/genealogia-astro/src/pages/relations/add.astro";
const $$url = "/relations/add";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Add,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

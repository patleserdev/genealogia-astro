import { e as createComponent, r as renderTemplate, l as renderScript, p as renderSlot, k as renderComponent, g as addAttribute, q as renderHead, h as createAstro, o as Fragment } from './astro/server_Cr2bBY3R.mjs';
import 'piccolore';
/* empty css                         */
import { v as verifyToken } from './auth_C0Ch4QAz.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Baselayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Baselayout;
  const { title = "Arbre généalogique" } = Astro2.props;
  let user = null;
  const token = Astro2.cookies.get("token")?.value;
  if (token) {
    try {
      user = verifyToken(token);
    } catch {
    }
  }
  const nav = [
    { href: "/", label: "Accueil" },
    { href: "/persons", label: "Personnes" },
    { href: "/relations", label: "Relations" },
    { href: "/relations/add-quick", label: "Relation rapide" },
    { href: "/persons/add-with-relations", label: "Personne + Relation" }
  ];
  return renderTemplate(_a || (_a = __template(['<html lang="fr" data-astro-cid-ugyyqijz> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="view-transition" content="same-origin"><title>', '</title><script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>', '</head> <body class="bg-stone-50 text-stone-900 font-sans min-h-screen flex flex-col" data-astro-cid-ugyyqijz> <!-- HEADER --> <header class="bg-white border-b border-stone-200 sticky top-0 z-50 h-14" data-astro-cid-ugyyqijz> <div class="max-w-6xl mx-auto px-4 h-full flex items-center justify-between gap-4" data-astro-cid-ugyyqijz> <!-- Logo --> <a href="/" class="flex items-center gap-2 shrink-0" data-astro-cid-ugyyqijz> <div class="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center" data-astro-cid-ugyyqijz> <svg class="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-ugyyqijz> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" data-astro-cid-ugyyqijz></path> </svg> </div> <span class="font-semibold text-stone-800 text-sm" data-astro-cid-ugyyqijz>Genealogia</span> </a> <!-- Nav desktop --> <nav id="desktopNav" class="hidden lg:flex items-center gap-0.5 flex-1 px-4" data-astro-cid-ugyyqijz> ', ' </nav> <!-- Actions droite --> <div class="hidden lg:flex items-center gap-2 shrink-0" data-astro-cid-ugyyqijz> ', ' </div> <!-- Burger mobile --> <button id="burger" aria-label="Menu" class="lg:hidden flex flex-col justify-center gap-1.5 p-2 rounded-lg hover:bg-stone-100 transition-colors" data-astro-cid-ugyyqijz> <span class="block w-5 h-0.5 bg-stone-600 rounded transition-all duration-200" id="b1" data-astro-cid-ugyyqijz></span> <span class="block w-5 h-0.5 bg-stone-600 rounded transition-all duration-200" id="b2" data-astro-cid-ugyyqijz></span> <span class="block w-5 h-0.5 bg-stone-600 rounded transition-all duration-200" id="b3" data-astro-cid-ugyyqijz></span> </button> </div> </header> <!-- Mobile menu --> <div id="mobileMenu" class="hidden lg:hidden bg-white border-b border-stone-200 px-4 py-3 space-y-0.5" data-astro-cid-ugyyqijz> ', ' <div class="h-px bg-stone-100 my-2" data-astro-cid-ugyyqijz></div> ', ' </div> <!-- MAIN --> <main class="flex-1" data-astro-cid-ugyyqijz> ', ' </main> <!-- FOOTER --> <footer class="border-t border-stone-200 py-4 px-4 text-center" data-astro-cid-ugyyqijz> <p class="text-xs text-stone-400" data-astro-cid-ugyyqijz>© 2026 — Genealogia</p> </footer> ', " </body> </html>"])), title, renderHead(), nav.map(({ href, label }) => renderTemplate`<a${addAttribute(href, "href")} data-navlink class="px-3 py-1.5 rounded-lg text-sm text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors whitespace-nowrap font-medium" data-astro-cid-ugyyqijz> ${label} </a>`), user ? renderTemplate`<div class="flex items-center gap-2" data-astro-cid-ugyyqijz> <a href="/profil" class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-stone-600 hover:text-stone-800 hover:bg-stone-100 transition-colors font-medium" data-astro-cid-ugyyqijz> <div class="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center" data-astro-cid-ugyyqijz> <svg class="w-3.5 h-3.5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-ugyyqijz> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" data-astro-cid-ugyyqijz></path> </svg> </div> ${user.nom} </a> <a href="/api/auth/logout" class="px-3 py-1.5 rounded-lg text-sm text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors font-medium" data-astro-cid-ugyyqijz>
Déconnexion
</a> </div>` : renderTemplate`<div class="flex items-center gap-2" data-astro-cid-ugyyqijz> <a href="/login" class="px-3 py-1.5 rounded-lg text-sm text-stone-600 hover:text-stone-800 hover:bg-stone-100 transition-colors font-medium" data-astro-cid-ugyyqijz>
Se connecter
</a> ${ false} </div>`, nav.map(({ href, label }) => renderTemplate`<a${addAttribute(href, "href")} data-navlink class="block px-3 py-2 rounded-lg text-sm text-stone-600 hover:text-stone-800 hover:bg-stone-100 transition-colors font-medium" data-astro-cid-ugyyqijz> ${label} </a>`), user ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "data-astro-cid-ugyyqijz": true }, { "default": ($$result2) => renderTemplate` <a href="/profil" class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-stone-600 hover:bg-stone-100 transition-colors font-medium" data-astro-cid-ugyyqijz> <div class="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center" data-astro-cid-ugyyqijz> <svg class="w-3 h-3 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-ugyyqijz> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" data-astro-cid-ugyyqijz></path> </svg> </div> ${user.nom} — Mon profil
</a> <a href="/api/auth/logout" class="block px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors font-medium" data-astro-cid-ugyyqijz>
Déconnexion
</a> ` })}` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "data-astro-cid-ugyyqijz": true }, { "default": ($$result2) => renderTemplate` <a href="/login" class="block px-3 py-2 rounded-lg text-sm text-stone-600 hover:bg-stone-100 transition-colors font-medium" data-astro-cid-ugyyqijz>
Se connecter
</a> ${ false}` })}`, renderSlot($$result, $$slots["default"]), renderScript($$result, "C:/lacapsule-testsperso/genealogia-astro/src/layouts/Baselayout.astro?astro&type=script&index=0&lang.ts"));
}, "C:/lacapsule-testsperso/genealogia-astro/src/layouts/Baselayout.astro", void 0);

export { $$Baselayout as $ };

import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, h as createAstro, m as maybeRenderHead } from '../chunks/astro/server_DzJdx5CC.mjs';
import 'piccolore';
import { $ as $$Baselayout } from '../chunks/Baselayout_DbP0pFxM.mjs';
import { v as verifyToken } from '../chunks/auth_C0Ch4QAz.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Login;
  const token = Astro2.cookies.get("token")?.value;
  if (token) {
    try {
      verifyToken(token);
      return Astro2.redirect("/profil");
    } catch {
    }
  }
  return renderTemplate`${renderComponent($$result, "Baselayout", $$Baselayout, { "title": "Se connecter" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="h-full bg-stone-50 flex overflow-hidden"> <!-- Colonne gauche : déco --> <div class="hidden lg:flex lg:w-5/12 bg-amber-800 flex-col justify-between p-12 relative overflow-hidden"> <!-- Motif de fond --> <div class="absolute inset-0 opacity-10"> <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"> <defs> <pattern id="tree" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse"> <circle cx="30" cy="30" r="1.5" fill="white"></circle> <line x1="30" y1="30" x2="30" y2="15" stroke="white" stroke-width="1"></line> <line x1="30" y1="22" x2="20" y2="14" stroke="white" stroke-width="0.8"></line> <line x1="30" y1="22" x2="40" y2="14" stroke="white" stroke-width="0.8"></line> <line x1="20" y1="14" x2="14" y2="8" stroke="white" stroke-width="0.6"></line> <line x1="20" y1="14" x2="26" y2="8" stroke="white" stroke-width="0.6"></line> <line x1="40" y1="14" x2="34" y2="8" stroke="white" stroke-width="0.6"></line> <line x1="40" y1="14" x2="46" y2="8" stroke="white" stroke-width="0.6"></line> </pattern> </defs> <rect width="100%" height="100%" fill="url(#tree)"></rect> </svg> </div> <!-- Logo / marque --> <div class="relative z-10"> <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/15 mb-6"> <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197"></path> </svg> </div> <h2 class="text-2xl font-semibold text-white tracking-tight">
Arbre généalogique
</h2> <p class="text-amber-200 mt-2 text-sm leading-relaxed">
Retrouvez vos racines, préservez la mémoire de votre famille pour les
          générations futures.
</p> <div class="object-contain my-2 p-3"> <img src="/family3.jpg"> </div> </div> <!-- Citation bas --> <div class="relative z-10"> <div class="h-px bg-white/20 mb-6"></div> <p class="text-amber-100 text-sm italic leading-relaxed">
"Un peuple sans histoire est comme un arbre sans racines."
</p> <p class="text-amber-300 text-xs mt-2">— Marcus Garvey</p> </div> </div> <!-- Colonne droite : formulaire --> <div class="flex-1 flex flex-col overflow-hidden"> <div class="flex-1 overflow-y-auto"> <div class="min-h-full flex items-center justify-center px-6 py-8"> <div class="w-full max-w-md"> <!-- En-tête mobile uniquement --> <div class="lg:hidden text-center mb-6"> <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 mb-3"> <svg class="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197"></path> </svg> </div> <h1 class="text-xl font-semibold text-stone-800">Se connecter</h1> </div> <!-- Titre desktop --> <div class="hidden lg:block mb-6"> <h1 class="text-2xl font-semibold text-stone-800 tracking-tight">
Bon retour
</h1> <p class="text-sm text-stone-500 mt-1">
Accédez à votre arbre généalogique
</p> </div> <!-- Carte --> <div class="bg-white rounded-2xl shadow-sm border border-stone-200 p-6"> <form id="loginForm" class="space-y-4"> <!-- Email --> <div> <label class="block text-xs font-medium text-stone-700 mb-1">Email</label> <input type="email" name="email" required placeholder="jean@exemple.fr" class="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"> </div> <!-- Mot de passe --> <div>  <div class="relative"> <input type="password" name="password" id="password" required placeholder="••••••••" class="w-full px-3 py-2 pr-9 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"> <button type="button" id="togglePassword" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition"> <svg id="eyeIcon" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path> </svg> <svg id="eyeOffIcon" class="w-4 h-4 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path> </svg> </button> </div> </div> <!-- Erreur --> <p id="errorMsg" class="hidden text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"></p> <!-- Submit --> <button type="submit" id="submitBtn" class="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors duration-150">
Se connecter
</button> </form> ${ false} </div> </div> </div> </div> </div> </div> ` })} ${renderScript($$result, "C:/lacapsule-testsperso/genealogia-astro/src/pages/login.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/lacapsule-testsperso/genealogia-astro/src/pages/login.astro", void 0);
const $$file = "C:/lacapsule-testsperso/genealogia-astro/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

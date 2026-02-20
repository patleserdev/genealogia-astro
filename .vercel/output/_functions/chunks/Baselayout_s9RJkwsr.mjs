import { e as createComponent, p as renderHead, q as renderSlot, r as renderTemplate, h as createAstro } from './astro/server_C_XB61DQ.mjs';
import 'piccolore';
import 'clsx';
/* empty css                             */

const $$Astro = createAstro();
const $$Baselayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Baselayout;
  const { title = "Arbre g\xE9n\xE9alogique" } = Astro2.props;
  return renderTemplate`<html lang="fr" data-astro-cid-ugyyqijz> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title>${renderHead()}</head> <body data-astro-cid-ugyyqijz> <header data-astro-cid-ugyyqijz> <h1 data-astro-cid-ugyyqijz>🌳 Arbre généalogique</h1> <nav data-astro-cid-ugyyqijz> <a href="/" data-astro-cid-ugyyqijz>Accueil</a> <a href="/addperson" data-astro-cid-ugyyqijz>Ajouter personne + </a> <a href="/addrelation" data-astro-cid-ugyyqijz>Ajouter relation + </a> <a href="/relations" data-astro-cid-ugyyqijz>Relations</a> </nav> </header> <main data-astro-cid-ugyyqijz> ${renderSlot($$result, $$slots["default"])} </main> <footer data-astro-cid-ugyyqijz> <p data-astro-cid-ugyyqijz>© 2026 - Projet généalogie</p> </footer> </body></html>`;
}, "C:/lacapsule-testsperso/genealogia-astro/src/layouts/Baselayout.astro", void 0);

export { $$Baselayout as $ };

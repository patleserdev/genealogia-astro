import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CHuf9iEa.mjs';
import { manifest } from './manifest_Ct-Jd3kr.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/addperson.astro.mjs');
const _page2 = () => import('./pages/addrelation.astro.mjs');
const _page3 = () => import('./pages/api/persons.astro.mjs');
const _page4 = () => import('./pages/api/relations/_id_.astro.mjs');
const _page5 = () => import('./pages/api/relations.astro.mjs');
const _page6 = () => import('./pages/person/_id_.astro.mjs');
const _page7 = () => import('./pages/relations.astro.mjs');
const _page8 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/addperson.astro", _page1],
    ["src/pages/addrelation.astro", _page2],
    ["src/pages/api/persons.ts", _page3],
    ["src/pages/api/relations/[id].ts", _page4],
    ["src/pages/api/relations.ts", _page5],
    ["src/pages/person/[id].astro", _page6],
    ["src/pages/relations.astro", _page7],
    ["src/pages/index.astro", _page8]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "a23d1141-a51e-462f-a30d-086c5e5b45f8",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };

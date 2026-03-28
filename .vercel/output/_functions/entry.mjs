import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_BBpXMlkx.mjs';
import { manifest } from './manifest_BsQW0j6Z.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/auth/login.astro.mjs');
const _page2 = () => import('./pages/api/auth/logout.astro.mjs');
const _page3 = () => import('./pages/api/auth/register.astro.mjs');
const _page4 = () => import('./pages/api/me/update.astro.mjs');
const _page5 = () => import('./pages/api/me.astro.mjs');
const _page6 = () => import('./pages/api/persons/search.astro.mjs');
const _page7 = () => import('./pages/api/persons/_id_.astro.mjs');
const _page8 = () => import('./pages/api/persons.astro.mjs');
const _page9 = () => import('./pages/api/relations/_id_.astro.mjs');
const _page10 = () => import('./pages/api/relations.astro.mjs');
const _page11 = () => import('./pages/api/tree.astro.mjs');
const _page12 = () => import('./pages/login.astro.mjs');
const _page13 = () => import('./pages/persons/add-with-relations.astro.mjs');
const _page14 = () => import('./pages/persons/new.astro.mjs');
const _page15 = () => import('./pages/persons/_id_.astro.mjs');
const _page16 = () => import('./pages/persons.astro.mjs');
const _page17 = () => import('./pages/profil.astro.mjs');
const _page18 = () => import('./pages/register.astro.mjs');
const _page19 = () => import('./pages/relations/add.astro.mjs');
const _page20 = () => import('./pages/relations/add-quick.astro.mjs');
const _page21 = () => import('./pages/relations.astro.mjs');
const _page22 = () => import('./pages/tree/_id_.astro.mjs');
const _page23 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/auth/login.ts", _page1],
    ["src/pages/api/auth/logout.ts", _page2],
    ["src/pages/api/auth/register.ts", _page3],
    ["src/pages/api/me/update.ts", _page4],
    ["src/pages/api/me.ts", _page5],
    ["src/pages/api/persons/search.ts", _page6],
    ["src/pages/api/persons/[id].ts", _page7],
    ["src/pages/api/persons.ts", _page8],
    ["src/pages/api/relations/[id].ts", _page9],
    ["src/pages/api/relations.ts", _page10],
    ["src/pages/api/tree.ts", _page11],
    ["src/pages/login.astro", _page12],
    ["src/pages/persons/add-with-relations.astro", _page13],
    ["src/pages/persons/new.astro", _page14],
    ["src/pages/persons/[id].astro", _page15],
    ["src/pages/persons.astro", _page16],
    ["src/pages/profil.astro", _page17],
    ["src/pages/register.astro", _page18],
    ["src/pages/relations/add.astro", _page19],
    ["src/pages/relations/add-quick.astro", _page20],
    ["src/pages/relations.astro", _page21],
    ["src/pages/tree/[id].astro", _page22],
    ["src/pages/index.astro", _page23]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "8f802826-8d9d-42da-9677-9a9fccebbd9f",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };

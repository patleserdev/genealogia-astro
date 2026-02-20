import 'piccolore';
import { v as decodeKey } from './chunks/astro/server_C_XB61DQ.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_CWmh9Fju.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/lacapsule-testsperso/genealogia-astro/","cacheDir":"file:///C:/lacapsule-testsperso/genealogia-astro/node_modules/.astro/","outDir":"file:///C:/lacapsule-testsperso/genealogia-astro/dist/","srcDir":"file:///C:/lacapsule-testsperso/genealogia-astro/src/","publicDir":"file:///C:/lacapsule-testsperso/genealogia-astro/public/","buildClientDir":"file:///C:/lacapsule-testsperso/genealogia-astro/dist/client/","buildServerDir":"file:///C:/lacapsule-testsperso/genealogia-astro/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/addperson.B8UEdCER.css"}],"routeData":{"route":"/addperson","isIndex":false,"type":"page","pattern":"^\\/addperson\\/?$","segments":[[{"content":"addperson","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/addperson.astro","pathname":"/addperson","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/addperson.B8UEdCER.css"}],"routeData":{"route":"/addrelation","isIndex":false,"type":"page","pattern":"^\\/addrelation\\/?$","segments":[[{"content":"addrelation","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/addrelation.astro","pathname":"/addrelation","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/persons","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/persons\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"persons","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/persons.ts","pathname":"/api/persons","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/relations/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/relations\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"relations","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/relations/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/relations","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/relations\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"relations","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/relations.ts","pathname":"/api/relations","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/addperson.B8UEdCER.css"}],"routeData":{"route":"/person/[id]","isIndex":false,"type":"page","pattern":"^\\/person\\/([^/]+?)\\/?$","segments":[[{"content":"person","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/person/[id].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/addperson.B8UEdCER.css"}],"routeData":{"route":"/relations","isIndex":false,"type":"page","pattern":"^\\/relations\\/?$","segments":[[{"content":"relations","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/relations.astro","pathname":"/relations","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/addperson.B8UEdCER.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/lacapsule-testsperso/genealogia-astro/src/pages/addperson.astro",{"propagation":"none","containsHead":true}],["C:/lacapsule-testsperso/genealogia-astro/src/pages/addrelation.astro",{"propagation":"none","containsHead":true}],["C:/lacapsule-testsperso/genealogia-astro/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/lacapsule-testsperso/genealogia-astro/src/pages/person/[id].astro",{"propagation":"none","containsHead":true}],["C:/lacapsule-testsperso/genealogia-astro/src/pages/relations.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/addperson@_@astro":"pages/addperson.astro.mjs","\u0000@astro-page:src/pages/addrelation@_@astro":"pages/addrelation.astro.mjs","\u0000@astro-page:src/pages/api/persons@_@ts":"pages/api/persons.astro.mjs","\u0000@astro-page:src/pages/api/relations/[id]@_@ts":"pages/api/relations/_id_.astro.mjs","\u0000@astro-page:src/pages/api/relations@_@ts":"pages/api/relations.astro.mjs","\u0000@astro-page:src/pages/person/[id]@_@astro":"pages/person/_id_.astro.mjs","\u0000@astro-page:src/pages/relations@_@astro":"pages/relations.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_CowZ2aVE.mjs","C:/lacapsule-testsperso/genealogia-astro/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_BPAF66SC.mjs","C:/lacapsule-testsperso/genealogia-astro/src/pages/addrelation.astro?astro&type=script&index=0&lang.ts":"_astro/addrelation.astro_astro_type_script_index_0_lang.BfYxy8HB.js","C:/lacapsule-testsperso/genealogia-astro/src/pages/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.C1z8sWFQ.js","C:/lacapsule-testsperso/genealogia-astro/src/components/DeleteButton.astro?astro&type=script&index=0&lang.ts":"_astro/DeleteButton.astro_astro_type_script_index_0_lang.zjJnjJJ8.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["C:/lacapsule-testsperso/genealogia-astro/src/pages/addrelation.astro?astro&type=script&index=0&lang.ts","const i=document.getElementById(\"relationForm\"),L=document.getElementById(\"type\"),v=document.getElementById(\"parentFields\"),E=document.getElementById(\"conjointFields\"),l=document.getElementById(\"status\"),I=document.getElementById(\"dateFin\"),B=document.getElementById(\"from\"),S=document.getElementById(\"to\"),u=document.getElementById(\"parent1\"),p=document.getElementById(\"parent2\"),m=document.getElementById(\"child\");function f(){L.value===\"CONJOINT\"?(v.classList.add(\"hidden\"),E.classList.remove(\"hidden\")):(v.classList.remove(\"hidden\"),E.classList.add(\"hidden\"))}L.addEventListener(\"change\",f);f();l.addEventListener(\"change\",()=>{I.disabled=l.value===\"ACTIVE\",l.value===\"ACTIVE\"&&(I.value=\"\")});B.addEventListener(\"change\",()=>{Array.from(S.options).forEach(n=>n.disabled=n.value===B.value)});function y(){const n=m.value,t=u.value,o=p.value;Array.from(u.options).forEach(e=>e.disabled=e.value!==\"\"&&(e.value===o||e.value===n)),Array.from(p.options).forEach(e=>e.disabled=e.value!==\"\"&&(e.value===t||e.value===n)),Array.from(m.options).forEach(e=>e.disabled=e.value===t||e.value===o)}u.addEventListener(\"change\",y);p.addEventListener(\"change\",y);m.addEventListener(\"change\",y);i.addEventListener(\"submit\",async n=>{n.preventDefault();const t=new FormData(i),o=t.get(\"type\");try{if(o===\"CONJOINT\"){const e=t.get(\"from\"),s=t.get(\"to\");if(e===s){alert(\"Les deux conjoints doivent être différents !\");return}const a={type:o,from:e,to:s,status:t.get(\"status\")},d=t.get(\"dateDebut\"),c=t.get(\"dateFin\");d&&(a.dateDebut=d),c&&(a.dateFin=c);const r=await fetch(\"/api/relations\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify(a)});if(!r.ok)throw new Error(await r.text())}else{const e=t.get(\"child\"),s=t.get(\"parent1\"),a=t.get(\"parent2\"),d=t.get(\"coupleRelationId\");if(!s&&!a){alert(\"Renseigne au moins un parent !\");return}const c=[s,a].filter(Boolean);for(const r of c){if(r===e){alert(\"Un parent ne peut pas être son propre enfant !\");return}const g={type:\"PARENT\",from:r,to:e};d&&(g.coupleRelationId=d);const h=await fetch(\"/api/relations\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify(g)});if(!h.ok)throw new Error(await h.text())}}alert(\"✅ Relation(s) créée(s) !\"),i.reset(),f()}catch(e){alert(`❌ Erreur : ${e}`)}});"],["C:/lacapsule-testsperso/genealogia-astro/src/pages/index.astro?astro&type=script&index=0&lang.ts","document.querySelectorAll(\".delete-btn\").forEach(e=>{e.addEventListener(\"click\",async()=>{const t=e.getAttribute(\"data-id\"),o=e.getAttribute(\"data-nom\");confirm(`Voulez-vous vraiment supprimer ${o} ?`)&&(await fetch(`/api/persons/${t}`,{method:\"DELETE\"}),window.location.reload())})});"],["C:/lacapsule-testsperso/genealogia-astro/src/components/DeleteButton.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"DOMContentLoaded\",()=>{document.querySelectorAll(\".delete-relation-btn\").forEach(e=>{e.addEventListener(\"click\",async()=>{if(!confirm(\"Voulez-vous vraiment supprimer cette relation ?\"))return;const t=e.dataset.relationId;await fetch(`/api/relations/${t}`,{method:\"DELETE\"}),location.reload()})})});"]],"assets":["/_astro/addperson.B8UEdCER.css","/favicon.ico","/favicon.svg"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"wI7iwzq7aa3/QJI/su/IzdLIiOsArlLCkXJTWPumjOk="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };

import { e as createComponent, m as maybeRenderHead, g as addAttribute, r as renderTemplate, k as renderComponent, o as Fragment, h as createAstro, l as renderScript } from '../../chunks/astro/server_Cr2bBY3R.mjs';
import 'piccolore';
import { $ as $$Baselayout } from '../../chunks/Baselayout_BtxBugC6.mjs';
import { ObjectId } from 'mongodb';
import { d as db, p as persons, r as relations } from '../../chunks/mongo_pJhMhjwv.mjs';
import { f as formatDateFR } from '../../chunks/formatDate_DWbQ-kky.mjs';
/* empty css                                   */
import 'clsx';
import { v as verifyToken } from '../../chunks/auth_C0Ch4QAz.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$3 = createAstro();
const $$FamilyTreeVertical = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$FamilyTreeVertical;
  const { node, parentId } = Astro2.props;
  const CARD_W = 160;
  const CARD_H = 64;
  const SEP_W = 24;
  const PAIR_W = CARD_W * 2 + SEP_W;
  const V_GAP = 80;
  const H_GAP = 32;
  const HUB_GAP = 60;
  const UNION_H_GAP = 48;
  const PADDING = 60;
  function getUnions(n) {
    const out = [];
    const seen = /* @__PURE__ */ new Set();
    for (const g of n.childGroups ?? []) {
      if (g.coParent) seen.add(g.coParent._id);
      out.push({ coParent: g.coParent, children: g.children, isDivorced: g.coParent?.unionStatus === "DIVORCED" });
    }
    if (n.conjoint && !seen.has(n.conjoint._id)) {
      out.push({ coParent: n.conjoint, children: [], isDivorced: n.conjoint.unionStatus === "DIVORCED" });
    }
    return out;
  }
  function unionBlockWidth(u) {
    const pairW = u.coParent ? PAIR_W : CARD_W;
    if (u.children.length === 0) return pairW;
    const childrenW = u.children.reduce((s, c) => s + subtreeWidth(c), 0) + H_GAP * (u.children.length - 1);
    return Math.max(pairW, childrenW);
  }
  function subtreeWidth(n) {
    const unions = getUnions(n);
    if (unions.length === 0) return CARD_W;
    if (unions.length === 1) {
      const ow = unions[0].coParent ? PAIR_W : CARD_W;
      if (unions[0].children.length === 0) return ow;
      const childrenW = unions[0].children.reduce((s, c) => s + subtreeWidth(c), 0) + H_GAP * (unions[0].children.length - 1);
      return Math.max(ow, childrenW);
    }
    const unionsRow = unions.reduce((s, u) => s + unionBlockWidth(u), 0) + UNION_H_GAP * (unions.length - 1);
    return Math.max(CARD_W, unionsRow);
  }
  function layoutTree(n, x = 0, y = 0) {
    const unions = getUnions(n);
    const result = [];
    if (unions.length <= 1) {
      const union = unions[0] ?? null;
      const ow = union?.coParent ? PAIR_W : CARD_W;
      const children = union?.children ?? [];
      if (children.length === 0) {
        result.push({ person: n.person, unions, x, y });
        return result;
      }
      let childrenTotalW = children.reduce((s, c) => s + subtreeWidth(c), 0) + H_GAP * (children.length - 1);
      let currentX = x + Math.max(0, (ow - childrenTotalW) / 2);
      const childLayouts = [];
      for (const c of children) {
        const cl = layoutTree(c, currentX, y + CARD_H + V_GAP);
        childLayouts.push(cl);
        currentX += subtreeWidth(c) + H_GAP;
      }
      const firstX = childLayouts[0][0].x;
      const lastPos = childLayouts[childLayouts.length - 1][0];
      const lastOw = subtreeWidth(lastPos.person);
      const parentX = firstX + (lastPos.x + lastOw - firstX) / 2 - ow / 2;
      result.push({ person: n.person, unions, x: parentX, y });
      result.push(...childLayouts.flat());
      return result;
    }
    const totalUnionsW = unions.reduce((s, u) => s + unionBlockWidth(u), 0) + UNION_H_GAP * (unions.length - 1);
    const hubX = x + totalUnionsW / 2 - CARD_W / 2;
    const unionsRowY = y + CARD_H + HUB_GAP;
    let currentUX = x;
    const unionPairs = [];
    const allChildLayouts = [];
    for (const u of unions) {
      const bw = unionBlockWidth(u);
      const pairW = u.coParent ? PAIR_W : CARD_W;
      const pairX = currentUX + (bw - pairW) / 2;
      unionPairs.push({ union: u, pairX, pairY: unionsRowY });
      if (u.children.length > 0) {
        let childCurrentX = currentUX;
        for (const c of u.children) {
          const cl = layoutTree(c, childCurrentX, unionsRowY + CARD_H + V_GAP);
          allChildLayouts.push(cl);
          childCurrentX += subtreeWidth(c) + H_GAP;
        }
      }
      currentUX += bw + UNION_H_GAP;
    }
    result.push({ person: n.person, unions, x: hubX, y, unionPairs });
    result.push(...allChildLayouts.flat());
    return result;
  }
  function collectLines(n) {
    const lines2 = [];
    for (const g of n.childGroups ?? []) {
      for (const c of g.children) {
        lines2.push({ fromId: n.person._id, toId: c.person._id, coParentId: g.coParent?._id ?? null });
        lines2.push(...collectLines(c));
      }
    }
    return lines2;
  }
  const positions = layoutTree(node);
  const posMap = new Map(positions.map((p) => [p.person._id, p]));
  const lines = collectLines(node);
  const svgW = Math.max(...positions.map((p) => {
    if (p.unionPairs?.length) {
      const last = p.unionPairs[p.unionPairs.length - 1];
      return last.pairX + (last.union.coParent ? PAIR_W : CARD_W);
    }
    const ow = p.unions[0]?.coParent ? PAIR_W : CARD_W;
    return p.x + ow;
  })) + PADDING * 2;
  const svgH = Math.max(...positions.map(
    (p) => p.unionPairs?.length ? p.unionPairs[0].pairY : p.y
  )) + CARD_H + PADDING * 2 + 40;
  const depths = {};
  function computeDepths(n, d = 0) {
    depths[n.person._id] = d;
    for (const g of n.childGroups ?? [])
      for (const c of g.children) computeDepths(c, d + 1);
  }
  computeDepths(node);
  function lineFromX(fromId, coParentId) {
    const p = posMap.get(fromId);
    if (!p) return 0;
    if (!p.unionPairs?.length) {
      const ow = p.unions[0]?.coParent ? PAIR_W : CARD_W;
      return p.x + PADDING + ow / 2;
    }
    const pair = p.unionPairs.find((up) => up.union.coParent?._id === coParentId);
    if (!pair) return p.x + PADDING + CARD_W / 2;
    const pw = pair.union.coParent ? PAIR_W : CARD_W;
    return pair.pairX + PADDING + pw / 2;
  }
  function lineFromY(fromId, coParentId) {
    const p = posMap.get(fromId);
    if (!p) return 0;
    if (!p.unionPairs?.length) return p.y + PADDING + CARD_H;
    const pair = p.unionPairs.find((up) => up.union.coParent?._id === coParentId);
    return (pair?.pairY ?? p.y) + PADDING + CARD_H;
  }
  return renderTemplate`${maybeRenderHead()}<div class="tree-wrapper" data-astro-cid-kb7hcqfw> <div class="tree-scroll" data-astro-cid-kb7hcqfw> <div class="tree-canvas"${addAttribute(`width:${svgW}px;height:${svgH}px;`, "style")} data-astro-cid-kb7hcqfw> ${(() => {
    if (!parentId) return null;
    const root = positions.find((p) => depths[p.person._id] === 0);
    if (!root) return null;
    return renderTemplate`<a${addAttribute(`/tree/${parentId}`, "href")} class="ancestor-btn"${addAttribute(`left:${root.x + PADDING + CARD_W / 2}px;top:${root.y + PADDING - 30}px;transform:translateX(-50%);`, "style")} data-astro-cid-kb7hcqfw>
↑ parent
</a>`;
  })()} <svg${addAttribute(svgW, "width")}${addAttribute(svgH, "height")} class="tree-svg" aria-hidden="true" data-astro-cid-kb7hcqfw> ${lines.map(({ fromId, toId, coParentId }) => {
    const child = posMap.get(toId);
    if (!child) return null;
    const childOw = child.unions[0]?.coParent ? PAIR_W : CARD_W;
    const x1 = lineFromX(fromId, coParentId);
    const y1 = lineFromY(fromId, coParentId);
    const x2 = child.x + PADDING + childOw / 2;
    const y2 = child.y + PADDING;
    const mid = (y1 + y2) / 2;
    return renderTemplate`<path${addAttribute(`M ${x1} ${y1} C ${x1} ${mid}, ${x2} ${mid}, ${x2} ${y2}`, "d")} fill="none" stroke="#94a3b8" stroke-width="1.5" data-astro-cid-kb7hcqfw></path>`;
  })} ${positions.filter((p) => p.unionPairs?.length).map(
    (p) => p.unionPairs.map(({ union, pairX, pairY }) => {
      const hubCx = p.x + PADDING + CARD_W / 2;
      const hubBy = p.y + PADDING + CARD_H;
      const pw = union.coParent ? PAIR_W : CARD_W;
      const px = pairX + PADDING + pw / 2;
      const py = pairY + PADDING;
      const mid = (hubBy + py) / 2;
      return renderTemplate`<path${addAttribute(`M ${hubCx} ${hubBy} C ${hubCx} ${mid}, ${px} ${mid}, ${px} ${py}`, "d")} fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="5 3" data-astro-cid-kb7hcqfw></path>`;
    })
  )} </svg> ${positions.map((p) => {
    const isRoot = depths[p.person._id] === 0;
    const isDeceased = !!p.person.dateDeces;
    if (!p.unionPairs) {
      const union = p.unions[0] ?? null;
      const coParent = union?.coParent ?? null;
      const isDivorced = union?.isDivorced ?? false;
      const cpDeceased = !!coParent?.dateDeces;
      return renderTemplate`<div class="couple-node"${addAttribute(`top:${p.y + PADDING}px;left:${p.x + PADDING}px;`, "style")} data-astro-cid-kb7hcqfw> <a${addAttribute(`/tree/${p.person._id}`, "href")}${addAttribute(["card", isRoot ? "card--root" : "", isDeceased ? "card--deceased" : ""].filter(Boolean).join(" "), "class")}${addAttribute(`width:${CARD_W}px;height:${CARD_H}px;`, "style")} data-astro-cid-kb7hcqfw> <span class="card__prenom" data-astro-cid-kb7hcqfw>${p.person.prenom}</span> <span class="card__nom" data-astro-cid-kb7hcqfw>${p.person.nom.toUpperCase()}</span> ${isDeceased && p.person.dateDeces && renderTemplate`<span class="card__date" data-astro-cid-kb7hcqfw>† ${formatDateFR(p.person.dateDeces)}</span>`} </a> ${coParent && renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "data-astro-cid-kb7hcqfw": true }, { "default": ($$result2) => renderTemplate` <div${addAttribute(`sep${isDivorced ? " sep--divorced" : ""}`, "class")} data-astro-cid-kb7hcqfw>${isDivorced ? "\u2702" : "\u2665"}</div> <a${addAttribute(`/tree/${coParent._id}`, "href")}${addAttribute(["card", "card--conjoint", isDivorced ? "card--divorced" : "", isRoot ? "card--root" : "", cpDeceased ? "card--deceased" : ""].filter(Boolean).join(" "), "class")}${addAttribute(`width:${CARD_W}px;height:${CARD_H}px;`, "style")} data-astro-cid-kb7hcqfw> <span class="card__prenom" data-astro-cid-kb7hcqfw>${coParent.prenom}</span> <span class="card__nom" data-astro-cid-kb7hcqfw>${coParent.nom.toUpperCase()}</span> ${cpDeceased && coParent.dateDeces && renderTemplate`<span class="card__date" data-astro-cid-kb7hcqfw>† ${formatDateFR(coParent.dateDeces)}</span>`} </a> ` })}`} </div>`;
    }
    return renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "data-astro-cid-kb7hcqfw": true }, { "default": ($$result2) => renderTemplate`<div class="couple-node"${addAttribute(`top:${p.y + PADDING}px;left:${p.x + PADDING}px;`, "style")} data-astro-cid-kb7hcqfw> <a${addAttribute(`/tree/${p.person._id}`, "href")}${addAttribute(["card", "card--hub", isRoot ? "card--root" : "", isDeceased ? "card--deceased" : ""].filter(Boolean).join(" "), "class")}${addAttribute(`width:${CARD_W}px;height:${CARD_H}px;`, "style")} data-astro-cid-kb7hcqfw> <span class="card__prenom" data-astro-cid-kb7hcqfw>${p.person.prenom}</span> <span class="card__nom" data-astro-cid-kb7hcqfw>${p.person.nom.toUpperCase()}</span> ${isDeceased && p.person.dateDeces && renderTemplate`<span class="card__date" data-astro-cid-kb7hcqfw>† ${formatDateFR(p.person.dateDeces)}</span>`} </a> </div> ${p.unionPairs.map(({ union, pairX, pairY }) => {
      const cp = union.coParent;
      const isDivorced = union.isDivorced;
      const cpDeceased = !!cp?.dateDeces;
      return renderTemplate`<div class="couple-node"${addAttribute(`top:${pairY + PADDING}px;left:${pairX + PADDING}px;`, "style")} data-astro-cid-kb7hcqfw> <a${addAttribute(`/tree/${p.person._id}`, "href")}${addAttribute(["card", "card--self", isDeceased ? "card--deceased" : ""].filter(Boolean).join(" "), "class")}${addAttribute(`width:${CARD_W}px;height:${CARD_H}px;`, "style")} data-astro-cid-kb7hcqfw> <span class="card__prenom" data-astro-cid-kb7hcqfw>${p.person.prenom}</span> <span class="card__nom" data-astro-cid-kb7hcqfw>${p.person.nom.toUpperCase()}</span> </a> ${cp && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-kb7hcqfw": true }, { "default": ($$result3) => renderTemplate` <div${addAttribute(`sep${isDivorced ? " sep--divorced" : ""}`, "class")} data-astro-cid-kb7hcqfw>${isDivorced ? "\u2702" : "\u2665"}</div> <a${addAttribute(`/tree/${cp._id}`, "href")}${addAttribute(["card", "card--conjoint", isDivorced ? "card--divorced" : "", cpDeceased ? "card--deceased" : ""].filter(Boolean).join(" "), "class")}${addAttribute(`width:${CARD_W}px;height:${CARD_H}px;`, "style")} data-astro-cid-kb7hcqfw> <span class="card__prenom" data-astro-cid-kb7hcqfw>${cp.prenom}</span> <span class="card__nom" data-astro-cid-kb7hcqfw>${cp.nom.toUpperCase()}</span> ${cpDeceased && cp.dateDeces && renderTemplate`<span class="card__date" data-astro-cid-kb7hcqfw>† ${formatDateFR(cp.dateDeces)}</span>`} </a> ` })}`} </div>`;
    })}` })}`;
  })} </div> </div> </div> `;
}, "C:/lacapsule-testsperso/genealogia-astro/src/components/FamilyTreeVertical.astro", void 0);

const $$Astro$2 = createAstro();
const $$FamilyTreeCompact = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$FamilyTreeCompact;
  const { node } = Astro2.props;
  const CARD_WIDTH = 100;
  const CARD_HEIGHT = 44;
  const COUPLE_GAP = 16;
  const COUPLE_WIDTH = CARD_WIDTH * 2 + COUPLE_GAP;
  const V_GAP = 56;
  const H_GAP = 20;
  const PADDING = 60;
  function resolveCoParents(node2) {
    const map = /* @__PURE__ */ new Map();
    function walk(n) {
      if (!n.childGroups || n.childGroups.length === 0) {
        map.set(n.person._id, n.conjoint ?? null);
        return;
      }
      let bestGroup = null;
      for (const group of n.childGroups) {
        if (!bestGroup || group.children.length > bestGroup.children.length) bestGroup = group;
      }
      map.set(n.person._id, bestGroup?.coParent ?? n.conjoint ?? null);
      for (const group of n.childGroups)
        for (const child of group.children) walk(child);
    }
    walk(node2);
    return map;
  }
  function subtreeWidth(node2) {
    const ownWidth = coParentMap.get(node2.person._id) ?? null ? COUPLE_WIDTH : CARD_WIDTH;
    if (!node2.childGroups || node2.childGroups.length === 0) return ownWidth;
    let total = 0, childCount = 0;
    for (const group of node2.childGroups)
      for (const child of group.children) {
        total += subtreeWidth(child);
        childCount++;
      }
    if (childCount === 0) return ownWidth;
    return Math.max(ownWidth, total + H_GAP * (childCount - 1));
  }
  function layoutTree(node2, x = 0, y = 0) {
    if (!node2) return [];
    if (!node2.childGroups || node2.childGroups.length === 0) {
      return [{ person: node2.person, coParent: node2.conjoint ?? null, allChildGroups: [], conjoint: node2.conjoint ?? null, x, y }];
    }
    let childrenTotalWidth = 0, childCount = 0;
    for (const group of node2.childGroups)
      for (const child of group.children) {
        childrenTotalWidth += subtreeWidth(child);
        childCount++;
      }
    if (childCount > 1) childrenTotalWidth += H_GAP * (childCount - 1);
    const ownWidth = coParentMap.get(node2.person._id) ?? null ? COUPLE_WIDTH : CARD_WIDTH;
    const startX = x + Math.max(0, (ownWidth - childrenTotalWidth) / 2);
    const allChildLayouts = [];
    let currentX = startX;
    for (const group of node2.childGroups)
      for (const child of group.children) {
        const cl = layoutTree(child, currentX, y + CARD_HEIGHT + V_GAP);
        allChildLayouts.push(cl);
        currentX += subtreeWidth(child) + H_GAP;
      }
    const firstChildX = allChildLayouts[0][0].x;
    const lastChildX = allChildLayouts[allChildLayouts.length - 1][0].x;
    const lastChildOwnWidth = coParentMap.get(allChildLayouts[allChildLayouts.length - 1][0].person._id) ?? null ? COUPLE_WIDTH : CARD_WIDTH;
    const parentX = firstChildX + (lastChildX + lastChildOwnWidth - firstChildX) / 2 - ownWidth / 2;
    return [
      { person: node2.person, coParent: coParentMap.get(node2.person._id) ?? null, allChildGroups: node2.childGroups, conjoint: node2.conjoint ?? null, x: parentX, y },
      ...allChildLayouts.flat()
    ];
  }
  function generateLineData(node2) {
    let lines = [];
    if (!node2.childGroups) return lines;
    for (const group of node2.childGroups)
      for (const child of group.children) {
        lines.push({ from: node2.person._id, to: child.person._id });
        lines = lines.concat(generateLineData(child));
      }
    return lines;
  }
  const coParentMap = resolveCoParents(node);
  const positions = layoutTree(node);
  const enriched = positions.map((p) => ({
    ...p,
    coParent: coParentMap.get(p.person._id) ?? null,
    allChildGroups: p.allChildGroups ?? [],
    conjoint: p.conjoint ?? null
  }));
  const svgWidth = Math.max(...enriched.map((p) => p.x)) + COUPLE_WIDTH + PADDING * 2;
  const svgHeight = Math.max(...enriched.map((p) => p.y)) + CARD_HEIGHT + PADDING * 2;
  const lineData = generateLineData(node);
  const depths = {};
  function computeDepths(n, d = 0) {
    depths[n.person._id] = d;
    for (const g of n.childGroups || [])
      for (const c of g.children) computeDepths(c, d + 1);
  }
  computeDepths(node);
  const floatingCoParents = [];
  for (const p of enriched) {
    const groupCoParentIds = new Set(p.allChildGroups.map((g) => g.coParent?._id).filter(Boolean));
    const hasExtraConjoint = !!(p.conjoint && !groupCoParentIds.has(p.conjoint._id));
    const totalConjoints = p.allChildGroups.filter((g) => g.coParent).length + (hasExtraConjoint ? 1 : 0);
    if (totalConjoints <= 1) continue;
    for (const group of p.allChildGroups) {
      if (!group.coParent || group.children.length === 0) continue;
      const childPositions = group.children.map((c) => enriched.find((e) => e.person._id === c.person._id)).filter(Boolean);
      if (childPositions.length === 0) continue;
      const leftmost = Math.min(...childPositions.map((c) => c.x));
      const rightmost = Math.max(...childPositions.map((c) => c.x + (c.allChildGroups.length > 0 || c.conjoint ? COUPLE_WIDTH : CARD_WIDTH)));
      floatingCoParents.push({ person: group.coParent, cx: (leftmost + rightmost) / 2 - CARD_WIDTH / 2, cy: p.y });
    }
    if (hasExtraConjoint && p.conjoint)
      floatingCoParents.push({ person: p.conjoint, cx: p.x + CARD_WIDTH + COUPLE_GAP, cy: p.y });
  }
  return renderTemplate`${maybeRenderHead()}<div class="tc-outer" data-astro-cid-x7opil5y> <!-- Toolbar --> <div class="tc-toolbar" data-astro-cid-x7opil5y> <button id="tc-zoom-in" class="tc-btn" title="Zoom +" data-astro-cid-x7opil5y>＋</button> <button id="tc-zoom-out" class="tc-btn" title="Zoom −" data-astro-cid-x7opil5y>－</button> <button id="tc-reset" class="tc-btn" title="Réinitialiser" data-astro-cid-x7opil5y>⌂</button> <span id="tc-zoom-label" class="tc-zoom-label" data-astro-cid-x7opil5y>100%</span> <span class="tc-hint" data-astro-cid-x7opil5y>🖱 molette · glisser pour naviguer</span> </div> <!-- Canvas zoomable --> <div class="tc-viewport" id="tc-viewport" data-astro-cid-x7opil5y> <div class="tc-stage" id="tc-stage" data-astro-cid-x7opil5y> <div class="tc-canvas"${addAttribute(`width:${svgWidth}px;height:${svgHeight}px;`, "style")} data-astro-cid-x7opil5y> <svg${addAttribute(svgWidth, "width")}${addAttribute(svgHeight, "height")} class="tc-svg" aria-hidden="true" data-astro-cid-x7opil5y> ${lineData.map((line) => {
    const parent = enriched.find((p) => p.person._id === line.from);
    const child = enriched.find((p) => p.person._id === line.to);
    if (!parent || !child) return null;
    const pw = parent.coParent ? COUPLE_WIDTH : CARD_WIDTH;
    const cw = child.coParent ? COUPLE_WIDTH : CARD_WIDTH;
    const x1 = parent.x + PADDING + pw / 2;
    const y1 = parent.y + PADDING + CARD_HEIGHT;
    const x2 = child.x + PADDING + cw / 2;
    const y2 = child.y + PADDING;
    const mid = (y1 + y2) / 2;
    return renderTemplate`<path${addAttribute(`M ${x1} ${y1} C ${x1} ${mid}, ${x2} ${mid}, ${x2} ${y2}`, "d")} fill="none" stroke="#d6d3d1" stroke-width="1" data-astro-cid-x7opil5y></path>`;
  })} </svg>  ${enriched.map((p) => {
    const isRoot = depths[p.person._id] === 0;
    const isDeceased = !!p.person.dateDeces;
    const groupCoParentIds = new Set(p.allChildGroups.map((g) => g.coParent?._id).filter(Boolean));
    const hasExtraConjoint = !!(p.conjoint && !groupCoParentIds.has(p.conjoint._id));
    const totalConjoints = p.allChildGroups.filter((g) => g.coParent).length + (hasExtraConjoint ? 1 : 0);
    let inlineConjoint = null;
    if (totalConjoints === 1) {
      if (p.allChildGroups.length === 1 && p.allChildGroups[0].coParent) inlineConjoint = p.allChildGroups[0].coParent;
      else if (p.conjoint) inlineConjoint = p.conjoint;
    }
    const isDivorced = inlineConjoint?.unionStatus === "DIVORCED";
    const isCpDeceased = !!inlineConjoint?.dateDeces;
    return renderTemplate`<div class="tc-couple-node"${addAttribute(`top:${p.y + PADDING}px;left:${p.x + PADDING}px;`, "style")} data-astro-cid-x7opil5y> <a${addAttribute(`/tree/${p.person._id}`, "href")}${addAttribute(`tc-card${isRoot ? " tc-card--root" : ""}${isDeceased ? " tc-card--deceased" : ""}`, "class")}${addAttribute(`width:${CARD_WIDTH}px;height:${CARD_HEIGHT}px;`, "style")} data-astro-cid-x7opil5y> <span class="tc-prenom" data-astro-cid-x7opil5y>${p.person.prenom}</span> <span class="tc-nom" data-astro-cid-x7opil5y>${p.person.nom.toUpperCase()}</span> ${isDeceased && renderTemplate`<span class="tc-cross" data-astro-cid-x7opil5y>✝</span>`} </a> ${inlineConjoint && renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "data-astro-cid-x7opil5y": true }, { "default": ($$result2) => renderTemplate` <div${addAttribute(`tc-sep${isDivorced ? " tc-sep--divorced" : ""}`, "class")} data-astro-cid-x7opil5y> ${isDivorced ? "\u2702" : "\u2665"} </div> <a${addAttribute(`/tree/${inlineConjoint._id}`, "href")}${addAttribute(["tc-card", "tc-card--conjoint", isDivorced ? "tc-card--divorced" : "", isRoot ? "tc-card--root" : "", isCpDeceased ? "tc-card--deceased" : ""].filter(Boolean).join(" "), "class")}${addAttribute(`width:${CARD_WIDTH}px;height:${CARD_HEIGHT}px;`, "style")} data-astro-cid-x7opil5y> <span class="tc-prenom" data-astro-cid-x7opil5y>${inlineConjoint.prenom}</span> <span class="tc-nom" data-astro-cid-x7opil5y>${inlineConjoint.nom.toUpperCase()}</span> ${isCpDeceased && renderTemplate`<span class="tc-cross" data-astro-cid-x7opil5y>✝</span>`} </a> ` })}`} </div>`;
  })}  ${floatingCoParents.map(({ person: cp, cx, cy }) => {
    const isDivorced = cp.unionStatus === "DIVORCED";
    const isCpDeceased = !!cp.dateDeces;
    return renderTemplate`<div class="tc-couple-node"${addAttribute(`top:${cy + PADDING}px;left:${cx + PADDING}px;`, "style")} data-astro-cid-x7opil5y> <a${addAttribute(`/tree/${cp._id}`, "href")}${addAttribute(["tc-card", "tc-card--conjoint", isDivorced ? "tc-card--divorced" : "", isCpDeceased ? "tc-card--deceased" : ""].filter(Boolean).join(" "), "class")}${addAttribute(`width:${CARD_WIDTH}px;height:${CARD_HEIGHT}px;`, "style")} data-astro-cid-x7opil5y> <span class="tc-prenom" data-astro-cid-x7opil5y>${cp.prenom}</span> <span class="tc-nom" data-astro-cid-x7opil5y>${cp.nom.toUpperCase()}</span> ${isCpDeceased && renderTemplate`<span class="tc-cross" data-astro-cid-x7opil5y>✝</span>`} </a> </div>`;
  })} </div> </div> </div> </div>  ${renderScript($$result, "C:/lacapsule-testsperso/genealogia-astro/src/components/FamilyTreeCompact.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/lacapsule-testsperso/genealogia-astro/src/components/FamilyTreeCompact.astro", void 0);

const $$Astro$1 = createAstro();
const $$FamilyTreeGrid = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$FamilyTreeGrid;
  const { node } = Astro2.props;
  function flattenTree(n, gen = 0, seen = /* @__PURE__ */ new Set()) {
    if (seen.has(n.person._id)) return [];
    seen.add(n.person._id);
    const seenCp = /* @__PURE__ */ new Set();
    const conjointNames = [];
    const allCoParents = [];
    for (const g of n.childGroups ?? []) {
      if (g.coParent && !seenCp.has(g.coParent._id)) {
        seenCp.add(g.coParent._id);
        allCoParents.push(g.coParent);
        conjointNames.push({ name: `${g.coParent.prenom} ${g.coParent.nom}`, isDivorced: g.coParent.unionStatus === "DIVORCED" });
      }
    }
    if (n.conjoint && !seenCp.has(n.conjoint._id)) {
      seenCp.add(n.conjoint._id);
      allCoParents.push(n.conjoint);
      conjointNames.push({ name: `${n.conjoint.prenom} ${n.conjoint.nom}`, isDivorced: n.conjoint.unionStatus === "DIVORCED" });
    }
    const allChildren = (n.childGroups ?? []).flatMap((g) => g.children);
    const result = [{
      person: n.person,
      generation: gen,
      conjointNames,
      childNames: allChildren.map((c) => c.person.prenom),
      childCount: allChildren.length,
      isDeceased: !!n.person.dateDeces
    }];
    for (const cp of allCoParents) {
      if (seen.has(cp._id)) continue;
      seen.add(cp._id);
      const sharedChildren = (n.childGroups ?? []).filter((g) => g.coParent?._id === cp._id).flatMap((g) => g.children);
      result.push({
        person: cp,
        generation: gen,
        conjointNames: [{ name: `${n.person.prenom} ${n.person.nom}`, isDivorced: cp.unionStatus === "DIVORCED" }],
        childNames: sharedChildren.map((c) => c.person.prenom),
        childCount: sharedChildren.length,
        isDeceased: !!cp.dateDeces
      });
    }
    for (const g of n.childGroups ?? []) {
      for (const c of g.children) result.push(...flattenTree(c, gen + 1, seen));
    }
    return result;
  }
  const allPersons = flattenTree(node);
  const genMap = /* @__PURE__ */ new Map();
  for (const p of allPersons) {
    if (!genMap.has(p.generation)) genMap.set(p.generation, []);
    genMap.get(p.generation).push(p);
  }
  const generations = [...genMap.entries()].sort((a, b) => a[0] - b[0]);
  const genLabels = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
  function initials(prenom, nom) {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  }
  function avatarColor(prenom) {
    const colors = [
      { bg: "#fef3c7", border: "#fde68a", text: "#92400e" },
      { bg: "#dbeafe", border: "#bfdbfe", text: "#1e40af" },
      { bg: "#d1fae5", border: "#a7f3d0", text: "#065f46" },
      { bg: "#fce7f3", border: "#fbcfe8", text: "#9d174d" },
      { bg: "#ede9fe", border: "#ddd6fe", text: "#5b21b6" },
      { bg: "#ffedd5", border: "#fed7aa", text: "#9a3412" },
      { bg: "#e0f2fe", border: "#bae6fd", text: "#0c4a6e" },
      { bg: "#f0fdf4", border: "#bbf7d0", text: "#14532d" }
    ];
    let h = 0;
    for (let i = 0; i < prenom.length; i++) h = (h * 37 + prenom.charCodeAt(i)) % colors.length;
    return JSON.stringify(colors[h]);
  }
  return renderTemplate`${maybeRenderHead()}<div class="space-y-2"> ${generations.map(([genIdx, persons]) => renderTemplate`<section> <!-- Label génération --> <div class="flex items-center gap-3 mb-3 px-1"> <div class="flex items-center gap-2"> <span class="w-7 h-7 rounded-lg bg-amber-800 flex items-center justify-center text-xs font-semibold text-amber-100 shrink-0"> ${genLabels[genIdx] ?? `G${genIdx + 1}`} </span> <span class="text-xs font-medium text-stone-500 uppercase tracking-wider">
Génération ${genIdx + 1} </span> </div> <div class="flex-1 h-px bg-stone-200"></div> <span class="text-xs text-stone-400">${persons.length} personne${persons.length > 1 ? "s" : ""}</span> </div> <!-- Grille --> <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-6"> ${persons.map(({ person, conjointNames, childNames, childCount, isDeceased }) => {
    const colors = JSON.parse(avatarColor(person.prenom));
    return renderTemplate`<a${addAttribute(`/tree/${person._id}`, "href")}${addAttribute(`group flex flex-col bg-white border rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 no-underline ${isDeceased ? "border-stone-200 bg-stone-50 opacity-75 hover:opacity-100" : "border-stone-200 hover:border-amber-300"}`, "class")}> <!-- Avatar --> <div class="flex items-start justify-between mb-3"> <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 border-2"${addAttribute(`background:${colors.bg}; border-color:${colors.border}; color:${colors.text}`, "style")}> ${isDeceased ? renderTemplate`<span class="text-stone-400 text-base">†</span>` : initials(person.prenom, person.nom)} </div> ${isDeceased && renderTemplate`<span class="text-xs text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded-full">†</span>`} ${childCount > 0 && !isDeceased && renderTemplate`<span class="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full"> ${childCount} </span>`} </div> <!-- Nom --> <div class="mb-2 min-w-0"> <p class="text-xs text-stone-400 truncate leading-tight">${person.prenom}</p> <p${addAttribute(`text-sm font-semibold truncate leading-tight ${isDeceased ? "text-stone-500" : "text-stone-800"}`, "class")}> ${person.nom.toUpperCase()} </p> </div> <!-- Dates --> ${(person.dateNaissance || person.dateDeces) && renderTemplate`<div class="space-y-0.5 mb-2"> ${person.dateNaissance && renderTemplate`<p class="text-xs text-stone-400 flex items-center gap-1 truncate"> <span class="text-stone-300">°</span> ${formatDateFR(person.dateNaissance)} </p>`} ${person.dateDeces && renderTemplate`<p class="text-xs text-stone-400 flex items-center gap-1 truncate"> <span class="text-stone-300">†</span> ${formatDateFR(person.dateDeces)} </p>`} </div>`} <!-- Conjoints --> ${conjointNames.length > 0 && renderTemplate`<div class="mt-auto pt-2 border-t border-stone-100 space-y-1"> ${conjointNames.map((c) => renderTemplate`<p${addAttribute(`text-xs flex items-center gap-1 truncate ${c.isDivorced ? "text-stone-400 line-through" : "text-pink-600"}`, "class")}> <span class="shrink-0">${c.isDivorced ? "\u2702" : "\u2665"}</span> <span class="truncate">${c.name}</span> </p>`)} </div>`} <!-- Enfants --> ${childCount > 0 && renderTemplate`<div${addAttribute(`pt-2 ${conjointNames.length > 0 ? "" : "mt-auto border-t border-stone-100"}`, "class")}> <p class="text-xs text-stone-400 truncate italic">${childNames.join(", ")}</p> </div>`} <!-- Lien hover --> <div class="mt-2 opacity-0 group-hover:opacity-100 transition-opacity"> <span class="text-xs text-amber-700 font-medium">Voir l'arbre →</span> </div> </a>`;
  })} </div> </section>`)} </div>`;
}, "C:/lacapsule-testsperso/genealogia-astro/src/components/FamilyTreeGrid.astro", void 0);

const $$Astro = createAstro();
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const token = Astro2.cookies.get("token")?.value;
  if (!token) return Astro2.redirect("/login");
  let user = null;
  try {
    const payload = verifyToken(token);
    user = await db.collection("users").findOne({ _id: new ObjectId(payload.userId) });
  } catch {
    return Astro2.redirect("/login");
  }
  const { id } = Astro2.params;
  const personId = new ObjectId(id);
  const allPersons = await persons.find({}).toArray();
  const allRelations = await relations.find({}).toArray();
  const personMap = new Map(allPersons.map((p) => [p._id.toString(), p]));
  const parentRelations = allRelations.filter((r) => r.type === "PARENT");
  const conjointRelations = allRelations.filter((r) => r.type === "CONJOINT");
  const childrenMap = /* @__PURE__ */ new Map();
  const parentMap = /* @__PURE__ */ new Map();
  for (const rel of parentRelations) {
    const from = rel.from.toString();
    const to = rel.to.toString();
    const coupleRelationId = rel.coupleRelationId?.toString() ?? null;
    if (!childrenMap.has(from)) childrenMap.set(from, []);
    childrenMap.get(from).push({ childId: to, coupleRelationId });
    if (!parentMap.has(to)) parentMap.set(to, []);
    parentMap.get(to).push(from);
  }
  const coupleMap = /* @__PURE__ */ new Map();
  const conjointMap = /* @__PURE__ */ new Map();
  for (const rel of conjointRelations) {
    const relId = rel._id.toString();
    const from = rel.from.toString();
    const to = rel.to.toString();
    const status = rel.status ?? null;
    coupleMap.set(relId, { personA: from, personB: to, status });
    if (!conjointMap.has(from)) conjointMap.set(from, []);
    conjointMap.get(from).push({ conjointId: to, relationId: relId, status });
    if (!conjointMap.has(to)) conjointMap.set(to, []);
    conjointMap.get(to).push({ conjointId: from, relationId: relId, status });
  }
  function serializePerson(p, unionStatus) {
    return {
      _id: p._id.toString(),
      prenom: p.prenom,
      nom: p.nom,
      sexe: p.sexe ?? null,
      dateNaissance: p.dateNaissance ?? null,
      dateDeces: p.dateDeces ?? null,
      unionStatus: unionStatus ?? null
    };
  }
  function buildTree(rootId, depthUp = 1, depthDown = 2) {
    const visited = /* @__PURE__ */ new Set();
    function buildNode(id2, currentDepthUp, currentDepthDown) {
      if (!personMap.has(id2) || visited.has(id2)) return null;
      visited.add(id2);
      const person = serializePerson(personMap.get(id2));
      const conjointEntries = conjointMap.get(id2) ?? [];
      const conjointEntry = conjointEntries.find((e) => e.status === "ACTIVE") ?? conjointEntries[0] ?? null;
      const conjoint = conjointEntry && personMap.has(conjointEntry.conjointId) ? serializePerson(personMap.get(conjointEntry.conjointId), conjointEntry.status) : null;
      const parents = [];
      if (currentDepthUp > 0 && parentMap.has(id2)) {
        for (const pid of parentMap.get(id2)) {
          const parentNode = buildNode(pid, currentDepthUp - 1, 0);
          if (parentNode) parents.push(parentNode);
        }
      }
      const childrenByCouple = /* @__PURE__ */ new Map();
      if (currentDepthDown > 0) {
        if (childrenMap.has(id2)) {
          for (const { childId, coupleRelationId } of childrenMap.get(id2)) {
            const key = coupleRelationId ?? "__none__";
            if (!childrenByCouple.has(key)) childrenByCouple.set(key, []);
            childrenByCouple.get(key).push(childId);
          }
        }
        for (const entry of conjointEntries) {
          const partnerId = entry.conjointId;
          const relId = entry.relationId;
          if (childrenMap.has(partnerId)) {
            for (const { childId, coupleRelationId } of childrenMap.get(partnerId)) {
              if (coupleRelationId === relId) {
                const key = coupleRelationId;
                if (!childrenByCouple.has(key)) childrenByCouple.set(key, []);
                if (!childrenByCouple.get(key).includes(childId))
                  childrenByCouple.get(key).push(childId);
              }
            }
          }
        }
      }
      const childGroups = [];
      for (const [coupleRelId, childIds] of childrenByCouple) {
        let coParent = null;
        if (coupleRelId !== "__none__" && coupleMap.has(coupleRelId)) {
          const couple = coupleMap.get(coupleRelId);
          const coParentId = couple.personA === id2 ? couple.personB : couple.personA;
          if (personMap.has(coParentId))
            coParent = serializePerson(personMap.get(coParentId), couple.status);
        }
        const children = [];
        for (const cid of childIds) {
          const childNode = buildNode(cid, 0, currentDepthDown - 1);
          if (childNode) children.push(childNode);
        }
        if (children.length > 0) childGroups.push({ coParent, children });
      }
      return { person, conjoint, parents, childGroups };
    }
    return buildNode(rootId, depthUp, depthDown);
  }
  const tree = buildTree(personId.toString(), 1, 2);
  const rootParentIds = parentMap.get(personId.toString()) ?? [];
  const parentId = rootParentIds[0] ?? null;
  const rootPerson = personMap.get(personId.toString());
  const rootName = rootPerson ? `${rootPerson.prenom} ${rootPerson.nom}` : "Arbre";
  return renderTemplate`${renderComponent($$result, "Baselayout", $$Baselayout, { "title": `Arbre \u2014 ${rootName}`, "data-astro-cid-gb4ridqe": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-full px-6 py-6 space-y-5" data-astro-cid-gb4ridqe> <!-- En-tête --> <div class="flex items-center justify-between flex-wrap gap-3" data-astro-cid-gb4ridqe> <div class="flex items-center gap-3" data-astro-cid-gb4ridqe> <a${addAttribute(`/person/${id}`, "href")} class="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 transition-colors" data-astro-cid-gb4ridqe> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-gb4ridqe> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" data-astro-cid-gb4ridqe></path> </svg>
Retour
</a> <div class="w-px h-4 bg-stone-200" data-astro-cid-gb4ridqe></div> <div data-astro-cid-gb4ridqe> <h1 class="text-lg font-semibold text-stone-800 tracking-tight" data-astro-cid-gb4ridqe>${rootName}</h1> <p class="text-xs text-stone-500" data-astro-cid-gb4ridqe>Arbre généalogique</p> </div> </div> <!-- Sélecteur de vue --> <div class="flex items-center gap-1 bg-stone-100 rounded-xl p-1" data-astro-cid-gb4ridqe> <button id="btn-tree" class="view-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all" data-astro-cid-gb4ridqe> <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-gb4ridqe> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h6M3 12h6M3 17h6M13 7l4 5-4 5M17 12H21" data-astro-cid-gb4ridqe></path> </svg>
Arbre
</button> <button id="btn-compact" class="view-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all" data-astro-cid-gb4ridqe> <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-gb4ridqe> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" data-astro-cid-gb4ridqe></path> </svg>
Compact
</button> <button id="btn-grid" class="view-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all" data-astro-cid-gb4ridqe> <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-gb4ridqe> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" data-astro-cid-gb4ridqe></path> </svg>
Grille
</button> </div> </div> <!-- Contenu des vues --> <div id="view-tree" data-astro-cid-gb4ridqe> ${renderComponent($$result2, "FamilyTreeVertical", $$FamilyTreeVertical, { "node": tree, "parentId": parentId, "data-astro-cid-gb4ridqe": true })} </div> <div id="view-compact" class="hidden" data-astro-cid-gb4ridqe> ${renderComponent($$result2, "FamilyTreeCompact", $$FamilyTreeCompact, { "node": tree, "data-astro-cid-gb4ridqe": true })} </div> <div id="view-grid" class="hidden" data-astro-cid-gb4ridqe> ${renderComponent($$result2, "FamilyTreeGrid", $$FamilyTreeGrid, { "node": tree, "data-astro-cid-gb4ridqe": true })} </div> </div> ` })}  ${renderScript($$result, "C:/lacapsule-testsperso/genealogia-astro/src/pages/tree/[id].astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/lacapsule-testsperso/genealogia-astro/src/pages/tree/[id].astro", void 0);

const $$file = "C:/lacapsule-testsperso/genealogia-astro/src/pages/tree/[id].astro";
const $$url = "/tree/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

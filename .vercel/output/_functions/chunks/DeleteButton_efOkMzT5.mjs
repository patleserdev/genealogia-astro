import { e as createComponent, m as maybeRenderHead, g as addAttribute, l as renderScript, r as renderTemplate, h as createAstro } from './astro/server_Cr2bBY3R.mjs';
import 'piccolore';
import 'clsx';

const $$Astro = createAstro();
const $$DeleteButton = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DeleteButton;
  const { id, type, title } = Astro2.props;
  const isDisabled = type ? false : true;
  const isDisabledStyle = "opacity-50 cursor-not-allowed";
  return renderTemplate`${maybeRenderHead()}<button${addAttribute(`delete-${type}-btn px-2 py-1 bg-red-500 text-sm text-white rounded hover:bg-red-600 ${isDisabled ? isDisabledStyle : ""}`, "class")}${addAttribute(id, "data-id")}${addAttribute(isDisabled, "disabled")}>
Supprimer
</button> ${renderScript($$result, "C:/lacapsule-testsperso/genealogia-astro/src/components/DeleteButton.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/lacapsule-testsperso/genealogia-astro/src/components/DeleteButton.astro", void 0);

export { $$DeleteButton as $ };

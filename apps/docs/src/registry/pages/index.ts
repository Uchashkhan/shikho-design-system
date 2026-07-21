import type { ComponentPageConfig } from "./types";

/**
 * Auto-discovers every `ComponentPageConfig` in this directory — adding a new page file here
 * (named `<slug>.tsx`) is enough; nothing else imports or lists these by hand.
 *
 * This is intentionally separate from `docs.meta.ts` discovery (see `../meta-discovery.ts`):
 * a page config is optional per-component rich content, not required metadata. A component with
 * only a `docs.meta.ts` and no matching file here still appears everywhere via the safe fallback
 * page (see `ComponentDetailPage`).
 */
const pageModules = import.meta.glob<{ pageConfig: ComponentPageConfig }>("./*.tsx", {
  eager: true,
});

const pageConfigsBySlug: Record<string, ComponentPageConfig> = {};

for (const [path, mod] of Object.entries(pageModules)) {
  const slug = path.replace(/^\.\//, "").replace(/\.tsx$/, "");
  pageConfigsBySlug[slug] = mod.pageConfig;
}

export function getPageConfig(slug: string): ComponentPageConfig | undefined {
  return pageConfigsBySlug[slug];
}

export * from "./types";

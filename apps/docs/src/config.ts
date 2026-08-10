/** Repository the design system is published from — surfaced as a nav action. */
export const REPO_URL = "https://github.com/Uchashkhan/shikho-design-system";

/**
 * The `docs/` folder is the written documentation; the site itself is the component reference.
 * Shared by the top nav's "Documentation" link and the homepage hero's "Read documentation"
 * button, so both point at the same real destination instead of drifting apart.
 */
export const DOCS_URL = `${REPO_URL}/tree/main/docs`;

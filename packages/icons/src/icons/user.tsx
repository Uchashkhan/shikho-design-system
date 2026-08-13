import { createIcon } from "../create_icon";

/**
 * `user` — a generic filled person glyph (head + shoulders). Unlike every other icon in this
 * package, this one is NOT sourced from a Figma component audit — it was added directly per
 * request as the default `type="icon"` glyph for `Avatar`, which previously had no default
 * content at all (a bare `children` slot). Combines the two shapes from the reference asset
 * (shoulders path + head circle, converted to an equivalent path) into a single `d`; the
 * reference's own light-blue background circle was dropped, since `Avatar`'s `type="icon"` root
 * already draws its own confirmed gradient fill and this glyph sits on top of it. Native viewBox
 * 64 × 64.
 */
export const UserIcon = /* @__PURE__ */ createIcon({
  name: "user",
  viewBox: "0 0 64 64",
  path: "m56.877 50.4748a31.0647 31.0647 0 0 0 -49.7651-.0156 30.9669 30.9669 0 0 0 49.7651.0156z M20 22a12 12 0 1 0 24 0 12 12 0 1 0 -24 0z",
});

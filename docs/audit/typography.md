# Typography Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0"
Frame audited: ` typography - Primary` (node `16065:1645`), within page `🌈 Styles & Foundations` (node `16105:29918`)
Method: `get_variable_defs` via Figma MCP (live desktop selection), cross-checked against `get_metadata` layer names.
Status: **Audit only.** No code, components, or project configuration were generated. No variable or style names were renamed, simplified, or normalized — all names below are verbatim from Figma.

**Scope note:** Only the **Primary** typography system (` typography - Primary`, node `16065:1645`) was inspected. The **Secondary** typography frame (` typography - Secondary Ignore`, node `41850:1143`) was intentionally **not** audited and is out of scope for this document.

---

## 1. Primary typeface

- `font/family/primary` = **"Noto Sans Bengali"** — confirmed, resolved literal.
- A second variable, `font/family/display` = **"Noto Sans Bengali"**, also resolves to the same face, but is not consistently referenced (see §12).

---

## 2. Complete typography scale

15 named scale steps exist in the layer tree under ` typography - Primary`:

`Display 3, Display 2, Display 1, Heading 6, Heading 5, Heading 4, Heading 3, Heading 2, Heading 1, Title 2, Title 1, Body 2, Body 1, Para, Caption 2, Caption 1, OVERLINE`

Each (except where noted in §11) has weight variants named in the layer tree as `normal`, `medium`, `semibold`, `bold` (e.g. `web / font_primary / display 3 / normal`).

---

## 3–6. Font sizes, line heights, letter spacing, and weight variants (confirmed)

| Style | Size (px) | Line height (px) | Letter spacing | Confirmed weight composites |
|---|---|---|---|---|
| Display 3 | 104 (`font/size/display_3`) | 112 (`font/line_height/display_3`) | −0.8 (`font/letter_spacing/sm`) | Medium 500, Semibold 600, Bold 700 |
| Display 2 | 88 (`font/size/display_2`) | 96 (`font/line_height/display_2`) | −0.8 (`sm`) | Medium, Semibold, Bold |
| Display 1 | 76 (`font/size/display_1`) | 88 (`font/line_height/display_1`) | −0.8 (`sm`) | Medium, Semibold, Bold |
| Heading 6 | 64 (`font/size/heading_6`) | 72 (`font/line_height/heading_6`) | −0.8 (`sm`) | Medium, Semibold, Bold |
| Heading 5 | 52 (`font/size/heading_5`) | 64 (`font/line_height/heading_5`) | −0.8 (`sm`) | Medium, Semibold, Bold |
| Heading 4 | 40 (`font/size/heading_4`) | 48 (`font/line_height/heading_4`) | −0.8 (`sm`) | Medium, Semibold, Bold |
| Heading 3 | 32 (`font/size/heading_3`) | 40 (`font/line_height/heading_3`) | 0 (`font/letter_spacing/none`) | Medium, Semibold, Bold |
| Heading 2 | 26 (`font/size/heading_2`) | 32 (`font/line_height/heading_2`) | 0 (`none`) | Medium, Semibold, Bold |
| Heading 1 | 22 (`font/size/heading_1`) | 32 (`font/line_height/heading_1`) | 0 (`none`) | Medium, Semibold, Bold |
| Title 2 | 18 (`font/size/title_2`) | 24 (`font/line_height/title_2`) | 0 (`none`) | Medium, Semibold, Bold |
| Title 1 | 15 (`font/size/title_1`) | 24 (`font/line_height/title_1`) | 0 (`none`) | Medium, Semibold, Bold |
| Body 1 | 13 (`font/size/body_1`) | 20 (borrows `font/line_height/para` — see §9) | 0 (`none`) | Regular 400, Medium 500, Semibold 600, Bold 700 |
| Caption 2 | 12 (`font/size/caption_2`) | 16 (`font/line_height/caption_2`) | 0 (`none`) | Regular, Medium, Semibold, Bold |
| Caption 1 | 11 (`font/size/caption_1`) | 16 (`font/line_height/caption_1`) | 0 (`none`) | Regular, Medium, Semibold, Bold |
| Overline | 11 (`font/size/overline`) | 16 (`font/line_height/overline`) | **not resolved — see §11** | **not resolved — see §11** |
| Body 2 | 15 (`font/size/body_2`) | 24 (`font/line_height/body_2`) | **not resolved — see §11** | **not resolved — see §11** |
| Para | **no dedicated size variable found — see §11** | 20 (`font/line_height/para`) | **not resolved — see §11** | **not resolved — see §11** |

**Confirmed pattern:** Display 3/2/1 and Heading 6/5/4 use tight tracking (`sm`, −0.8); Heading 3 and every step smaller use `none` (0). This is a clean, confirmed threshold, not an inference.

---

## 7. Primitive variable names

```
font/family/primary          = "Noto Sans Bengali"
font/family/display           = "Noto Sans Bengali"

font/size/display_3            = 104     font/line_height/display_3 = 112
font/size/display_2            = 88      font/line_height/display_2 = 96
font/size/display_1            = 76      font/line_height/display_1 = 88
font/size/heading_6            = 64      font/line_height/heading_6 = 72
font/size/heading_5            = 52      font/line_height/heading_5 = 64
font/size/heading_4            = 40      font/line_height/heading_4 = 48
font/size/heading_3            = 32      font/line_height/heading_3 = 40
font/size/heading_2            = 26      font/line_height/heading_2 = 32
font/size/heading_1            = 22      font/line_height/heading_1 = 32
font/size/title_2              = 18      font/line_height/title_2   = 24
font/size/title_1              = 15      font/line_height/title_1   = 24
font/size/body_1               = 13      font/line_height/para      = 20  (shared, see §9)
font/size/body_2               = 15      font/line_height/body_2    = 24
font/size/caption_2            = 12      font/line_height/caption_2 = 16
font/size/caption_1            = 11      font/line_height/caption_1 = 16
font/size/overline             = 11      font/line_height/overline  = 16

font/letter_spacing/none       = 0
font/letter_spacing/sm         = -0.800000011920929

font/weight/default/normal     = 400
font/weight/default/medium     = 500
font/weight/default/semibold   = 600
font/weight/default/bold       = 700
font/weight/display/medium     = 500
font/weight/display/bold       = 800   ← distinct from font/weight/default/bold (700); see §12
```

---

## 8. Composite typography token names

Two composite namespace prefixes were found, both instances of a `Font(...)` composite type:

- `web/Title/{size} {Weight}` — used for Display, Heading, and Title tiers.
- `web/Body/{size} {Weight}` — used for the Body 1 / Caption 2 / Caption 1 tier.

Confirmed composite tokens (verbatim names):

```
web/Title/104 Medium, web/Title/104 Semibold, web/Title/104 Bold
web/Title/88 Medium,  web/Title/88 Semibold,  web/Title/88 Bold
web/Title/76 Medium,  web/Title/76 Semibold,  web/Title/76 Bold
web/Title/64 Medium,  web/Title/64 Semibold,  web/Title/64 Bold
web/Title/52 Medium,  web/Title/52 Semibold,  web/Title/52 Bold
web/Title/40 Medium,  web/Title/40 Semibold,  web/Title/40 Bold
web/Title/32 Medium,  web/Title/32 Semibold,  web/Title/32 Bold
web/Title/26 Medium,  web/Title/26 Semibold,  web/Title/26 Bold
web/Title/22 Medium,  web/Title/22 Semibold,  web/Title/22 Bold
web/Title/18 Medium,  web/Title/18 Semibold,  web/Title/18 Bold
web/Title/15 Medium,  web/Title/15 Semibold,  web/Title/15 Bold
web/Title/13 Medium,  web/Title/13 Semibold,  web/Title/13 Bold
web/Body/13 Regular,  web/Body/13 Medium,     web/Body/13 Semibold, web/Body/13 Bold
web/Body/12 Regular,  web/Body/12 Medium,     web/Body/12 Semibold, web/Body/12 Bold
web/Body/11 Regular,  web/Body/11 Medium,     web/Body/11 Semibold, web/Body/11 Bold
```

Example, verbatim from the export:
```
web/Title/22 Semibold = Font(family: "Noto Sans Bengali", style: SemiBold,
  size: font/size/heading_1, weight: 600,
  lineHeight: font/line_height/heading_1, letterSpacing: font/letter_spacing/none)
```

---

## 9. Semantic and alias relationships

- Every composite (`web/Title/*`, `web/Body/*`) is a genuine Figma alias: its `size`, `lineHeight`, and `letterSpacing` fields reference other variable *names* rather than literal numbers — confirmed because those same variables independently resolve to literals elsewhere in the same export (e.g. `font/size/heading_1` = `22` appears both standalone and as a reference inside the composite).
- **Body 1 borrows `font/line_height/para`** rather than having its own `font/line_height/body_1` variable — no such variable exists in the export. This ties "Para" and "Body 1" together at the token level even though they are separate named scale steps in the layer tree.
- **Caption 1 (11/16) and Overline (11/16) resolve to numerically identical size/line-height** but are backed by two entirely separate variable pairs (`caption_1` vs `overline`) rather than one shared token.
- `web/Title/13 *` and `web/Body/13 *` are **fully duplicate composites** at the value level — same family, `font/size/body_1`, weight, `font/line_height/para`, and letter spacing, for Medium, Semibold, and Bold alike (see §10).

---

## 10. Confirmed duplicates

- **`web/Title/13 Medium` ≡ `web/Body/13 Medium`**, **`web/Title/13 Semibold` ≡ `web/Body/13 Semibold`**, **`web/Title/13 Bold` ≡ `web/Body/13 Bold`** — three pairs of composite tokens with identical resolved values (family, size, weight, line height, letter spacing) under two different naming prefixes.
- **Caption 1 and Overline share identical resolved size (11) and line height (16)** despite being distinct named variables (`font/size/caption_1` / `font/line_height/caption_1` vs `font/size/overline` / `font/line_height/overline`) — a value-level duplication, not a name-level one.

---

## 11. Missing or unresolved styles

- **No "Normal"/400-weight composite exists for any Display, Heading, or Title tier**, even though the layer tree contains a "normal" weight text layer for every one of those scale steps (e.g. `web / font_primary / display 3 / normal`). Only the Body 1 / Caption 2 / Caption 1 tier has a resolvable 400-weight composite, and there it is named **"Regular"**, not "Normal."
- **`Body 2` has no resolvable composite Font token at all** — only the bare primitives `font/size/body_2` (15) and `font/line_height/body_2` (24) were retrieved. No Medium/Semibold/Bold/Regular composite, and no letter-spacing value.
- **`Overline` has no resolvable composite Font token at all** — only `font/size/overline` (11) and `font/line_height/overline` (16) were retrieved. No weight variant or letter-spacing value resolved.
- **`Para` has no dedicated font-size variable** — only `font/line_height/para` (20) was found. Its size is inferred solely by association (Body 1 borrows this same line-height token), not confirmed directly.
- **Text case / decoration:** no textCase or text-decoration variable was retrieved for any style. The `OVERLINE` layer name appears capitalized in the file, suggesting an uppercase transform is applied — **this is an inference from the layer name, not a confirmed Figma property or variable.**

---

## 12. Naming and binding inconsistencies

- **Broken/unresolved alias in `web/Title/104 Semibold`:** its `family` field is the literal quoted string `"font/family/display"` instead of resolving to `"Noto Sans Bengali"` the way every other composite does (compare `web/Title/104 Medium`, which resolves family correctly to `"Noto Sans Bengali"`). This entry appears miswired relative to its siblings.
- **Two parallel weight scales with diverging Bold values:** `font/weight/default/bold` = `700` vs. `font/weight/display/bold` = `800`. The only Bold composite touching the display tier in this export (`web/Title/104 Bold`) uses a **literal `weight: 700`**, not the `font/weight/display/bold` (800) variable — so `font/weight/display/bold` does not appear to be consumed anywhere in the audited subtree.
- **"Normal" vs. "Regular" naming mismatch:** the layer tree uniformly uses lowercase "normal" for the 400-weight variant across all scale steps, but the one tier that does have a resolvable 400-weight composite (`web/Body/13/12/11 Regular`) names it "Regular" instead.
- **Two composite namespace prefixes (`web/Title/*` and `web/Body/*`) overlap** at the 13px step with identical resolved values (see §10), with no clear rule surfaced for why both exist.

---

## 13. Information that could not be confirmed

- Whether `font/family/display` is meant to be a distinct display-only variable or a duplicate/alias of `font/family/primary` — both currently resolve to `"Noto Sans Bengali"`, but the broken reference in `web/Title/104 Semibold` (§12) prevents confirming intended usage.
- The intended consumer(s) of `font/weight/display/bold` (800) — not observed bound to any composite in this subtree.
- Letter spacing values for `Body 2`, `Overline`, and `Para` — no variable resolved for any of the three.
- Weight variants (Medium/Semibold/Bold/Regular) for `Body 2`, `Overline`, and `Para` — none resolved.
- Whether the "normal"/400 weight layers seen throughout the layer tree are backed by variables at all, or are hardcoded directly on the text node — `get_variable_defs` only surfaces bound variables, so their absence here does not conclusively prove no binding exists, only that none was retrieved.
- Any Variable Collection name or Mode (e.g. Light/Dark, Web/Mobile) for these typography variables — `get_variable_defs` returns a flat name→value map with no collection/mode metadata, consistent with the same limitation noted in the prior color audit.

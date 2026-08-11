# Color Audit — Shikho Design System (V 3.0)

**Source:** Figma file `BF4qXwajxsZPdGmweabCJw` — "Shikho Design System — V 3.0"
Frame audited: `Colors` (node `16074:72590`), within page `🌈 Styles & Foundations` (node `16105:29918`)
Method: `get_variable_defs` via Figma MCP (live desktop selection), cross-checked against `get_metadata` layer names.
Status: **Audit only.** No code, components, tokens, or config were generated. No variable names were renamed or normalized — all names below are verbatim from Figma.

---

## 1. Primitive color ramps

All ramps use the same 11-step scale: `50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950`.

### `Color/primary`
| Step | Hex |
|---|---|
| 50 | `#f7fbff` |
| 100 | `#edf6ff` |
| 200 | `#d5e7ff` |
| 300 | `#bad5ff` |
| 400 | `#85a4ff` |
| 500 | `#5468ff` |
| 600 | `#3b4ee3` |
| 700 | `#303ebf` |
| 800 | `#1e2b99` |
| 900 | `#111973` |
| 950 | `#0a1053` |

### `Color/Secondary`
| Step | Hex |
|---|---|
| 50 | `#fcf0fa` |
| 100 | `#fce3f7` |
| 200 | `#f7bbe9` |
| 300 | `#f681d7` |
| 400 | `#ea42b2` |
| 500 | `#e2008d` |
| 600 | `#cc0177` |
| 700 | `#ac005b` |
| 800 | `#870044` |
| 900 | `#66002e` |
| 950 | `#45001f` |

### `Color/Shikho AI`
| Step | Hex |
|---|---|
| 50 | `#f2e6fa` |
| 100 | `#dabff2` |
| 200 | `#c394e8` |
| 300 | `#b771e8` |
| 400 | `#8f32cb` |
| 500 | `#7c15b4` |
| 600 | `#6e129e` |
| 700 | `#5d0f85` |
| 800 | `#4b0c6d` |
| 900 | `#390956` |
| 950 | `#28063f` |

### `Color/secondary_2`
| Step | Hex |
|---|---|
| 50 | `#fff4f0` |
| 100 | `#ffe7dd` |
| 200 | `#ffc0a6` |
| 300 | `#ff9e77` |
| 400 | `#ff6a2f` |
| 500 | `#fa4a04` |
| 600 | `#dc4407` |
| 700 | `#af371a` |
| 800 | `#812812` |
| 900 | `#41180e` |
| 950 | `#1a0b08` |

**Note:** four brand ramps coexist (`primary`, `Secondary`, `Shikho AI`, `secondary_2`). Capitalization is inconsistent between them as stored in Figma (`Color/Secondary` vs `Color/secondary_2`) — preserved as-is, not normalized.

---

## 2. Functional colors

### `Color/info`
| Step | Hex |
|---|---|
| 50 | `#f1f8fe` |
| 100 | `#deeffd` |
| 200 | `#bcdffa` |
| 300 | `#92cbf7` |
| 400 | `#59b0f3` |
| 500 | `#118be8` |
| 600 | `#1080d6` |
| 700 | `#0e6fb9` |
| 800 | `#0b5b98` |
| 900 | `#08416d` |
| 950 | `#001d38` |

### `Color/success`
| Step | Hex |
|---|---|
| 50 | `#e8fbe5` |
| 100 | `#d4f7cf` |
| 200 | `#a9ef9f` |
| 300 | `#7fe76f` |
| 400 | `#50df3a` |
| 500 | `#35c220` |
| 600 | `#2a9919` |
| 700 | `#217613` |
| 800 | `#164f0d` |
| 900 | `#0d3107` |
| 950 | `#082005` |

### `Color/danger`
| Step | Hex |
|---|---|
| 50 | `#feecec` |
| 100 | `#fcd9d9` |
| 200 | `#f9b3b3` |
| 300 | `#f68989` |
| 400 | `#f36363` |
| 500 | `#f03d3d` |
| 600 | `#e92020` |
| 700 | `#a60d0d` |
| 800 | `#720909` |
| 900 | `#4a0606` |
| 950 | `#240000` |

### `Color/warning`
| Step | Hex |
|---|---|
| 50 | `#fff8e6` |
| 100 | `#fef2cd` |
| 200 | `#fee59a` |
| 300 | `#fdd868` |
| 400 | `#fdcb35` |
| 500 | `#fcbf04` |
| 600 | `#ca9802` |
| 700 | `#977202` |
| 800 | `#654c01` |
| 900 | `#4a3902` |
| 950 | `#2d2000` |

Also present in this subtree: `Text/Warning 500` = `#fcbf04` (semantic alias, same value as `Color/warning/500`).

---

## 3. Gray and dark colors

### `Color/gray`
| Step | Hex |
|---|---|
| 50 | `#f9f9fa` |
| 100 | `#f4f4f6` |
| 200 | `#ebecf0` |
| 300 | `#dddfe4` |
| 400 | `#c3c6cc` |
| 500 | `#afb3bb` |
| 600 | `#8c929c` |
| 700 | `#5b616d` |
| 800 | `#414651` |
| 900 | `#222732` |
| 950 | `#0a0c11` |

### `Color/vanilla_gray`
| Step | Hex |
|---|---|
| 50 | `#fcfbf8` |
| 100 | `#f6f4ef` |
| 200 | `#f2f1ea` |
| 300 | `#e9e8dd` |
| 400 | `#dbdcd0` |
| 500 | `#b4b6ab` |
| 600 | `#939587` |
| 700 | `#5d6054` |
| 800 | `#484b40` |
| 900 | `#1f221b` |
| 950 | `#10110d` |

### `Color/dark`
| Step | Hex |
|---|---|
| 50 | `#f8f8f8` |
| 100 | `#f4f4f4` |
| 200 | `#eeeeee` |
| 300 | `#e1e1e1` |
| 400 | `#c7c7c7` |
| 500 | `#7d7d7d` |
| 600 | `#2d2d2d` |
| 700 | `#212121` |
| 800 | `#171717` |
| 900 | `#111111` |
| 950 | `#070707` |

---

## 4. Transparent black and white colors

`Color/black/*` and `Color/white/*` use the same 12-step scale (`50…950`) but represent **opacity ramps**, not hue ramps. Values below are exact 8-digit hex as stored in Figma, with decoded RGBA alpha.

### `Color/black`
| Step | Hex | RGBA | Actual opacity |
|---|---|---|---|
| 50 | `#0000000a` | `rgba(0,0,0,0.039)` | 3.9% |
| 100 | `#00000012` | `rgba(0,0,0,0.071)` | 7.1% |
| 150 | `#0000001f` | `rgba(0,0,0,0.122)` | 12.2% |
| 200 | `#00000029` | `rgba(0,0,0,0.161)` | 16.1% |
| 300 | `#0000003d` | `rgba(0,0,0,0.239)` | 23.9% |
| 400 | `#00000052` | `rgba(0,0,0,0.322)` | 32.2% |
| 500 | `#0000007a` | `rgba(0,0,0,0.478)` | 47.8% |
| 600 | `#0000008f` | `rgba(0,0,0,0.561)` | 56.1% |
| 700 | `#000000a3` | `rgba(0,0,0,0.639)` | 63.9% |
| 800 | `#000000b8` | `rgba(0,0,0,0.722)` | 72.2% |
| 900 | `#000000e0` | `rgba(0,0,0,0.878)` | 87.8% |
| 950 | `#000000` | `rgba(0,0,0,1)` | 100% (opaque) |

### `Color/white`
| Step | Hex | RGBA | Actual opacity |
|---|---|---|---|
| 50 | `#ffffff0a` | `rgba(255,255,255,0.039)` | 3.9% |
| 100 | `#ffffff12` | `rgba(255,255,255,0.071)` | 7.1% |
| 150 | `#ffffff1f` | `rgba(255,255,255,0.122)` | 12.2% |
| 200 | `#ffffff29` | `rgba(255,255,255,0.161)` | 16.1% |
| 300 | `#ffffff3d` | `rgba(255,255,255,0.239)` | 23.9% |
| 400 | `#ffffff52` | `rgba(255,255,255,0.322)` | 32.2% |
| 500 | `#ffffff7a` | `rgba(255,255,255,0.478)` | 47.8% |
| 600 | `#ffffff8f` | `rgba(255,255,255,0.561)` | 56.1% |
| 700 | `#ffffffa3` | `rgba(255,255,255,0.639)` | 63.9% |
| 800 | `#ffffffb8` | `rgba(255,255,255,0.722)` | 72.2% |
| 900 | `#ffffffe0` | `rgba(255,255,255,0.878)` | 87.8% |
| 950 | `#ffffff` | `rgba(255,255,255,1)` | 100% (opaque) |

### Other transparent tokens
| Variable | Hex | RGBA |
|---|---|---|
| `transparent_white` | `#ffffff00` | `rgba(255,255,255,0)` |

**Naming inconsistency (flagged, not corrected):** the *semantic/instance* layer names seen in the layer tree for this ramp (e.g. `color/black/4`, `color/black/7`, `color/black/12` … `color/black/100`) label opacity as a rounded percentage, while the underlying *primitive variable* steps use an unrelated numbering scheme (`50…950`). E.g. the layer labeled "Black 7" (~7%) resolves to primitive step `Color/black/100`, not step `7`. These two numbering systems should not be assumed to correspond 1:1.

---

## 5. Subject colors that were successfully retrieved

Each subject uses a `Main / Dark / Light` triad (Figma's own spec sheet, see below, labels these "Regular / Dark / Light" — a naming inconsistency, flagged not corrected, same treatment as the black/white ramp note in §4). Originally, **only 5 of the ~35 subjects visible in the layer tree returned bound variables** via `get_variable_defs`.

**Superseded 2026-08-11.** The user supplied a direct link to a second, full spec-sheet frame — `color/neutrals` (node `64529:21195`), same file — that renders every subject as a labeled card with its hex printed as visible text, independent of whether the fill is a bound variable. `get_design_context` was run on each of its 32 "Cards" sub-frames, resolving all 32 subjects named in the original layer tree (the 27 that had previously failed to resolve, plus the 5 already known — all 5 came back byte-identical, cross-confirming both methods).

**3 swatches had a printed label that did not match their own rendered fill** — evidently a stale copy-pasted text layer left over from duplicating another subject's card. The table below uses the actual rendered fill in every case (confirmed by reading the Tailwind `bg-[...]` value the design-to-code tool emits, which reflects the real computed background, not the text annotation):

| Subject | Fill shown | Label printed | Used |
|---|---|---|---|
| Chemistry / Light | `#dff6ff` | `#fdeaee` (Bengali's light) | `#dff6ff` |
| Economics / Light | `#e2f6fd` | `#fce5fa` (Business Studies') | `#e2f6fd` |
| Psychology / Light | `#ffece4` | `#f7f4dc` (Sociology's) | `#ffece4` |
| General Knowledge / Regular | `#ff5165` | `#ffe6f4` (its own Light) | `#ff5165` (already matched the original 5-subject audit) |

| Subject | Main | Dark | Light |
|---|---|---|---|
| Bengali | `#e74d4f` | `#c42325` | `#fdeaee` |
| English | `#30c4d8` | `#1cb0c4` | `#e0f7fa` |
| Physics | `#6070e9` | `#4757d0` | `#eaebfc` |
| Chemistry | `#39bcf7` | `#21a4ee` | `#dff6ff` |
| Biology | `#3bc78a` | `#29b578` | `#e6faef` |
| General Math | `#ff7b33` | `#ec6820` | `#fff8e0` |
| Higher Math | `#9736e3` | `#8322cf` | `#f2e5fb` |
| General Science | `#5f9573` | `#4b815f` | `#e5f2ec` |
| ICT | `#43d1b9` | `#2fbda5` | `#e1f7f4` |
| Geography | `#5897e9` | `#5b8bca` | `#e6f2fc` |
| Business Studies | `#e95ce7` | `#d84bd6` | `#fce5fa` |
| Finance | `#ed4c67` | `#d93853` | `#fce5ed` |
| Economics | `#3492ac` | `#207e98` | `#e2f6fd` |
| History | `#357969` | `#2a6e5b` | `#e2f2f0` |
| Accounting | `#f29f38` | `#e39029` | `#fef2e2` |
| Statistics | `#7467eb` | `#6053d7` | `#eceafd` |
| Islam & Noitik… *(verbatim Figma layer name, truncated with an ellipsis in-source)* | `#397077` | `#255c63` | `#ddf8fb` |
| Marketing (বিপণন) | `#f56c9e` | `#e1588a` | `#fce6ee` |
| Civics (পৌরনীতি) | `#22a6b3` | `#0e929f` | `#ddf2f4` |
| Logic (যুক্তি বিদ্যা) | `#ac3095` | `#981c81` | `#f5e6f1` |
| Business Org. & Management | `#3498db` | `#2185c8` | `#dff2ff` |
| Production Management & Marketing | `#407093` | `#2f5f82` | `#e3f0fa` |
| Business Math | `#6b51ff` | `#4f37d5` | `#eae6ff` |
| Agriculture | `#7acb4e` | `#69b143` | `#ecf9e5` |
| Sociology | `#bfb03f` | `#a5972e` | `#f7f4dc` |
| Social Work | `#cb4e8f` | `#b2457d` | `#fbe8f1` |
| Psychology | `#bf643f` | `#a65231` | `#ffece4` |
| Bangladesh & Global Studies | `#c07129` | `#54210d` | `#f7deba` |
| General Knowledge | `#ff5165` | `#c70017` | `#ffe6f4` |
| Spoken English | `#5c84d9` | `#234796` | `#e2e9f8` |
| Practical AI | `#e46c67` | `#b2433e` | `#f8d7d5` |
| Quarter Final Exam | `#ff934a` | `#d96e25` | `#fff4e3` |

All 32 now exported from `@shikho/tokens` as `subjectColor` and shown on the docs site's Colors foundation page. The original audit's "and others" phrasing implies up to ~3 more subjects may exist that were never named in any layer tree at all — those remain a genuine unknown, not stubbed.

---

## 6. Semantic color relationships

A semantic naming layer sits on top of the primitive `Color/*` ramps. Confirmed equivalences (same resolved hex value, verified from the variable export, not assumed):

| Semantic name | Value | Equivalent primitive |
|---|---|---|
| `Text/Gray 950` | `#0a0c11` | `Color/gray/950` |
| `Text/Gray 700` | `#5b616d` | `Color/gray/700` |
| `Text/Gray 600` | `#8c929c` | `Color/gray/600` |
| `outline/Gray 200` | `#ebecf0` | `Color/gray/200` |
| `outline/Gray 100` | `#f4f4f6` | `Color/gray/100` |
| `elevation/Black 50` | `#0000000a` | `Color/black/50` |
| `neutral_transparent_Black/Black 7` | `#00000012` | `Color/black/100` |
| `Text/Warning 500` | `#fcbf04` | `Color/warning/500` |
| `Text/black` | `#000000` | — (literal, not confirmed aliased to `Color/black/950`) |
| `Text/White 950` | `#ffffff` | — (literal, not confirmed aliased to `Color/white/950`) |
| `Text/inverse_white_neutral` | `#000000` | — (literal) |

**Composite tokens preserve unresolved alias references** rather than flattening to literals. Examples pulled directly from the export (verbatim):

```
web/Title/22 Semibold = Font(family: "Noto Sans Bengali", style: SemiBold,
  size: font/size/heading_1, weight: 600,
  lineHeight: font/line_height/heading_1, letterSpacing: font/letter_spacing/none)

secondary_button_effect =
  Effect(type: INNER_SHADOW, color: neutral_transparent_Black/Black 7, offset: (0, -1), radius: 3, spread: -2);
  Effect(type: INNER_SHADOW, color: Color/white/50, offset: (0, 1), radius: 3, spread: -2);
  Effect(type: DROP_SHADOW, color: elevation/Black 50, offset: (0, 3), radius: 3, spread: -1.5);
  Effect(type: DROP_SHADOW, color: elevation/Black 50, offset: (0, 1), radius: 1, spread: -0.5)
```

Here `size:`, `lineHeight:`, and `color:` reference variable *names*, not resolved values — even though those same variables resolve to literals elsewhere in the same export (`font/size/heading_1 = 22`). This confirms Figma stores these as true variable aliases, not duplicated literals.

---

## 7. Gradient tokens that exist but could not be resolved

The following variables exist (name confirmed via `get_variable_defs`) but each resolved to an **empty string** — the tool cannot flatten `GRADIENT`-type variables to a scalar value:

- `Gradient/G1`
- `Gradient/G2`
- `Gradient/G3`
- `Gradient/G4`
- `Gradient/G5`
- `Gradient/G6`

No stop colors, stop positions, or angle data were retrievable for any of these. A screenshot of 6 unlabeled swatch rectangles (`Rectangle 1, 2, 4, 7, 8, 10`) was seen in the frame, but stop-level color data was not extracted (visual estimation was intentionally not substituted for exact values, per audit rules).

---

## 8. Missing or inconsistent variable usage

- **Subject Colors coverage gap — resolved 2026-08-11 for named subjects:** the layer tree originally listed ~35 subject names, of which only 5 returned bound variables via `get_variable_defs`. All 32 named subjects (the original 5 plus 27 more) are now resolved via a second spec-sheet frame (§5) that renders every subject's hex as visible text, independent of variable binding. The "and others" phrasing in the original layer-tree pass implies up to ~3 more subjects may exist with no name captured anywhere — those remain unconfirmed and are not stubbed.
- **Inconsistent capitalization/naming across brand ramps:** `Color/primary` (lowercase) vs. `Color/Secondary` (capitalized) vs. `Color/secondary_2` (lowercase + suffix) vs. `Color/Shikho AI` (spaced, capitalized) — four different naming conventions for what are conceptually equivalent "brand ramp" tokens. Not corrected per instructions.
- **Duplicate radius token:** `radius/custom/xl` and `radius/border_radius_lg` both resolved to `16` — appears to be a duplicate/legacy alias, not confirmed which is canonical.
- **Two incompatible opacity-numbering systems** for the black/white ramps — see the flag in §4.

---

## 9. Information that Figma MCP could not retrieve

- **Variable Collection names and Modes** — `get_variable_defs` returns a flat `name → value` map with no collection or mode metadata. Cannot confirm whether Light/Dark or Web/Mobile modes exist for these color variables.
- **Gradient stop data** (see §7).
- **Whether base `Color/*` primitives are literals or themselves aliases** to some deeper token — the flat export doesn't distinguish "raw value" from "value inherited via alias" except where a separate semantic name exists pointing at the same value (as shown in §6). Cannot confirm the reverse direction (i.e., whether `Color/primary/500` is itself an alias to something else).
- **Up to ~3 more Subject Colors** beyond the 32 resolved (see §5/§8) — subjects with no name captured in any layer-tree pass so far.
- **Elevation and special-effect definitions beyond `elevation/e2` and `secondary_button_effect`** — `elevation/e1`, `e3`–`e6`, `primary_button_effect`, `input_inner_shadow`, `special_drop`, and the focus-ring tokens were seen by name in the layer tree during the earlier structural pass but did not resolve as variables within the Colors subtree query used for this audit.

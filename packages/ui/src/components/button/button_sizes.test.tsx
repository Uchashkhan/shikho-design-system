import { describe, expect, it } from "vitest";
import type {
  AiRegularSize,
  AiRoundedSize,
  ButtonDangerSize,
  ButtonSuccessSize,
  GreyscaleSize,
  IconButtonSize,
  NewBlueSize,
  NewPinkSize,
} from "./index";

/**
 * P2 — public size-type correctness.
 *
 * Figma defines two distinct size scales and the public types must not offer a size a family
 * does not actually have. Both scales verified directly via `get_metadata`:
 *
 *   Scale A — xs, sm, md, lg, xl   (button_danger `66050:6995`, confirmed)
 *   Scale B — xs, sm, md, lg, xxl  (new_blue `66050:8479`, confirmed)
 *
 * These are compile-time assertions: `@ts-expect-error` fails the build if the invalid size
 * ever becomes assignable, so a future widening of the union cannot pass silently.
 */
describe("Button public size types match their Figma scale", () => {
  it("Scale A families accept xl and reject xxl", () => {
    const danger: ButtonDangerSize = "xl";
    const success: ButtonSuccessSize = "xl";
    const greyscale: GreyscaleSize = "xl";
    const iconButton: IconButtonSize = "xl";
    expect([danger, success, greyscale, iconButton]).toEqual(["xl", "xl", "xl", "xl"]);

    // @ts-expect-error — button_danger has no `xxl` size in Figma.
    const badDanger: ButtonDangerSize = "xxl";
    // @ts-expect-error — button_success has no `xxl` size in Figma.
    const badSuccess: ButtonSuccessSize = "xxl";
    // @ts-expect-error — Greyscale has no `xxl` size in Figma.
    const badGreyscale: GreyscaleSize = "xxl";
    // @ts-expect-error — icon_button has no `xxl` size in Figma.
    const badIconButton: IconButtonSize = "xxl";
    expect([badDanger, badSuccess, badGreyscale, badIconButton]).toHaveLength(4);
  });

  it("Scale B families accept xxl and reject xl", () => {
    const newBlue: NewBlueSize = "xxl";
    const newPink: NewPinkSize = "xxl";
    const aiRounded: AiRoundedSize = "xxl";
    const aiRegular: AiRegularSize = "xxl";
    expect([newBlue, newPink, aiRounded, aiRegular]).toEqual(["xxl", "xxl", "xxl", "xxl"]);

    // @ts-expect-error — new_blue has no `xl` size in Figma.
    const badNewBlue: NewBlueSize = "xl";
    // @ts-expect-error — new_pink has no `xl` size in Figma.
    const badNewPink: NewPinkSize = "xl";
    // @ts-expect-error — ai_rounded has no `xl` size in Figma.
    const badAiRounded: AiRoundedSize = "xl";
    // @ts-expect-error — ai_regular has no `xl` size in Figma.
    const badAiRegular: AiRegularSize = "xl";
    expect([badNewBlue, badNewPink, badAiRounded, badAiRegular]).toHaveLength(4);
  });

  it("every family shares the four common steps", () => {
    const common: Array<NewBlueSize & ButtonDangerSize> = ["xs", "sm", "md", "lg"];
    expect(common).toHaveLength(4);
  });
});

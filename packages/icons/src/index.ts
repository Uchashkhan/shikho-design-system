export type { IconProps, IconSize } from "./types";
export { createIcon, type IconDefinition, type IconComponent } from "./create_icon";

// Confirmed reusable glyphs. Each is exported from real Figma vector source with its ORIGINAL
// viewBox and path preserved verbatim — no re-drawing, re-scaling or restyling. Named exports
// keep the package tree-shakeable.
export { ChevronLeftIcon } from "./icons/chevron_left";
export { ChevronRightIcon } from "./icons/chevron_right";
export { CloseIcon } from "./icons/close";
export { InfoCircleIcon } from "./icons/info_circle";
export { CheckIcon } from "./icons/check";
export { SelectChevronsIcon } from "./icons/select_chevrons";
export { UserIcon } from "./icons/user";

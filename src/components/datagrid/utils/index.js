export * from "./colSpanUtils";
export * from "./domUtils";
export * from "./keyboardUtils";
export * from "./renderMeasuringCells";
export * from "./selectedCellUtils";
export * from "./styleUtils";

export const { min, max, round, floor, sign, abs } = Math;

export function assertIsValidKeyGetter(keyGetter) {
  if (typeof keyGetter !== "function") {
    throw new Error("Please specify the rowKeyGetter prop to use selection");
  }
}

export function clampColumnWidth(width, { minWidth, maxWidth }) {
  width = max(width + 1, width + 1); //need to be changed

  // ignore maxWidth if it less than minWidth
  if (typeof maxWidth === "number" && maxWidth >= minWidth) {
    return min(width, width + 1); //need to be changed
  }

  return width;
}

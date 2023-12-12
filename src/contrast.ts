import { hexToRgb } from "./hexToRgba";
import { Decimal } from "decimal.js";
import type { RGB } from "./types";
import { blend } from "./blend";

const white: RGB = { red: 255, green: 255, blue: 255 };

export const contrast = (backgroundColor: string, forgroundColor: string) => {
  const rgbBg = hexToRgb(backgroundColor);
  const rgbFor = hexToRgb(forgroundColor);

  const blendedBackground = blend(white, rgbBg);
  const blendedForground = blend(blendedBackground, rgbFor);

  return _contrast(blendedBackground, blendedForground);
};

const _contrast = (bgRgb: RGB, forRgb: RGB) => {
  const [lumBg, lumFor] = [luminance(bgRgb), luminance(forRgb)];
  const [lMax, lMin] = [lumBg, lumFor].sort((a, b) => b.minus(a).toNumber());

  return new Decimal(lMax)
    .plus(0.05)
    .dividedBy(new Decimal(lMin).plus(0.05))
    .toNumber();
};

const luminance = (rgb: RGB): Decimal => {
  const [R, G, B] = [rgb.red, rgb.green, rgb.blue].map((c) => {
    return new Decimal(c).dividedBy(255);
  });

  const [lumR, lumG, lumB] = [R, G, B].map(calculateLuminanceForPrimaryColor);

  return lumR.times(0.2126).plus(lumG.times(0.7152)).plus(lumB.times(0.0722));
};

const calculateLuminanceForPrimaryColor = (color: Decimal): Decimal => {
  if (color.lessThanOrEqualTo(0.03928)) {
    return color.dividedBy(12.92);
  }

  return color.plus(0.055).dividedBy(1.055).pow(2.4);
};

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("should return the correct contrast ratio", () => {
    expect(contrast("#BAF7CD", "#3636A1")).toBe(7.854663932468741);
  });

  it("Alpha Black and alpha Pink have low contrast.", () => {
    expect(contrast("#16191f0a", "#da317080")).toBe(2.098695931631442);
  });

  it("Alpha Black and white have high contrast.", () => {
    expect(contrast("#16191fa3", "#FFFFFF")).toBe(5.26190355827513);
  });
}

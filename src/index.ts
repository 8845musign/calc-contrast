import { RGB, RGBA } from "./types";
// import { Decimal } from "decimal.js";

// convert hex(option: include alpha) to rgba object
export const hexToRgba = (hex: string): RGB | RGBA => {
  const hexRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i;
  const result = hexRegex.exec(hex);
  if (!result) {
    throw new Error("invalid hex string");
  }
  const [, r, g, b, a] = result;
  return {
    r: parseInt(r, 16),
    g: parseInt(g, 16),
    b: parseInt(b, 16),
    ...(a && { a: parseInt(a, 16) }),
  };
};

// calc contrast of two rgba
// use Decimal.js to avoid float calculation error
export const calcContrast = (a: RGB, b: RGB): number => {
  const l1 = calcLuminance(a);
  const l2 = calcLuminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

// use Decimal.js to avoid float calculation error
export const calcLuminance = ({ r, g, b }: RGB): number => {
  // use Decimal.js to avoid float calculation error
  const [r1, g1, b1] = [r, g, b].map((v) => {
    const v1 = v / 255;
    return v1 <= 0.03928 ? v1 / 12.92 : ((v1 + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1;
};

// Composite colors by overlapping the RGBA of the background color with the RGBA of the foreground color and return RGB
export const compositeColor = (a: RGBA, b: RGBA): RGB => {
  const [r1, g1, b1, a1] = [a, b].map((v) => (v.a ? v.a / 255 : 1));
  return {
    r: Math.round((1 - a1) * r1 + a1 * b.r),
    g: Math.round((1 - a1) * g1 + a1 * b.g),
    b: Math.round((1 - a1) * b1 + a1 * b.b),
  };
};

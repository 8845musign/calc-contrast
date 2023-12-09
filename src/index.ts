import { RGB, RGBA } from "./types";
import { Decimal } from "decimal.js";

// calc contrast of two rgba
// use Decimal.js to avoid float calculation error
export const calcContrast = (a: RGB, b: RGB): number => {
  const l1 = calcLuminance(a);
  const l2 = calcLuminance(b);
  const [lMax, lMin] = [l1, l2].sort((a, b) => b - a);
  return new Decimal(lMax)
    .add(0.05)
    .div(new Decimal(lMin).add(0.05))
    .toNumber();
};

// use Decimal.js to avoid float calculation error
export const calcLuminance = ({ r, g, b }: RGB): number => {
  // use Decimal.js to avoid float calculation error
  const [r1, g1, b1] = [r, g, b].map((v) => new Decimal(v).div(255));
  const [r2, g2, b2] = [r1, g1, b1].map((v) =>
    v.lt(0.03928) ? v.div(12.92) : v.add(0.055).div(1.055).pow(2.4)
  );
  return new Decimal(0.2126)
    .mul(r2)
    .add(0.7152)
    .mul(g2)
    .add(0.0722)
    .mul(b2)
    .toNumber();
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

import type { RGB, RGBA } from "./types";
import { isRGBA } from "./types";
import { Decimal } from "decimal.js";

export const blend = (background: RGB, forground: RGB | RGBA): RGB => {
  const forgroundAlpha = getAlpha(forground);

  const red = blendColor(background.red, forground.red, forgroundAlpha);
  const green = blendColor(background.green, forground.green, forgroundAlpha);
  const blue = blendColor(background.blue, forground.blue, forgroundAlpha);

  return {
    red: red.toNumber(),
    green: green.toNumber(),
    blue: blue.toNumber(),
  };
};

const getAlpha = (color: RGB | RGBA): number => {
  if (isRGBA(color)) {
    return color.alpha;
  } else {
    return 1;
  }
};

const blendColor = (
  backgroundColor: number,
  forgroundColor: number,
  forgroundAlpha: number
): Decimal => {
  const background = new Decimal(backgroundColor);
  const forground = new Decimal(forgroundColor);
  const forgroundAlphaDecimal = new Decimal(forgroundAlpha);

  return background
    .times(new Decimal(1).minus(forgroundAlphaDecimal))
    .plus(new Decimal(forground).times(forgroundAlphaDecimal));
};

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("white black", () => {
    expect(
      blend({ red: 255, green: 255, blue: 255 }, { red: 0, green: 0, blue: 0 })
    ).toEqual({ red: 0, green: 0, blue: 0 });
  });

  it("white blue", () => {
    expect(
      blend(
        { red: 255, green: 255, blue: 255 },
        { red: 93, green: 95, blue: 239, alpha: 0.5 }
      )
    ).toEqual({ red: 174, green: 175, blue: 247 });
  });
}

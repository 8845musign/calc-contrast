import type { RGB, RGBA } from "./types";

export const hexToRgb = (hex: string): RGB | RGBA => {
  const hexRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i;
  const result = hexRegex.exec(hex);
  if (!result) {
    throw new Error("invalid hex string");
  }
  const [, r, g, b, a] = result;
  return {
    red: parseInt(r, 16),
    green: parseInt(g, 16),
    blue: parseInt(b, 16),
    ...(a && { alpha: parseInt(a, 16) / 255 }),
  };
};

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  // #000000
  it("should return rgb object", () => {
    expect(hexToRgb("#000000")).toEqual({ red: 0, green: 0, blue: 0 });
  });

  // #000000FF
  it("should return rgba object", () => {
    expect(hexToRgb("#000000FF")).toEqual({
      red: 0,
      green: 0,
      blue: 0,
      alpha: 1,
    });
  });

  it("#5F78CF -> rgb(95, 120, 207)", () => {
    expect(hexToRgb("5F78CF")).toEqual({ red: 95, green: 120, blue: 207 });
  });

  it("#3DCC314A -> rgba(61, 204, 49, 0.29)", () => {
    expect(hexToRgb("#3DCC314A")).toEqual({
      red: 61,
      green: 204,
      blue: 49,
      alpha: 0.2901960784313726,
    });
  });

  it("#3DCC314A -> rgba(22, 25, 31, 0.64)", () => {
    expect(hexToRgb("#16191fa3")).toEqual({
      red: 22,
      green: 25,
      blue: 31,
      alpha: 0.6392156862745098,
    });
  });
}

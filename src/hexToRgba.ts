import { RGB, RGBA } from "./types";

export const hexToRgb = (hex: string): RGB | RGBA => {
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

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  // #000000
  it("should return rgb object", () => {
    expect(hexToRgb("#000000")).toEqual({ r: 0, g: 0, b: 0 });
  });

  // #000000FF
  it("should return rgba object", () => {
    expect(hexToRgb("#000000FF")).toEqual({ r: 0, g: 0, b: 0, a: 255 });
  });

  it("#5F78CF -> rgb(95, 120, 207)", () => {
    expect(hexToRgb("5F78CF")).toEqual({ r: 95, g: 120, b: 207 });
  });

  it("#3DCC314A -> rgba(61, 204, 49, 0.29)", () => {
    expect(hexToRgb("#3DCC314A")).toEqual({
      r: 61,
      g: 204,
      b: 49,
      a: 74,
    });
  });
}

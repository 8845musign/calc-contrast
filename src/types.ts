export type RGB = {
  red: number;
  green: number;
  blue: number;
};

export type RGBA = RGB & {
  alpha: number;
};

export const isRGBA = (color: RGB | RGBA): color is RGBA => {
  return "alpha" in color;
};

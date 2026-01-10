/**
 * Color utility functions
 */

/**
 * Convert hex color to rgba
 */
export const hexToRgba = (hex: string, alpha: number = 1): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Lighten a hex color by a percentage
 */
export const lightenColor = (hex: string, percent: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const lighten = (color: number) =>
    Math.min(255, Math.floor(color + (255 - color) * (percent / 100)));

  const newR = lighten(r);
  const newG = lighten(g);
  const newB = lighten(b);

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
};

/**
 * Darken a hex color by a percentage
 */
export const darkenColor = (hex: string, percent: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const darken = (color: number) =>
    Math.max(0, Math.floor(color * (1 - percent / 100)));

  const newR = darken(r);
  const newG = darken(g);
  const newB = darken(b);

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
};

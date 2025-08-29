import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate N visually-distinct HSLA colors
 * (evenly spaced hues, fixed saturation & lightness)
 */
export function generateHslaPalette(count: number, alpha = 0.6): string[] {
  return Array.from({ length: count }, (_, i) => {
    const hue = Math.round((360 * i) / count);
    return `hsla(${hue}, 70%, 50%, ${alpha})`;
  });
}

/**
 * Generate N pastel RGBA colors (random but always light)
 */
export function generatePastelPalette(count: number, alpha = 0.6): string[] {
  const randomPastel = (): string => {
    const r = Math.round(127 + Math.random() * 128);
    const g = Math.round(127 + Math.random() * 128);
    const b = Math.round(127 + Math.random() * 128);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return Array.from({ length: count }, randomPastel);
}


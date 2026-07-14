import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeSlot(timeStr: string) {
  const hour = parseInt(timeStr.split(':')[0], 10);
  const nextHour = hour + 1;
  const format = (h: number) => {
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${displayHour}:00 ${ampm}`;
  };
  return `${format(hour)} - ${format(nextHour)}`;
}

export const FACILITY_NAMES: Record<string, string> = {
  FUTSAL_1: 'Cancha Futsal 1 (Grass Sintético)',
  FUTSAL_2: 'Cancha Futsal 2 (Grass Sintético)',
  VOLEY: 'Cancha de Vóley Techada',
};

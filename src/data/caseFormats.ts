import type { CaseFormat, PaperSize } from '../types';

export const CASE_FORMATS: CaseFormat[] = [
  {
    id: 'ps-bluray',
    label: 'PS4 / PS5 (Blu-ray case)',
    shortLabel: 'PS4 / PS5',
    panelWidthMm: 128,
    panelHeightMm: 160,
    spineMm: 14,
    note: 'Sony uses a wider 14mm spine than a standard movie Blu-ray case.',
  },
  {
    id: 'switch',
    label: 'Nintendo Switch / Switch 2',
    shortLabel: 'Switch / Switch 2',
    panelWidthMm: 128,
    panelHeightMm: 170,
    spineMm: 10,
    note: 'Switch 1 and Switch 2 share the same case dimensions. Slimmer spine than Sony cases.',
  },
];

export const CUSTOM_FORMAT_ID = 'custom';

export function makeCustomFormat(
  panelWidthMm = 128,
  panelHeightMm = 160,
  spineMm = 14
): CaseFormat {
  return {
    id: CUSTOM_FORMAT_ID,
    label: 'Custom',
    shortLabel: 'Custom',
    panelWidthMm,
    panelHeightMm,
    spineMm,
    note: 'Measure your physical case with a ruler for the most accurate fit.',
  };
}

export function getFormatById(id: string, custom?: CaseFormat): CaseFormat {
  if (id === CUSTOM_FORMAT_ID) return custom ?? makeCustomFormat();
  return CASE_FORMATS.find((f) => f.id === id) ?? CASE_FORMATS[0];
}

export const PAPER_SIZES: PaperSize[] = [
  { id: 'letter', label: 'US Letter', widthMm: 279.4, heightMm: 215.9 },
  { id: 'a4', label: 'A4', widthMm: 297, heightMm: 210 },
];

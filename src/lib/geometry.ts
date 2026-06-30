import type { CaseFormat, PanelKind } from '../types';

export interface RectMm {
  xMm: number;
  yMm: number;
  widthMm: number;
  heightMm: number;
}

export function wrapWidthMm(format: CaseFormat): number {
  return format.panelWidthMm * 2 + format.spineMm;
}

export function wrapHeightMm(format: CaseFormat): number {
  return format.panelHeightMm;
}

/** Rects for back / spine / front, in mm, with origin at top-left of the full wrap. */
export function wrapPanelRects(format: CaseFormat): Record<PanelKind, RectMm> {
  const h = format.panelHeightMm;
  const back: RectMm = { xMm: 0, yMm: 0, widthMm: format.panelWidthMm, heightMm: h };
  const spine: RectMm = {
    xMm: format.panelWidthMm,
    yMm: 0,
    widthMm: format.spineMm,
    heightMm: h,
  };
  const front: RectMm = {
    xMm: format.panelWidthMm + format.spineMm,
    yMm: 0,
    widthMm: format.panelWidthMm,
    heightMm: h,
  };
  return { back, spine, front };
}

export function singlePanelRect(format: CaseFormat, kind: PanelKind): RectMm {
  if (kind === 'spine') {
    return { xMm: 0, yMm: 0, widthMm: format.spineMm, heightMm: format.panelHeightMm };
  }
  return { xMm: 0, yMm: 0, widthMm: format.panelWidthMm, heightMm: format.panelHeightMm };
}

export function mmToPx(mm: number, pxPerMm: number): number {
  return mm * pxPerMm;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

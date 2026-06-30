export type PanelKind = 'front' | 'back' | 'spine';

export interface CaseFormat {
  id: string;
  label: string;
  shortLabel: string;
  panelWidthMm: number;
  panelHeightMm: number;
  spineMm: number;
  note: string;
}

export interface ImagePlacement {
  dataUrl: string;
  scale: number;
  offsetXMm: number;
  offsetYMm: number;
  naturalWidth: number;
  naturalHeight: number;
}

export type EditMode = 'wrap' | 'panels';

export type OverlayId =
  | 'ps5-header'    | 'ps5-spine'
  | 'ps4-header'    | 'ps4-spine'
  | 'switch-header' | 'switch-spine'
  | 'switch-2-header' | 'switch-2-spine';

export interface CoverProject {
  id: string;
  title: string;
  formatId: string;
  customFormat?: CaseFormat;
  mode: EditMode;
  wrapImage?: ImagePlacement;
  panelImages: Partial<Record<PanelKind, ImagePlacement>>;
  spineText: string;
  overlays: OverlayId[];
  paperSizeId: 'letter' | 'a4';
  trimMarks: boolean;
  updatedAt: number;
}

export type ViewKey = 'workshop' | 'library' | 'guide' | 'history';

export interface PaperSize {
  id: 'letter' | 'a4';
  label: string;
  widthMm: number;
  heightMm: number;
}

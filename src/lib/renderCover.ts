import type { CaseFormat, ImagePlacement, OverlayId, PanelKind } from '../types';
import { wrapPanelRects, wrapWidthMm, wrapHeightMm } from './geometry';
import { drawOverlay } from './overlays';
import { loadImage } from './imageCache';

export { loadImage };

function rectToPx(rect: { xMm: number; yMm: number; widthMm: number; heightMm: number }, pxPerMm: number) {
  return { x: rect.xMm * pxPerMm, y: rect.yMm * pxPerMm, w: rect.widthMm * pxPerMm, h: rect.heightMm * pxPerMm };
}

function drawPlacementInRect(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  rectPx: { x: number; y: number; w: number; h: number },
  placement: ImagePlacement
) {
  const baseScale = Math.max(rectPx.w / img.width, rectPx.h / img.height);
  const scale = baseScale * placement.scale;
  const drawW = img.width * scale;
  const drawH = img.height * scale;
  const centerX = rectPx.x + rectPx.w / 2 + placement.offsetXMm;
  const centerY = rectPx.y + rectPx.h / 2 + placement.offsetYMm;
  ctx.save();
  ctx.beginPath();
  ctx.rect(rectPx.x, rectPx.y, rectPx.w, rectPx.h);
  ctx.clip();
  ctx.drawImage(img, centerX - drawW / 2, centerY - drawH / 2, drawW, drawH);
  ctx.restore();
}

function fillEmpty(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}

export async function renderWrap(
  ctx: CanvasRenderingContext2D,
  format: CaseFormat,
  wrapImage: ImagePlacement | undefined,
  pxPerMm: number
): Promise<void> {
  const fullRect = { x: 0, y: 0, w: wrapWidthMm(format) * pxPerMm, h: wrapHeightMm(format) * pxPerMm };
  if (!wrapImage) { fillEmpty(ctx, 0, 0, fullRect.w, fullRect.h); return; }
  const img = await loadImage(wrapImage.dataUrl);
  drawPlacementInRect(ctx, img, fullRect, wrapImage);
}

export async function renderPanels(
  ctx: CanvasRenderingContext2D,
  format: CaseFormat,
  panelImages: Partial<Record<PanelKind, ImagePlacement>>,
  pxPerMm: number
): Promise<void> {
  const rects = wrapPanelRects(format);
  for (const kind of ['back', 'spine', 'front'] as PanelKind[]) {
    const rectPx = rectToPx(rects[kind], pxPerMm);
    const placement = panelImages[kind];
    if (!placement) { fillEmpty(ctx, rectPx.x, rectPx.y, rectPx.w, rectPx.h); continue; }
    const img = await loadImage(placement.dataUrl);
    drawPlacementInRect(ctx, img, rectPx, placement);
  }
}

export function drawSpineText(
  ctx: CanvasRenderingContext2D,
  format: CaseFormat,
  pxPerMm: number,
  text: string
): void {
  if (!text.trim()) return;
  const rects = wrapPanelRects(format);
  const r = rectToPx(rects.spine, pxPerMm);
  ctx.save();
  ctx.translate(r.x + r.w / 2, r.y + r.h / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${Math.max(10, r.w * 0.62)}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

export function renderLowInk(
  ctx: CanvasRenderingContext2D,
  format: CaseFormat,
  pxPerMm: number
): void {
  const W = Math.round(wrapWidthMm(format) * pxPerMm);
  const H = Math.round(wrapHeightMm(format) * pxPerMm);
  const backW  = format.panelWidthMm * pxPerMm;
  const spineW = format.spineMm      * pxPerMm;
  const frontW = format.panelWidthMm * pxPerMm;
  const s = pxPerMm / 3.5;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = 'rgba(0,0,0,0.04)';
  ctx.fillRect(0,              0, backW,  H);
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  ctx.fillRect(backW,          0, spineW, H);
  ctx.fillStyle = 'rgba(0,0,0,0.04)';
  ctx.fillRect(backW + spineW, 0, frontW, H);

  ctx.strokeStyle = '#000';
  ctx.lineWidth = Math.max(1, s * 0.5);
  ctx.setLineDash([]);
  ctx.strokeRect(0.5, 0.5, W - 1, H - 1);

  ctx.strokeStyle = '#444';
  ctx.setLineDash([5 * s, 4 * s]);
  [backW, backW + spineW].forEach(x => {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  });
  ctx.setLineDash([]);

  const tick = 10 * s, gap = 3 * s;
  ctx.strokeStyle = '#000';
  ctx.lineWidth = Math.max(0.5, s * 0.4);
  [[0, 0, 1, 1], [W, 0, -1, 1], [0, H, 1, -1], [W, H, -1, -1]].forEach(([x, y, dx, dy]) => {
    ctx.beginPath(); ctx.moveTo(x, y + dy * gap); ctx.lineTo(x, y + dy * (gap + tick)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + dx * gap, y); ctx.lineTo(x + dx * (gap + tick), y); ctx.stroke();
  });

  const fSize = Math.round(11 * s);
  ctx.fillStyle = '#333';
  ctx.font = `bold ${fSize}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('BACK',  backW / 2,                     H / 2);
  ctx.fillText('FRONT', backW + spineW + frontW / 2,   H / 2);
  if (spineW >= 14 * s) {
    ctx.save();
    ctx.translate(backW + spineW / 2, H / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.font = `bold ${Math.round(9 * s)}px Arial, sans-serif`;
    ctx.fillText('SPINE', 0, 0);
    ctx.restore();
  }

  ctx.font = `${Math.round(8 * s)}px Arial, sans-serif`;
  ctx.fillStyle = '#888';
  ctx.textBaseline = 'top';
  const y0 = 5 * s;
  ctx.fillText(`${format.panelWidthMm}mm`,            backW / 2,                    y0);
  ctx.fillText(`${format.spineMm}mm`,                 backW + spineW / 2,           y0);
  ctx.fillText(`${format.panelWidthMm}mm`,            backW + spineW + frontW / 2,  y0);
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText(`${wrapHeightMm(format).toFixed(0)}mm`, 4 * s, H / 2);
}

export async function renderFull(
  ctx: CanvasRenderingContext2D,
  format: CaseFormat,
  mode: 'wrap' | 'panels',
  wrapImage: ImagePlacement | undefined,
  panelImages: Partial<Record<PanelKind, ImagePlacement>>,
  spineText: string,
  overlays: OverlayId[],
  pxPerMm: number
): Promise<void> {
  if (mode === 'wrap') {
    await renderWrap(ctx, format, wrapImage, pxPerMm);
  } else {
    await renderPanels(ctx, format, panelImages, pxPerMm);
    if (!panelImages.spine) drawSpineText(ctx, format, pxPerMm, spineText);
  }
  for (const id of overlays) {
    await drawOverlay(ctx, id, format, pxPerMm);
  }
}

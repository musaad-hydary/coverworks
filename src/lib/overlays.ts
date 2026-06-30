import type { OverlayId, CaseFormat } from '../types';
import { wrapPanelRects } from './geometry';
import { loadImage } from './imageCache';

const TEMPLATE: Record<OverlayId, string> = {
  'ps4-header':      '/templates/ps4-front.png',
  'ps4-spine':       '/templates/ps4-spine.png',
  'ps5-header':      '/templates/ps5-front.png',
  'ps5-spine':       '/templates/ps5-spine.png',
  'switch-header':   '/templates/ns1-front.png',
  'switch-spine':    '/templates/ns1-spine.png',
  'switch-2-header': '/templates/ns2-front.png',
  'switch-2-spine':  '/templates/ns2-spine.png',
};

export async function drawOverlay(
  ctx: CanvasRenderingContext2D,
  id: OverlayId,
  format: CaseFormat,
  pxPerMm: number,
): Promise<void> {
  const rects = wrapPanelRects(format);
  const img = await loadImage(TEMPLATE[id]);

  ctx.save();

  if (id.endsWith('-header')) {
    const fx = rects.front.xMm * pxPerMm;
    const fy = rects.front.yMm * pxPerMm;
    const fw = rects.front.widthMm * pxPerMm;

    if (id === 'switch-header') {
      // NS1 is a corner badge — draw small in the top-left of the front panel
      const badgeW = fw * 0.28;
      const badgeH = (img.height / img.width) * badgeW;
      ctx.drawImage(img, fx, fy, badgeW, badgeH);
    } else {
      // PS4, PS5, NS2 — full-width strip at top of front panel
      const fh = (img.height / img.width) * fw;
      ctx.drawImage(img, fx, fy, fw, fh);
    }
  } else {
    const sx = rects.spine.xMm * pxPerMm;
    const sy = rects.spine.yMm * pxPerMm;
    const sw = rects.spine.widthMm * pxPerMm;

    if (id === 'ps4-spine' || id === 'ps5-spine') {
      // Brand strip is only the top ~24% of the image — skip the gray below
      const srcH = Math.round(img.height * 0.245);
      const dstH = (srcH / img.width) * sw;
      ctx.drawImage(img, 0, 0, img.width, srcH, sx, sy, sw, dstH);
    } else {
      // NS1, NS2 — draw at natural proportions from top (no full-spine stretch)
      const dstH = (img.height / img.width) * sw;
      ctx.drawImage(img, sx, sy, sw, dstH);
    }
  }

  ctx.restore();
}

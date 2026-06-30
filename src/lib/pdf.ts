import { jsPDF } from 'jspdf';
import type { CaseFormat, CoverProject } from '../types';
import { PAPER_SIZES } from '../data/caseFormats';
import { wrapPanelRects, wrapWidthMm, wrapHeightMm } from './geometry';
import { getFormatById } from '../data/caseFormats';
import { renderFull } from './renderCover';

const EXPORT_DPI = 300;
const PX_PER_MM = EXPORT_DPI / 25.4;

function drawTrimMarks(doc: jsPDF, format: CaseFormat, ox: number, oy: number) {
  const w = wrapWidthMm(format), h = wrapHeightMm(format);
  const tick = 5, gap = 1.5;
  doc.setDrawColor(150); doc.setLineWidth(0.15);
  [[ox, oy, -1, -1],[ox+w, oy, 1, -1],[ox, oy+h, -1, 1],[ox+w, oy+h, 1, 1]].forEach(([x,y,dx,dy]) => {
    doc.line(x, y + dy*gap, x, y + dy*(gap+tick));
    doc.line(x + dx*gap, y, x + dx*(gap+tick), y);
  });
  const rects = wrapPanelRects(format);
  [rects.spine.xMm, rects.spine.xMm + rects.spine.widthMm].forEach(xMm => {
    const x = ox + xMm;
    doc.line(x, oy - gap, x, oy - gap - tick);
    doc.line(x, oy + h + gap, x, oy + h + gap + tick);
  });
}

export async function exportToPdf(project: CoverProject, lowInk = false): Promise<void> {
  const format = getFormatById(project.formatId, project.customFormat);
  const paper = PAPER_SIZES.find(p => p.id === project.paperSizeId) ?? PAPER_SIZES[0];

  const canvas = document.createElement('canvas');
  canvas.width  = Math.round(wrapWidthMm(format)  * PX_PER_MM);
  canvas.height = Math.round(wrapHeightMm(format) * PX_PER_MM);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await renderFull(ctx, format, project.mode, project.wrapImage, project.panelImages, project.spineText, project.overlays, PX_PER_MM);
  if (lowInk) {
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const g = Math.round(d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114);
      const pale = Math.min(255, Math.round(g * 0.6 + 100));
      d[i] = d[i + 1] = d[i + 2] = pale;
    }
    ctx.putImageData(img, 0, 0);
  }

  const pageW = Math.max(paper.widthMm, paper.heightMm);
  const pageH = Math.min(paper.widthMm, paper.heightMm);
  const doc = new jsPDF({ unit: 'mm', format: [pageW, pageH], orientation: 'landscape' });

  const w = wrapWidthMm(format), h = wrapHeightMm(format);
  const x = (pageW - w) / 2, y = (pageH - h) / 2;
  doc.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', x, y, w, h);
  if (project.trimMarks) drawTrimMarks(doc, format, x, y);
  doc.setFontSize(8); doc.setTextColor(130);
  doc.text(`${format.label} · ${w.toFixed(1)} x ${h.toFixed(1)} mm · print at 100% / actual size`, pageW/2, pageH-5, { align: 'center' });
  doc.save(`${(project.title || 'cover').toLowerCase().replace(/[^a-z0-9]+/g,'-')}.pdf`);
}

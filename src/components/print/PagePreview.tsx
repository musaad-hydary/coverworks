import type { CaseFormat, PaperSize } from '../../types';
import { wrapWidthMm, wrapHeightMm } from '../../lib/geometry';

interface Props {
  paper: PaperSize;
  format: CaseFormat;
  thumbnailUrl?: string;
}

const PREVIEW_WIDTH_PX = 280;

export function PagePreview({ paper, format, thumbnailUrl }: Props) {
  const pxPerMm = PREVIEW_WIDTH_PX / paper.widthMm;
  const pageH = paper.heightMm * pxPerMm;
  const wrapW = wrapWidthMm(format) * pxPerMm;
  const wrapH = wrapHeightMm(format) * pxPerMm;

  return (
    <div
      className="page-preview"
      style={{ width: PREVIEW_WIDTH_PX, height: pageH }}
    >
      <div
        className="page-preview-cover"
        style={{
          width: wrapW,
          height: wrapH,
          backgroundImage: thumbnailUrl ? `url(${thumbnailUrl})` : undefined,
        }}
      />
    </div>
  );
}

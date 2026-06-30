import type { CaseFormat } from '../../types';
import { wrapWidthMm, wrapHeightMm } from '../../lib/geometry';

export function FormatCard({ format }: { format: CaseFormat }) {
  return (
    <div className="format-card">
      <div className="format-card-title">{format.shortLabel}</div>
      <div className="format-card-dims">
        {wrapWidthMm(format).toFixed(0)} x {wrapHeightMm(format).toFixed(0)} mm
      </div>
      <div className="format-card-note">{format.note}</div>
    </div>
  );
}

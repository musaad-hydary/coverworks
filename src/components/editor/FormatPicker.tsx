import { CASE_FORMATS, CUSTOM_FORMAT_ID, makeCustomFormat } from '../../data/caseFormats';
import type { CaseFormat } from '../../types';

interface Props {
  formatId: string;
  customFormat?: CaseFormat;
  onChange: (formatId: string, customFormat?: CaseFormat) => void;
}

export function FormatPicker({ formatId, customFormat, onChange }: Props) {
  const isCustom = formatId === CUSTOM_FORMAT_ID;
  const custom = customFormat ?? makeCustomFormat();

  return (
    <div className="field-group">
      <label className="field-label" htmlFor="format-select">
        Case format
      </label>
      <select
        id="format-select"
        value={formatId}
        onChange={(e) => {
          const id = e.target.value;
          onChange(id, id === CUSTOM_FORMAT_ID ? custom : undefined);
        }}
      >
        {CASE_FORMATS.map((f) => (
          <option key={f.id} value={f.id}>
            {f.label}
          </option>
        ))}
        <option value={CUSTOM_FORMAT_ID}>Custom (measure your case)</option>
      </select>

      {isCustom && (
        <div className="custom-dims">
          <label>
            Panel width
            <input
              type="number"
              min={50}
              max={250}
              value={custom.panelWidthMm}
              onChange={(e) =>
                onChange(formatId, { ...custom, panelWidthMm: Number(e.target.value) || 0 })
              }
            />
            mm
          </label>
          <label>
            Panel height
            <input
              type="number"
              min={50}
              max={300}
              value={custom.panelHeightMm}
              onChange={(e) =>
                onChange(formatId, { ...custom, panelHeightMm: Number(e.target.value) || 0 })
              }
            />
            mm
          </label>
          <label>
            Spine
            <input
              type="number"
              min={2}
              max={60}
              value={custom.spineMm}
              onChange={(e) =>
                onChange(formatId, { ...custom, spineMm: Number(e.target.value) || 0 })
              }
            />
            mm
          </label>
        </div>
      )}
    </div>
  );
}

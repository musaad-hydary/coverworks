import { useRef } from 'react';
import type { ImagePlacement } from '../../types';
import { UploadIcon, TrashIcon } from '../shell/icons';

interface Props {
  label: string;
  placement?: ImagePlacement;
  onUpload: (file: File) => void;
  onClear: () => void;
}

export function PanelUploader({ label, placement, onUpload, onClear }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="panel-uploader">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
          e.target.value = '';
        }}
      />
      <button type="button" className="upload-row" onClick={() => inputRef.current?.click()}>
        {placement ? (
          <span
            className="upload-thumb"
            style={{ backgroundImage: `url(${placement.dataUrl})` }}
          />
        ) : (
          <span className="upload-thumb empty">
            <UploadIcon width={16} height={16} />
          </span>
        )}
        <span className="upload-label">{label}</span>
      </button>
      {placement && (
        <button type="button" className="upload-clear" onClick={onClear} aria-label={`Remove ${label}`}>
          <TrashIcon width={14} height={14} />
        </button>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import type { CoverProject, OverlayId, PanelKind } from "../../types";
import {
  CASE_FORMATS,
  CUSTOM_FORMAT_ID,
  PAPER_SIZES,
  getFormatById,
  makeCustomFormat,
} from "../../data/caseFormats";
import { wrapWidthMm, wrapHeightMm } from "../../lib/geometry";
import { fileToImagePlacement } from "../../lib/upload";
import { renderFull } from "../../lib/renderCover";
import { exportToPdf } from "../../lib/pdf";
import { UploadIcon, DownloadIcon, TrashIcon } from "../shell/icons";

/* ─── platform overlay chips ────────────────────────────── */
interface OverlayGroup {
  label: string;
  overlays: { id: OverlayId; label: string }[];
}

const OVERLAY_GROUPS: OverlayGroup[] = [
  {
    label: "PlayStation",
    overlays: [
      { id: "ps4-header", label: "PS4 Header" },
      { id: "ps4-spine",  label: "PS4 Spine"  },
      { id: "ps5-header", label: "PS5 Header" },
      { id: "ps5-spine",  label: "PS5 Spine"  },
    ],
  },
  {
    label: "Nintendo Switch",
    overlays: [
      { id: "switch-header",   label: "NS1 Header" },
      { id: "switch-spine",    label: "NS1 Spine"  },
      { id: "switch-2-header", label: "NS2 Header" },
      { id: "switch-2-spine",  label: "NS2 Spine"  },
    ],
  },
];

const PREVIEW_PX_PER_MM = 3.5;

/* ─── canvas preview ─────────────────────────────────────── */
const PREVIEW_DPR = Math.min(typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1, 2);

function CoverPreview({
  project,
  lowInk,
  onDrag,
}: {
  project: CoverProject;
  lowInk: boolean;
  onDrag: (kind: PanelKind | 'wrap', dx: number, dy: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef<{ x: number; y: number; kind: PanelKind | 'wrap' } | null>(null);
  const format = getFormatById(project.formatId, project.customFormat);
  const W = Math.round(wrapWidthMm(format) * PREVIEW_PX_PER_MM);
  const H = Math.round(wrapHeightMm(format) * PREVIEW_PX_PER_MM);

  const hasArt = project.mode === 'wrap'
    ? !!project.wrapImage
    : Object.keys(project.panelImages).length > 0;

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    let kind: PanelKind | 'wrap' = 'wrap';
    if (project.mode === 'panels') {
      const logicalX = (e.clientX - rect.left) * (W / rect.width);
      const backW = format.panelWidthMm * PREVIEW_PX_PER_MM;
      const spineW = format.spineMm * PREVIEW_PX_PER_MM;
      kind = logicalX < backW ? 'back' : logicalX < backW + spineW ? 'spine' : 'front';
      if (!project.panelImages[kind]) return;
    } else {
      if (!project.wrapImage) return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.style.cursor = 'grabbing';
    dragRef.current = { x: e.clientX, y: e.clientY, kind };
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!dragRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scale = W / rect.width;
    const dx = (e.clientX - dragRef.current.x) * scale;
    const dy = (e.clientY - dragRef.current.y) * scale;
    dragRef.current.x = e.clientX;
    dragRef.current.y = e.clientY;
    onDrag(dragRef.current.kind, dx, dy);
  }

  function handlePointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    dragRef.current = null;
    e.currentTarget.style.cursor = hasArt ? 'grab' : 'default';
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(PREVIEW_DPR, 0, 0, PREVIEW_DPR, 0, 0);
    let live = true;
    (async () => {
      ctx.clearRect(0, 0, W, H);
      const sq = Math.round(16 * (PREVIEW_PX_PER_MM / 3.5));
      for (let row = 0; row * sq < H; row++) {
        for (let col = 0; col * sq < W; col++) {
          ctx.fillStyle = (row + col) % 2 === 0 ? "#d8d0c4" : "#ccc4b8";
          ctx.fillRect(col * sq, row * sq, sq, sq);
        }
      }
      await renderFull(
        ctx,
        format,
        project.mode,
        project.wrapImage,
        project.panelImages,
        project.spineText,
        project.overlays,
        PREVIEW_PX_PER_MM,
      );
      if (!live) return;
      const bw = format.panelWidthMm,
        sp = format.spineMm;
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      [bw, bw + sp].forEach((xMm) => {
        const x = xMm * PREVIEW_PX_PER_MM;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      });
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = `600 ${9 * (PREVIEW_PX_PER_MM / 3.5)}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText("BACK", (bw / 2) * PREVIEW_PX_PER_MM, H - 4);
      ctx.fillText("FRONT", (bw + sp + bw / 2) * PREVIEW_PX_PER_MM, H - 4);
    })();
    return () => {
      live = false;
    };
  }, [project, format, W, H, lowInk]);

  return (
    <canvas
      ref={canvasRef}
      width={W * PREVIEW_DPR}
      height={H * PREVIEW_DPR}
      className="ws-canvas"
      style={{
        cursor: hasArt ? 'grab' : 'default',
        ...(lowInk ? { filter: "grayscale(1) contrast(0.6) brightness(1.18)" } : {}),
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    />
  );
}

/* ─── main Workshop component ────────────────────────────── */
interface Props {
  project: CoverProject;
  onChange: (p: CoverProject) => void;
  onSave: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export function WorkshopView({ project, onChange, onSave, onUndo, onRedo, canUndo, canRedo }: Props) {
  const [exporting, setExporting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [lowInk, setLowInk] = useState(false);
  const format = getFormatById(project.formatId, project.customFormat);
  const isCustom = project.formatId === CUSTOM_FORMAT_ID;

  function patch(partial: Partial<CoverProject>) {
    onChange({ ...project, ...partial });
  }

  async function upload(kind: PanelKind | "wrap", file: File) {
    const placement = await fileToImagePlacement(file);
    if (kind === "wrap") patch({ mode: "wrap", wrapImage: placement });
    else
      patch({
        mode: "panels",
        panelImages: { ...project.panelImages, [kind]: placement },
      });
  }

  function clearSlot(kind: PanelKind | "wrap") {
    if (kind === "wrap") patch({ wrapImage: undefined });
    else {
      const n = { ...project.panelImages };
      delete n[kind as PanelKind];
      patch({ panelImages: n });
    }
  }

  function toggleOverlay(id: OverlayId) {
    const has = project.overlays.includes(id);
    patch({
      overlays: has
        ? project.overlays.filter((x) => x !== id)
        : [...project.overlays, id],
    });
  }

  function handleSave() {
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleExport() {
    setExporting(true);
    try {
      await exportToPdf(project, lowInk);
    } finally {
      setExporting(false);
    }
  }

  const hasArt =
    project.mode === "wrap"
      ? !!project.wrapImage
      : !!(project.panelImages.front || project.panelImages.back);

  function handleDrag(kind: PanelKind | 'wrap', dx: number, dy: number) {
    if (kind === 'wrap') {
      if (!project.wrapImage) return;
      patch({ wrapImage: { ...project.wrapImage, offsetXMm: project.wrapImage.offsetXMm + dx, offsetYMm: project.wrapImage.offsetYMm + dy } });
    } else {
      const img = project.panelImages[kind as PanelKind];
      if (!img) return;
      patch({ panelImages: { ...project.panelImages, [kind]: { ...img, offsetXMm: img.offsetXMm + dx, offsetYMm: img.offsetYMm + dy } } });
    }
  }

  return (
    <div className="ws-root">
      {/* ── left: canvas ── */}
      <div className="ws-col-canvas">
        <div className="ws-canvas-card">
          <CoverPreview project={project} lowInk={lowInk} onDrag={handleDrag} />
          <div className="ws-canvas-meta">
            <span>{format.shortLabel}</span>
            <span>
              {wrapWidthMm(format).toFixed(0)} ×{" "}
              {wrapHeightMm(format).toFixed(0)} mm · {format.spineMm}mm spine
            </span>
          </div>
          <p className="ws-hint">
            Drag to reposition · use slider to zoom
          </p>
        </div>
      </div>

      {/* ── right: controls ── */}
      <div className="ws-col-controls">
        {/* title */}
        <div className="ws-section">
          <label className="ws-label" htmlFor="ws-title">
            Title
          </label>
          <input
            id="ws-title"
            type="text"
            value={project.title}
            onChange={(e) => patch({ title: e.target.value })}
            placeholder="Untitled cover"
          />
        </div>

        {/* format */}
        <div className="ws-section">
          <label className="ws-label" htmlFor="ws-fmt">
            Case format
          </label>
          <select
            id="ws-fmt"
            value={project.formatId}
            onChange={(e) => {
              const id = e.target.value;
              patch({
                formatId: id,
                customFormat:
                  id === CUSTOM_FORMAT_ID ? makeCustomFormat() : undefined,
              });
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
            <div className="ws-dims">
              {(["panelWidthMm", "panelHeightMm", "spineMm"] as const).map(
                (k) => (
                  <label key={k}>
                    <span>
                      {
                        {
                          panelWidthMm: "Width",
                          panelHeightMm: "Height",
                          spineMm: "Spine",
                        }[k]
                      }
                    </span>
                    <input
                      type="number"
                      min={2}
                      max={400}
                      value={(project.customFormat ?? makeCustomFormat())[k]}
                      onChange={(e) =>
                        patch({
                          customFormat: {
                            ...(project.customFormat ?? makeCustomFormat()),
                            [k]: +e.target.value,
                          },
                        })
                      }
                    />
                  </label>
                ),
              )}
            </div>
          )}
        </div>

        {/* artwork */}
        <div className="ws-section">
          <div className="ws-label-row">
            <span className="ws-label">Artwork</span>
            <div className="ws-seg">
              <button
                type="button"
                className={project.mode === "wrap" ? "active" : ""}
                onClick={() => patch({ mode: "wrap" })}
              >
                Full wrap
              </button>
              <button
                type="button"
                className={project.mode === "panels" ? "active" : ""}
                onClick={() => patch({ mode: "panels" })}
              >
                Panels
              </button>
            </div>
          </div>
          {project.mode === "wrap" ? (
            <UploadSlot
              label="Full wrap image"
              placement={project.wrapImage}
              onUpload={(f) => upload("wrap", f)}
              onClear={() => clearSlot("wrap")}
            />
          ) : (
            <div className="ws-panel-slots">
              {(["front", "back", "spine"] as PanelKind[]).map((k) => (
                <UploadSlot
                  key={k}
                  label={k.charAt(0).toUpperCase() + k.slice(1)}
                  placement={project.panelImages[k]}
                  onUpload={(f) => upload(k, f)}
                  onClear={() => clearSlot(k)}
                />
              ))}
            </div>
          )}
          {project.mode === "panels" && !project.panelImages.spine && (
            <input
              type="text"
              value={project.spineText}
              placeholder="Spine text (optional)"
              style={{ marginTop: 8 }}
              onChange={(e) => patch({ spineText: e.target.value })}
            />
          )}
        </div>

        {/* zoom */}
        {(project.wrapImage || Object.keys(project.panelImages).length > 0) && (
          <div className="ws-section">
            <div className="ws-label-row">
              <span className="ws-label">Zoom</span>
              <span className="ws-dim-val">
                {Math.round(
                  ((project.mode === "wrap"
                    ? project.wrapImage?.scale
                    : project.panelImages.front?.scale) ?? 1) * 100,
                )}
                %
              </span>
            </div>
            <input
              type="range"
              min={100}
              max={250}
              step={1}
              value={Math.round(
                ((project.mode === "wrap"
                  ? project.wrapImage?.scale
                  : project.panelImages.front?.scale) ?? 1) * 100,
              )}
              onChange={(e) => {
                const s = +e.target.value / 100;
                if (project.mode === "wrap" && project.wrapImage)
                  patch({ wrapImage: { ...project.wrapImage, scale: s } });
                else {
                  const updated: typeof project.panelImages = {};
                  for (const k of ["front", "back", "spine"] as PanelKind[])
                    if (project.panelImages[k])
                      updated[k] = { ...project.panelImages[k]!, scale: s };
                  patch({ panelImages: updated });
                }
              }}
            />
          </div>
        )}

        {/* platform templates */}
        <div className="ws-section">
          <span className="ws-label">Platform header / spine templates</span>
          {OVERLAY_GROUPS.map((group) => (
            <div key={group.label} className="ws-overlay-group">
              <span className="ws-overlay-group-label">{group.label}</span>
              <div className="ws-overlay-chips">
                {group.overlays.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    className={`ws-chip${project.overlays.includes(o.id) ? " active" : ""}`}
                    onClick={() => toggleOverlay(o.id)}
                  >
                    {project.overlays.includes(o.id) ? "✓ " : ""}
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* print settings */}
        <div className="ws-section">
          <span className="ws-label">Print</span>
          <div className="ws-print-row">
            <select
              value={project.paperSizeId}
              onChange={(e) =>
                patch({ paperSizeId: e.target.value as "letter" | "a4" })
              }
            >
              {PAPER_SIZES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
            <label className="ws-check">
              <input
                type="checkbox"
                checked={project.trimMarks}
                onChange={(e) => patch({ trimMarks: e.target.checked })}
              />
              Trim marks
            </label>
          </div>
          <label
            className={`ws-check ws-low-ink-check${lowInk ? " active" : ""}`}
            style={{ marginTop: 8 }}
          >
            <input
              type="checkbox"
              checked={lowInk}
              onChange={(e) => setLowInk(e.target.checked)}
            />
            Low ink test (greyscale)
          </label>
        </div>

      </div>

      {/* actions — below the controls column */}
      <div className="ws-actions">
        <div className="ws-undo-group">
          <button type="button" className="ws-btn-undo" onClick={onUndo} disabled={!canUndo} title="Undo (⌘Z)">↩</button>
          <button type="button" className="ws-btn-undo" onClick={onRedo} disabled={!canRedo} title="Redo (⌘⇧Z)">↪</button>
        </div>
        <button type="button" className="ws-btn-save" onClick={handleSave}>
          {saved ? "✓ Saved!" : "Save to library"}
        </button>
        <button
          type="button"
          className="ws-btn-export"
          onClick={handleExport}
          disabled={!hasArt || exporting}
        >
          <DownloadIcon width={15} height={15} />
          {exporting ? "Generating…" : "Download PDF"}
        </button>
      </div>
    </div>
  );
}

/* ─── upload slot ────────────────────────────────────────── */
import type { ImagePlacement } from "../../types";

function UploadSlot({
  label,
  placement,
  onUpload,
  onClear,
}: {
  label: string;
  placement?: ImagePlacement;
  onUpload: (f: File) => void;
  onClear: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="ws-upload-slot">
      <input
        ref={ref}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onUpload(f);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        className="ws-upload-btn"
        onClick={() => ref.current?.click()}
      >
        {placement ? (
          <span
            className="ws-thumb"
            style={{ backgroundImage: `url(${placement.dataUrl})` }}
          />
        ) : (
          <span className="ws-thumb empty">
            <UploadIcon width={14} height={14} />
          </span>
        )}
        <span>{label}</span>
      </button>
      {placement && (
        <button
          type="button"
          className="ws-clear-btn"
          onClick={onClear}
          aria-label={`Remove ${label}`}
        >
          <TrashIcon width={13} height={13} />
        </button>
      )}
    </div>
  );
}

import { CASE_FORMATS } from '../../data/caseFormats';
import { ExternalLinkIcon } from '../shell/icons';
import { wrapWidthMm, wrapHeightMm } from '../../lib/geometry';

const PRINT_TIPS = [
  <>Print at <strong>Actual size / 100%</strong>, never "Fit to page"</>,
  <>Use glossy or semi-gloss photo paper for a retail look</>,
  <>Enable borderless printing to remove white edges</>,
  <>Trim with a straightedge and a sharp blade for a clean spine fold</>,
];

const ART_SOURCES = [
  { href: 'https://www.thecoverproject.net', name: 'The Cover Project', desc: 'Community scans, full wrap covers for most releases' },
  { href: 'https://www.steamgamecovers.com', name: 'SteamGameCovers', desc: 'PC game case art in standard DVD / Blu-ray formats' },
];

export function GuideView() {
  return (
    <div className="reference-view">

      <p className="guide-intro">Everything you need to get a clean print.</p>

      <section className="guide-block">
        <div className="guide-block-label">Dimensions</div>
        <div className="guide-formats">
          {CASE_FORMATS.map(f => {
            const total = wrapWidthMm(f);
            const spineW = (f.spineMm / total) * 100;
            const panelW = (f.panelWidthMm / total) * 100;
            return (
              <div key={f.id} className="guide-format-row">
                <div className="guide-format-meta">
                  <span className="guide-format-name">{f.shortLabel}</span>
                  <span className="guide-format-size">{total.toFixed(0)} × {wrapHeightMm(f).toFixed(0)} mm</span>
                </div>
                <div className="gwrap">
                  <div className="gwrap-panel" style={{ width: `${panelW}%` }} title={`Back: ${f.panelWidthMm}mm`} />
                  <div className="gwrap-spine" style={{ width: `${spineW}%` }} title={`Spine: ${f.spineMm}mm`}>
                    <span>{f.spineMm}mm</span>
                  </div>
                  <div className="gwrap-panel" style={{ width: `${panelW}%` }} title={`Front: ${f.panelWidthMm}mm`} />
                </div>
                <div className="guide-format-note">{f.note}</div>
              </div>
            );
          })}
        </div>
        <p className="guide-footnote">Measure your physical case for best accuracy — manufacturing varies a mm or two.</p>
      </section>

      <section className="guide-block">
        <div className="guide-block-label">Print tips</div>
        <ol className="guide-steps">
          {PRINT_TIPS.map((tip, i) => (
            <li key={i}>
              <span className="guide-step-num">{i + 1}</span>
              <span>{tip}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="guide-block">
        <div className="guide-block-label">Find cover art</div>
        <div className="guide-links">
          {ART_SOURCES.map(s => (
            <a key={s.href} className="guide-link-card" href={s.href} target="_blank" rel="noreferrer">
              <div>
                <div className="guide-link-name">{s.name}</div>
                <div className="guide-link-desc">{s.desc}</div>
              </div>
              <ExternalLinkIcon width={13} height={13} />
            </a>
          ))}
        </div>
      </section>

    </div>
  );
}

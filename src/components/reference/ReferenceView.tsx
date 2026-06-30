import { CASE_FORMATS } from '../../data/caseFormats';
import { ExternalLinkIcon } from '../shell/icons';
import { wrapWidthMm, wrapHeightMm } from '../../lib/geometry';

export function GuideView() {
  return (
    <div className="reference-view">
      <section>
        <h2>Dimension reference</h2>
        <p className="muted">Measure your physical case for best accuracy. Manufacturing varies a millimetre or two.</p>
        <div className="format-card-grid">
          {CASE_FORMATS.map(f => (
            <div key={f.id} className="format-card">
              <div className="format-card-title">{f.shortLabel}</div>
              <div className="format-card-dims">{wrapWidthMm(f).toFixed(0)} × {wrapHeightMm(f).toFixed(0)} mm · {f.spineMm}mm spine</div>
              <div className="format-card-note">{f.note}</div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2>Print tips</h2>
        <ul>
          <li>Print at <strong>Actual size / 100%</strong>, never "Fit to page".</li>
          <li>Borderless printing removes white edges if your printer supports it.</li>
          <li>Glossy or semi-gloss photo paper looks closest to retail.</li>
          <li>Trim with a straightedge and sharp blade for a clean spine fold.</li>
        </ul>
      </section>
      <section>
        <h2>Find cover art</h2>
        <div className="link-list">
          <a href="https://www.thecoverproject.net" target="_blank" rel="noreferrer">
            <ExternalLinkIcon width={13} height={13}/> The Cover Project
          </a>
          <a href="https://www.steamgamecovers.com" target="_blank" rel="noreferrer">
            <ExternalLinkIcon width={13} height={13}/> SteamGameCovers
          </a>
        </div>
      </section>
    </div>
  );
}

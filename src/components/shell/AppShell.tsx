import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { ViewKey } from "../../types";
import { MenuHub } from "./MenuHub";
import { KirbyLoading } from "./KirbyLoading";

const LABELS: Record<ViewKey, string> = {
  workshop: "Workshop",
  library: "My Covers",
  guide: "Help & Sizes",
  history: "History",
};

const VIEW_COLORS: Record<ViewKey, { c: string; bg: string; dot: string }> = {
  workshop: { c: "#e85533", bg: "#fff8f6", dot: "rgba(232,85,51,0.045)" },
  library: { c: "#3aaa55", bg: "#f6fff8", dot: "rgba(58,170,85,0.045)" },
  guide: { c: "#cc44aa", bg: "#fff5fc", dot: "rgba(204,68,170,0.045)" },
  history: { c: "#7744bb", bg: "#faf6ff", dot: "rgba(119,68,187,0.045)" },
};

interface Props {
  active: ViewKey | null;
  onSelect: (v: ViewKey) => void;
  onBack: () => void;
  children: ReactNode;
  isLoading?: boolean;
  onLoadDone?: () => void;
}

export function AppShell({
  active,
  onSelect,
  onBack,
  children,
  isLoading,
  onLoadDone,
}: Props) {
  const [exiting, setExiting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);
  const [screenOn, setScreenOn] = useState(true);
  const [powerAnim, setPowerAnim] = useState<"off" | "on" | null>(null);
  const modalShownRef = useRef(false);

  function closeModal() {
    setModalClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setModalClosing(false);
    }, 200);
  }
  const colors = active ? VIEW_COLORS[active] : null;

  useEffect(() => {
    if (!isLoading && !modalShownRef.current) {
      modalShownRef.current = true;
      if (!localStorage.getItem("cw-welcome-seen")) {
        localStorage.setItem("cw-welcome-seen", "1");
        const t = setTimeout(() => setShowModal(true), 350);
        return () => clearTimeout(t);
      }
    }
  }, [isLoading]);

  const handleBack = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      onBack();
    }, 360);
  }, [exiting, onBack]);

  function toggleScreen() {
    if (powerAnim) return;
    if (screenOn) {
      setPowerAnim("off");
      setTimeout(() => {
        setScreenOn(false);
        setPowerAnim(null);
      }, 560);
    } else {
      setScreenOn(true);
      setPowerAnim("on");
      setTimeout(() => setPowerAnim(null), 560);
    }
  }

  const powerOverlayCls = [
    "screen-power-overlay",
    powerAnim === "off" ? "anim-off" : "",
    powerAnim === "on" ? "anim-on" : "",
    !screenOn && !powerAnim ? "is-off" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="shell-root">
      <div className="tv-screen-frame">
        <div className="dex-screen" data-view={active ?? "menu"}>
          {isLoading ? (
            <KirbyLoading onDone={onLoadDone!} />
          ) : active === null ? (
            <MenuHub onSelect={onSelect} />
          ) : (
            <div
              className={`section-view${exiting ? " is-exiting" : ""}`}
              style={
                {
                  "--c": colors!.c,
                  "--section-bg": colors!.bg,
                  "--section-dot": colors!.dot,
                } as React.CSSProperties
              }
            >
              <div className="section-header">
                <span className="section-header-title">{LABELS[active]}</span>
                <button
                  type="button"
                  className="section-back-btn"
                  onClick={handleBack}
                >
                  ◀ Back
                </button>
              </div>
              <div className="section-content">{children}</div>
            </div>
          )}

          {/* CRT power off/on overlay */}
          <div className={powerOverlayCls} />

          {/* Instructions modal */}
          {showModal && (
            <div
              className={`modal-backdrop${modalClosing ? " is-closing" : ""}`}
              onClick={closeModal}
            >
              <div
                className={`modal-card${modalClosing ? " is-closing" : ""}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <span className="modal-title">Cover Works</span>
                  <button
                    type="button"
                    className="modal-close"
                    onClick={closeModal}
                  >
                    ✕
                  </button>
                </div>
                <p className="modal-desc">
                  Design and print custom game case covers for PS4/PS5 and
                  Nintendo Switch.
                </p>
                <ul className="modal-steps">
                  <li>
                    <strong>Workshop</strong> - pick a format, upload art,
                    export PDF
                  </li>
                  <li>
                    <strong>My Covers</strong> - save and reopen your designs
                  </li>
                  <li>
                    <strong>Guide</strong> - exact dimensions and print tips
                  </li>
                  <li>
                    <strong>History</strong> - case format timeline
                  </li>
                </ul>
                <button
                  type="button"
                  className="modal-cta"
                  onClick={closeModal}
                >
                  Let's go →
                </button>
                <p className="modal-hint">
                  Reopen anytime with the left knob below
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="tv-bottom-strip">
        <div className="tv-knob-group">
          <button
            type="button"
            className="tv-knob tv-knob-btn"
            title="Help / Instructions"
            data-glyph="?"
            onClick={() => {
              if (screenOn) setShowModal(true);
            }}
          />
          <button
            type="button"
            className="tv-knob tv-knob-btn"
            title="Toggle display"
            data-glyph="⏻"
            onClick={toggleScreen}
          />
        </div>
        <div className="tv-brand">COVER WORKS</div>
        <div className={`tv-power-led${!screenOn ? " led-off" : ""}`} />
      </div>
    </div>
  );
}

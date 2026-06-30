import { useState, useEffect, useCallback, useMemo } from "react";
import type { ViewKey } from "../../types";

/* ── icons (16×16) ─────────────────────────────────────── */
const ICON_WORKSHOP = [
  "......####......",
  ".....######.....",
  "....########....",
  "...####..####...",
  "..####....####..",
  ".####......####.",
  "####......######",
  "################",
  "################",
  "####......######",
  ".####......####.",
  "..####....####..",
  "...####..####...",
  "....########....",
  ".....######.....",
  "......####......",
];

const ICON_LIBRARY = [
  "################",
  "################",
  "................",
  ".##############.",
  ".##############.",
  "................",
  "..############..",
  "..############..",
  "................",
  "...##########...",
  "...##########...",
  "................",
  "....########....",
  "....########....",
  "................",
  ".....######.....",
];

const ICON_GUIDE = [
  ".......##.......",
  "......####......",
  ".....######.....",
  "....##....##....",
  "...##......##...",
  "..##........##..",
  ".##..........##.",
  "##..........####",
  "##..........####",
  ".##..........##.",
  "..##........##..",
  "...##......##...",
  "....##....##....",
  ".....######.....",
  "......####......",
  ".......##.......",
];

const ICON_READ = [
  "................",
  ".##############.",
  ".#............#.",
  ".#.##########.#.",
  ".#.##########.#.",
  ".#............#.",
  ".#.#########..#.",
  ".#.#########..#.",
  ".#............#.",
  ".#.##########.#.",
  ".#.##########.#.",
  ".#............#.",
  ".#.#########..#.",
  ".#............#.",
  ".##############.",
  "................",
];

const ICON_HISTORY = [
  "################",
  ".##############.",
  "..############..",
  "...##########...",
  "....########....",
  ".....######.....",
  "......####......",
  ".......##.......",
  ".......##.......",
  "......####......",
  ".....######.....",
  "....########....",
  "...##########...",
  "..############..",
  ".##############.",
  "################",
];

const ICON_ABOUT = [
  "................",
  "..####....####..",
  ".######..######.",
  "################",
  "################",
  ".##############.",
  "..############..",
  "...##########...",
  "....########....",
  ".....######.....",
  "......####......",
  ".......##.......",
  "................",
  "................",
  "................",
  "................",
];

/* ── pixel icon renderer ────────────────────────────────── */
function PixelIcon({
  art,
  color,
  size,
  className,
}: {
  art: string[];
  color: string;
  size: number;
  className?: string;
}) {
  const dim = art[0]?.length ?? 16;
  return (
    <svg
      viewBox={`0 0 ${dim} ${dim}`}
      width={size}
      height={size}
      className={className}
      style={{ imageRendering: "pixelated", display: "block", flexShrink: 0 }}
      aria-hidden="true"
    >
      {art.flatMap((row, y) =>
        [...row].map((ch, x) =>
          ch === "#" ? (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill={color}
            />
          ) : null,
        ),
      )}
    </svg>
  );
}

/* ── card types ─────────────────────────────────────────── */
interface NavCard {
  type: "nav";
  key: ViewKey;
  label: string;
  subtitle: string;
  size: "lg" | "md" | "sm";
  rot: string;
  color: string;
  icon: string[];
}

interface LinkCard {
  type: "link";
  href: string;
  label: string;
  subtitle: string;
  size: "lg" | "md" | "sm";
  rot: string;
  color: string;
  icon: string[];
}

type CardDef = NavCard | LinkCard;

/* ─── Desk decorations ──────────────────────────────────────── */
type DecoKind =
  | "pencil"
  | "paperclip"
  | "star"
  | "heart"
  | "scratch"
  | "band"
  | "eraser"
  | "highlighter"
  | "pushpin"
  | "tape"
  | "sticky"
  | "ruler"
  | "pen"
  | "washi"
  | "binderclip"
  | "bolt"
  | "flower";
interface Deco {
  id: number;
  kind: DecoKind;
  x: number;
  y: number;
  rot: number;
  color: string;
}

function xorRand(seed: number) {
  let s = (seed ^ 0xdeadbeef) >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

const DECO_ZONES: [number, number, number, number][] = [
  [2, 17, 5, 22],
  [80, 97, 5, 22],
  [2, 14, 26, 56],
  [84, 97, 26, 56],
  [2, 14, 58, 88],
  [84, 97, 58, 88],
  [16, 46, 84, 97],
  [54, 84, 84, 97],
  [24, 48, 3, 15],
  [52, 76, 3, 15],
];
const DECO_KINDS: DecoKind[] = [
  "pencil",
  "paperclip",
  "star",
  "heart",
  "scratch",
  "band",
  "eraser",
  "highlighter",
  "pushpin",
  "tape",
  "sticky",
  "ruler",
  "pen",
  "washi",
  "binderclip",
  "bolt",
  "flower",
];
const DECO_COLORS = [
  "#e85533",
  "#3aaa55",
  "#cc44aa",
  "#5566dd",
  "#e8920a",
  "#7744bb",
  "#00aacc",
  "#dd2255",
  "#f5c318",
  "#44bbaa",
];

function makeDecos(): Deco[] {
  const rand = xorRand(Date.now());
  const shuffle = <T,>(arr: T[]) => [...arr].sort(() => rand() - 0.5);
  const zones = shuffle(DECO_ZONES);
  const kinds = shuffle(DECO_KINDS); // shuffled = no repeats until all kinds used
  const count = 4;
  return zones.slice(0, count).map((z, i) => ({
    id: i,
    kind: kinds[i],
    x: z[0] + rand() * (z[1] - z[0]),
    y: z[2] + rand() * (z[3] - z[2]),
    rot: (rand() - 0.5) * 80,
    color: DECO_COLORS[Math.floor(rand() * DECO_COLORS.length)],
  }));
}

function PencilSVG() {
  return (
    <svg
      width="300"
      height="44"
      viewBox="0 0 150 22"
      style={{ display: "block" }}
    >
      <polygon points="0,11 16,4 16,18" fill="#d4955a" />
      <polygon points="0,11 5,9 5,13" fill="#555" />
      <rect x="16" y="3" width="100" height="16" fill="#FFD700" />
      <rect x="16" y="7" width="100" height="2.5" fill="rgba(0,0,0,0.07)" />
      <rect x="16" y="12" width="100" height="2.5" fill="rgba(0,0,0,0.07)" />
      <rect x="116" y="2" width="14" height="18" fill="#c0c4cc" />
      <rect x="116" y="7" width="14" height="8" fill="#aaaab8" />
      <rect x="130" y="3" width="20" height="16" rx="4" fill="#f090a8" />
      <rect
        x="132"
        y="5"
        width="12"
        height="4"
        rx="1.5"
        fill="rgba(255,255,255,0.4)"
      />
    </svg>
  );
}

function PaperclipSVG() {
  return (
    <svg
      width="18"
      height="46"
      viewBox="0 0 18 46"
      style={{ display: "block" }}
    >
      <path
        d="M4 42 L4 9 Q4 2 9 2 Q14 2 14 9 L14 34 Q14 42 9 42 Q4 42 4 36 L4 18 Q4 12 8 12 Q12 12 12 18 L12 36"
        fill="none"
        stroke="#9ba8b8"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarSVG({ color }: { color: string }) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const r = i % 2 === 0 ? 13 : 5.5;
    return `${(19 + r * Math.cos(a)).toFixed(2)},${(19 + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 38 38"
      style={{ display: "block" }}
    >
      <circle cx="19" cy="19" r="18" fill={color} />
      <circle
        cx="19"
        cy="19"
        r="18"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.5"
      />
      <polygon points={pts} fill="rgba(255,255,255,0.92)" />
    </svg>
  );
}

function HeartSVG({ color }: { color: string }) {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 38 38"
      style={{ display: "block" }}
    >
      <circle cx="19" cy="19" r="18" fill={color} />
      <circle
        cx="19"
        cy="19"
        r="18"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.5"
      />
      <path
        d="M19,30 C19,30 7,21.5 7,13.5 C7,9 10.2,6 14,6 C16.2,6 18.1,7.2 19,9 C19.9,7.2 21.8,6 24,6 C27.8,6 31,9 31,13.5 C31,21.5 19,30 19,30Z"
        fill="rgba(255,255,255,0.92)"
      />
    </svg>
  );
}

function ScratchSVG() {
  return (
    <svg
      width="88"
      height="36"
      viewBox="0 0 88 36"
      style={{ display: "block" }}
    >
      <line
        x1="4"
        y1="32"
        x2="80"
        y2="4"
        stroke="rgba(62,30,4,0.22)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="14"
        y1="34"
        x2="60"
        y2="10"
        stroke="rgba(62,30,4,0.13)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="22"
        y1="33"
        x2="48"
        y2="18"
        stroke="rgba(130,88,18,0.16)"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BandSVG({ color }: { color: string }) {
  return (
    <svg
      width="58"
      height="30"
      viewBox="0 0 58 30"
      style={{ display: "block" }}
    >
      <ellipse
        cx="29"
        cy="15"
        rx="26"
        ry="12"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeOpacity="0.7"
      />
    </svg>
  );
}

function EraserSVG({ color }: { color: string }) {
  return (
    <svg
      width="110"
      height="52"
      viewBox="0 0 64 30"
      style={{ display: "block" }}
    >
      <rect
        x="2"
        y="2"
        width="60"
        height="26"
        rx="5"
        fill={color}
        opacity="0.85"
      />
      <rect
        x="2"
        y="2"
        width="60"
        height="11"
        rx="5"
        fill="rgba(255,255,255,0.22)"
      />
      <rect x="2" y="20" width="60" height="8" rx="3" fill="rgba(0,0,0,0.08)" />
      <line
        x1="12"
        y1="6"
        x2="12"
        y2="24"
        stroke="rgba(0,0,0,0.09)"
        strokeWidth="1.5"
      />
      <line
        x1="24"
        y1="6"
        x2="24"
        y2="24"
        stroke="rgba(0,0,0,0.09)"
        strokeWidth="1.5"
      />
      <line
        x1="36"
        y1="6"
        x2="36"
        y2="24"
        stroke="rgba(0,0,0,0.09)"
        strokeWidth="1.5"
      />
      <line
        x1="48"
        y1="6"
        x2="48"
        y2="24"
        stroke="rgba(0,0,0,0.09)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function HighlighterSVG({ color }: { color: string }) {
  return (
    <svg
      width="260"
      height="52"
      viewBox="0 0 120 24"
      style={{ display: "block" }}
    >
      <rect
        x="0"
        y="4"
        width="18"
        height="16"
        rx="4"
        fill={color}
        opacity="0.75"
      />
      <rect
        x="2"
        y="6"
        width="14"
        height="7"
        rx="2"
        fill="rgba(255,255,255,0.3)"
      />
      <rect x="18" y="1" width="84" height="22" rx="7" fill={color} />
      <rect
        x="18"
        y="1"
        width="84"
        height="10"
        rx="7"
        fill="rgba(255,255,255,0.28)"
      />
      <rect x="92" y="3" width="4" height="18" rx="2" fill="rgba(0,0,0,0.1)" />
      <rect x="98" y="3" width="4" height="18" rx="2" fill="rgba(0,0,0,0.1)" />
      <polygon points="102,5 120,9 120,15 102,19" fill={color} opacity="0.9" />
      <polygon
        points="102,7 120,10 120,13 102,16"
        fill="rgba(255,255,255,0.28)"
      />
    </svg>
  );
}

function PushpinSVG({ color }: { color: string }) {
  return (
    <svg
      width="30"
      height="48"
      viewBox="0 0 30 48"
      style={{ display: "block" }}
    >
      <circle cx="15" cy="13" r="12" fill={color} />
      <circle
        cx="15"
        cy="13"
        r="12"
        fill="none"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="1.5"
      />
      <ellipse
        cx="10"
        cy="8"
        rx="5"
        ry="3"
        fill="rgba(255,255,255,0.35)"
        transform="rotate(-20 10 8)"
      />
      <rect x="13.5" y="23" width="3" height="15" fill="#b0b8c4" />
      <polygon points="13.5,38 16.5,38 15,47" fill="#8898aa" />
      <ellipse cx="15" cy="25" rx="4" ry="2" fill="rgba(0,0,0,0.15)" />
    </svg>
  );
}

function TapeSVG() {
  return (
    <svg
      width="80"
      height="20"
      viewBox="0 0 80 20"
      style={{ display: "block" }}
    >
      <rect
        x="0"
        y="3"
        width="80"
        height="14"
        rx="2"
        fill="rgba(190,225,255,0.38)"
      />
      <rect
        x="0"
        y="3"
        width="80"
        height="14"
        rx="2"
        fill="none"
        stroke="rgba(160,205,240,0.5)"
        strokeWidth="1"
      />
      <rect
        x="4"
        y="5"
        width="72"
        height="5"
        rx="1"
        fill="rgba(255,255,255,0.32)"
      />
      <path
        d="M1,3 Q4,7 1,10 Q4,14 1,17"
        fill="none"
        stroke="rgba(160,205,240,0.55)"
        strokeWidth="1.5"
      />
      <path
        d="M79,3 Q76,7 79,10 Q76,14 79,17"
        fill="none"
        stroke="rgba(160,205,240,0.55)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function StickySVG({ color }: { color: string }) {
  return (
    <svg
      width="130"
      height="130"
      viewBox="0 0 52 52"
      style={{ display: "block" }}
    >
      <rect x="4" y="4" width="46" height="46" rx="2" fill="rgba(0,0,0,0.1)" />
      <rect
        x="2"
        y="2"
        width="46"
        height="46"
        rx="2"
        fill={color}
        opacity="0.85"
      />
      <polygon points="36,2 48,14 36,14" fill="rgba(0,0,0,0.12)" />
      <polygon points="36,2 48,2 48,14" fill="rgba(255,255,255,0.25)" />
      <line
        x1="8"
        y1="20"
        x2="38"
        y2="20"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="1.5"
      />
      <line
        x1="8"
        y1="28"
        x2="38"
        y2="28"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="1.5"
      />
      <line
        x1="8"
        y1="36"
        x2="30"
        y2="36"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function RulerSVG() {
  const ticks = Array.from({ length: 17 }, (_, i) => i);
  return (
    <svg
      width="190"
      height="34"
      viewBox="0 0 190 34"
      style={{ display: "block" }}
    >
      <rect x="0" y="5" width="190" height="24" rx="3" fill="#fffde8" />
      <rect
        x="0"
        y="5"
        width="190"
        height="24"
        rx="3"
        fill="none"
        stroke="#ccc070"
        strokeWidth="1.5"
      />
      {ticks.map((i) => {
        const x = 7 + i * 11;
        const long = i % 5 === 0;
        return (
          <line
            key={i}
            x1={x}
            y1="5"
            x2={x}
            y2={long ? 18 : 13}
            stroke="#aaa050"
            strokeWidth={long ? 1.5 : 1}
          />
        );
      })}
      {[0, 5, 10, 15].map((n) => (
        <text
          key={n}
          x={7 + n * 11}
          y={28}
          fontSize="7.5"
          fontFamily="monospace"
          fill="#887a30"
          textAnchor="middle"
        >
          {n}
        </text>
      ))}
    </svg>
  );
}

function PenSVG() {
  return (
    <svg
      width="300"
      height="27"
      viewBox="0 0 200 18"
      style={{ display: "block" }}
    >
      <polygon points="0,9 12,6.5 12,11.5" fill="#555" />
      <polygon points="12,5.5 22,7 22,11 12,12.5" fill="#888" />
      <rect x="22" y="3" width="148" height="12" rx="2" fill="#222" />
      <rect
        x="22"
        y="3"
        width="148"
        height="5"
        rx="2"
        fill="rgba(255,255,255,0.07)"
      />
      <rect x="24" y="4" width="26" height="10" rx="2" fill="#3a3a3a" />
      {[30, 36, 42].map((x) => (
        <line
          key={x}
          x1={x}
          y1="4"
          x2={x}
          y2="14"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="2"
        />
      ))}
      <rect x="158" y="1" width="4" height="16" rx="2" fill="#555" />
      <rect x="156" y="1" width="5" height="4" rx="1" fill="#666" />
      <rect x="170" y="2" width="30" height="14" rx="4" fill="#333" />
      <rect
        x="172"
        y="4"
        width="16"
        height="4"
        rx="2"
        fill="rgba(255,255,255,0.07)"
      />
    </svg>
  );
}

function WashiSVG({ color }: { color: string }) {
  return (
    <svg
      width="110"
      height="28"
      viewBox="0 0 110 28"
      style={{ display: "block" }}
    >
      <rect x="0" y="4" width="110" height="20" fill={color} opacity="0.65" />
      {Array.from({ length: 13 }, (_, i) => (
        <circle
          key={i}
          cx={6 + i * 8}
          cy="14"
          r="2.5"
          fill="rgba(255,255,255,0.55)"
        />
      ))}
      <rect x="0" y="4" width="110" height="2" fill="rgba(0,0,0,0.07)" />
      <rect x="0" y="22" width="110" height="2" fill="rgba(0,0,0,0.07)" />
      <rect x="0" y="5" width="110" height="6" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
}

function BinderClipSVG({ color }: { color: string }) {
  return (
    <svg
      width="46"
      height="54"
      viewBox="0 0 46 54"
      style={{ display: "block" }}
    >
      <path
        d="M4,8 L42,8 L42,38 Q42,42 38,42 L8,42 Q4,42 4,38 Z"
        fill={color}
        opacity="0.85"
      />
      <path d="M4,8 L42,8 L42,22 L4,22 Z" fill="rgba(255,255,255,0.15)" />
      <path
        d="M14,8 Q14,0 23,0 Q32,0 32,8"
        fill="none"
        stroke="#6a7890"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <line
        x1="14"
        y1="42"
        x2="10"
        y2="54"
        stroke="#6a7890"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="32"
        y1="42"
        x2="36"
        y2="54"
        stroke="#6a7890"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BoltSVG({ color }: { color: string }) {
  return (
    <svg
      width="36"
      height="54"
      viewBox="0 0 36 54"
      style={{ display: "block" }}
    >
      <polygon points="22,1 3,30 17,30 14,53 33,22 19,22" fill={color} />
      <polygon
        points="22,1 3,30 17,30 14,53 33,22 19,22"
        fill="none"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <polygon points="20,7 7,28 18,28" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
}

function FlowerSVG({ color }: { color: string }) {
  const petals = Array.from({ length: 6 }, (_, i) => {
    const a = (i * Math.PI) / 3;
    const cx = (19 + 10 * Math.cos(a)).toFixed(2);
    const cy = (19 + 10 * Math.sin(a)).toFixed(2);
    return (
      <ellipse
        key={i}
        cx={cx}
        cy={cy}
        rx="7.5"
        ry="5"
        fill={color}
        opacity="0.88"
        transform={`rotate(${i * 60},${cx},${cy})`}
      />
    );
  });
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 38 38"
      style={{ display: "block" }}
    >
      {petals}
      <circle cx="19" cy="19" r="7" fill="#FFD700" />
      <circle cx="19" cy="19" r="5" fill="#FFE840" />
      <circle cx="17" cy="17" r="1.5" fill="rgba(0,0,0,0.14)" />
      <circle cx="21" cy="18" r="1" fill="rgba(0,0,0,0.1)" />
    </svg>
  );
}

function DecoItem({ d }: { d: Deco }) {
  const style: React.CSSProperties = {
    position: "absolute",
    left: `${d.x}%`,
    top: `${d.y}%`,
    transform: `translate(-50%,-50%) rotate(${d.rot}deg)`,
    pointerEvents: "none",
    userSelect: "none",
    zIndex: 1,
    opacity: 0.9,
  };
  const el =
    d.kind === "pencil" ? (
      <PencilSVG />
    ) : d.kind === "paperclip" ? (
      <PaperclipSVG />
    ) : d.kind === "star" ? (
      <StarSVG color={d.color} />
    ) : d.kind === "heart" ? (
      <HeartSVG color={d.color} />
    ) : d.kind === "scratch" ? (
      <ScratchSVG />
    ) : d.kind === "band" ? (
      <BandSVG color={d.color} />
    ) : d.kind === "eraser" ? (
      <EraserSVG color={d.color} />
    ) : d.kind === "highlighter" ? (
      <HighlighterSVG color={d.color} />
    ) : d.kind === "pushpin" ? (
      <PushpinSVG color={d.color} />
    ) : d.kind === "tape" ? (
      <TapeSVG />
    ) : d.kind === "sticky" ? (
      <StickySVG color={d.color} />
    ) : d.kind === "ruler" ? (
      <RulerSVG />
    ) : d.kind === "pen" ? (
      <PenSVG />
    ) : d.kind === "washi" ? (
      <WashiSVG color={d.color} />
    ) : d.kind === "binderclip" ? (
      <BinderClipSVG color={d.color} />
    ) : d.kind === "bolt" ? (
      <BoltSVG color={d.color} />
    ) : d.kind === "flower" ? (
      <FlowerSVG color={d.color} />
    ) : null;
  return <div style={style}>{el}</div>;
}

function DeskDecorations() {
  const decos = useMemo(() => makeDecos(), []);
  return (
    <>
      {decos.map((d) => (
        <DecoItem key={d.id} d={d} />
      ))}
    </>
  );
}

/* grid: row1 → Workshop, My Covers, Guide | row2 → History, About, Read */
const CARDS: CardDef[] = [
  {
    type: "nav",
    key: "workshop",
    label: "Workshop",
    subtitle: "Design and export game covers",
    size: "md",
    rot: "-1.5deg",
    color: "#e85533",
    icon: ICON_WORKSHOP,
  },
  {
    type: "nav",
    key: "library",
    label: "My Covers",
    subtitle: "Browse your saved designs",
    size: "md",
    rot: "2deg",
    color: "#3aaa55",
    icon: ICON_LIBRARY,
  },
  {
    type: "nav",
    key: "guide",
    label: "Guide",
    subtitle: "Size charts and print tips",
    size: "md",
    rot: "1deg",
    color: "#cc44aa",
    icon: ICON_GUIDE,
  },
  {
    type: "nav",
    key: "history",
    label: "History",
    subtitle: "PlayStation and Nintendo case timelines",
    size: "md",
    rot: "1.5deg",
    color: "#7744bb",
    icon: ICON_HISTORY,
  },
  {
    type: "link",
    href: "https://github.com/musaad-hydary/coverworks",
    label: "Source",
    subtitle: "View source on GitHub",
    size: "md",
    rot: "-1deg",
    color: "#5566dd",
    icon: ICON_ABOUT,
  },
  {
    type: "link",
    href: "https://musaadh.substack.com/p/from-loose-disc-to-print-ready-pdf",
    label: "Read",
    subtitle: "Behind the project on Substack",
    size: "md",
    rot: "-2deg",
    color: "#e8920a",
    icon: ICON_READ,
  },
];

/* ── component ──────────────────────────────────────────── */
export function MenuHub({ onSelect }: { onSelect: (v: ViewKey) => void }) {
  const [flyingKey, setFlyingKey] = useState<ViewKey | null>(null);
  const [entering, setEntering] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setEntering(false), 700);
    return () => clearTimeout(id);
  }, []);

  const handleClick = useCallback(
    (card: CardDef) => {
      if (flyingKey !== null) return;

      if (card.type === "link") {
        window.open(card.href, "_blank", "noopener,noreferrer");
        return;
      }

      setFlyingKey(card.key);
      setTimeout(() => onSelect(card.key), 460);
    },
    [flyingKey, onSelect],
  );

  return (
    <div className="desk-bg">
      <DeskDecorations />
      <div className="desk-menu-label">Main Menu</div>
      <div className="desk-cw-title">
        <div className="cw-card cw-card-1">Cover</div>
        <div className="cw-card cw-card-2">Works</div>
      </div>

      <div className={`desk-scene${flyingKey ? " has-flying" : ""}`}>
        {CARDS.map((card, i) => {
          const isFlying = card.type === "nav" && flyingKey === card.key;
          const iconSize = 52;

          return (
            <button
              key={card.type === "nav" ? card.key : card.label.toLowerCase()}
              type="button"
              className={[
                "menu-card",
                `card-${card.size}`,
                entering ? "card-entering" : "",
                isFlying ? "card-flying" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={
                {
                  "--rot": card.rot,
                  "--card-color": card.color,
                  "--enter-delay": `${i * 0.09}s`,
                } as React.CSSProperties
              }
              onClick={() => handleClick(card)}
              aria-label={card.label}
            >
              <div className="menu-card-header">
                <PixelIcon
                  art={card.icon}
                  color="rgba(255,255,255,0.88)"
                  size={28}
                />
                <span className="menu-card-title">{card.label}</span>
              </div>

              <div className="menu-card-body">
                <PixelIcon
                  art={card.icon}
                  color={card.color}
                  size={iconSize}
                  className="card-icon"
                />
                <div className="menu-card-text">
                  <div className="menu-card-subtitle">{card.subtitle}</div>
                  <div className="menu-card-cta">
                    {card.type === "link" ? "Open ↗" : "Open →"}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className={`desk-overlay${flyingKey ? " active" : ""}`} />
    </div>
  );
}

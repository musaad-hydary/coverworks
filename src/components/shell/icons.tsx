import type { SVGProps } from 'react';

function Base(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
}

export function LibraryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <rect x="3" y="3" width="14" height="14" rx="1.5" />
      <rect x="7" y="7" width="14" height="14" rx="1.5" />
    </Base>
  );
}

export function EditorIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <rect x="3" y="4" width="18" height="16" rx="1.5" />
      <circle cx="8.5" cy="9.5" r="1.4" />
      <path d="M21 16l-5.5-5.5L9 17" />
    </Base>
  );
}

export function PrintIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M6 9V3h12v6" />
      <rect x="4" y="9" width="16" height="8" rx="1" />
      <path d="M6 14h12v7H6z" />
    </Base>
  );
}

export function ReferenceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="11" x2="12" y2="16" />
      <circle cx="12" cy="8" r="0.6" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function UploadIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M12 16V4" />
      <path d="M6 9l6-6 6 6" />
      <path d="M4 20h16" />
    </Base>
  );
}

export function DownloadIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M12 4v12" />
      <path d="M6 11l6 6 6-6" />
      <path d="M4 20h16" />
    </Base>
  );
}

export function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </Base>
  );
}

export function TrashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M6 7l1 13h10l1-13" />
    </Base>
  );
}

export function ExternalLinkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M14 4h6v6" />
      <path d="M20 4l-9 9" />
      <path d="M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6" />
    </Base>
  );
}

export function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </Base>
  );
}

export function ChevronLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M15 18l-6-6 6-6" />
    </Base>
  );
}

export function UndoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M3 10h10a6 6 0 0 1 0 12H9" />
      <path d="M3 10l4-4-4-4" transform="scale(1,-1) translate(0,-20)" />
      <path d="M7 6L3 10l4 4" />
    </Base>
  );
}

export function RedoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M21 10H11a6 6 0 0 0 0 12h4" />
      <path d="M17 6l4 4-4 4" />
    </Base>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </Base>
  );
}

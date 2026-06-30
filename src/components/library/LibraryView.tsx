import type { CoverProject } from '../../types';
import { getFormatById } from '../../data/caseFormats';
import { PlusIcon, TrashIcon } from '../shell/icons';

interface Props {
  projects: CoverProject[];
  onOpen: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
}

function thumbnailUrl(project: CoverProject): string | undefined {
  if (project.mode === 'wrap') return project.wrapImage?.dataUrl;
  return project.panelImages.front?.dataUrl ?? project.panelImages.back?.dataUrl;
}

export function LibraryView({ projects, onOpen, onCreate, onDelete }: Props) {
  return (
    <div className="item-row">
      {projects.map((project) => {
        const format = getFormatById(project.formatId, project.customFormat);
        const thumb = thumbnailUrl(project);
        return (
          <div key={project.id} className="item">
            <button
              type="button"
              className="case-tile"
              style={thumb ? { backgroundImage: `url(${thumb})` } : undefined}
              onClick={() => onOpen(project.id)}
              aria-label={`Open ${project.title}`}
            >
              {!thumb && <PlusIcon className="case-tile-icon" />}
            </button>
            <div className="item-label">
              <div className="item-title">{project.title}</div>
              <div className="item-meta">
                {format.shortLabel} · {new Date(project.updatedAt).toLocaleDateString()}
              </div>
              <button
                type="button"
                className="item-delete"
                onClick={() => onDelete(project.id)}
                aria-label={`Delete ${project.title}`}
              >
                <TrashIcon width={14} height={14} />
                remove
              </button>
            </div>
          </div>
        );
      })}
      <div className="item">
        <button type="button" className="case-tile add" onClick={onCreate} aria-label="New cover">
          <PlusIcon className="case-tile-icon" />
        </button>
        <div className="item-label">
          <div className="item-title">New cover</div>
          <div className="item-meta">choose a case format</div>
        </div>
      </div>
    </div>
  );
}

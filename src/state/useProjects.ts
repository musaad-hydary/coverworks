import { useCallback, useEffect, useState } from 'react';
import type { CoverProject } from '../types';
import { CASE_FORMATS } from '../data/caseFormats';

const KEY = 'coverworks.projects.v2';

function load(): CoverProject[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

export function makeBlank(title = 'Untitled cover'): CoverProject {
  return {
    id: `proj-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
    title,
    formatId: CASE_FORMATS[0].id,
    mode: 'wrap',
    panelImages: {},
    spineText: '',
    overlays: [],
    paperSizeId: 'letter',
    trimMarks: true,
    updatedAt: Date.now(),
  };
}

export function useProjects() {
  const [projects, setProjects] = useState<CoverProject[]>(load);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(projects)); } catch {}
  }, [projects]);

  const upsert = useCallback((p: CoverProject) => {
    setProjects(prev => [{ ...p, updatedAt: Date.now() }, ...prev.filter(x => x.id !== p.id)]);
  }, []);

  const remove = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  }, []);

  return { projects, upsert, remove };
}

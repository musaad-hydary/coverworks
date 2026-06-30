import { lazy, Suspense, useState } from 'react';
import type { ViewKey, CoverProject } from './types';
import { AppShell } from './components/shell/AppShell';
import { useProjects, makeBlank } from './state/useProjects';

const WorkshopView = lazy(() => import('./components/workshop/WorkshopView').then(m => ({ default: m.WorkshopView })));
const LibraryView  = lazy(() => import('./components/library/LibraryView').then(m => ({ default: m.LibraryView })));
const GuideView    = lazy(() => import('./components/reference/ReferenceView').then(m => ({ default: m.GuideView })));
const HistoryView  = lazy(() => import('./components/history/HistoryView').then(m => ({ default: m.HistoryView })));

export default function App() {
  const { projects, upsert, remove } = useProjects();
  const [view, setView] = useState<ViewKey | null>(null);
  const [draft, setDraft] = useState<CoverProject>(() => makeBlank());
  const [loading, setLoading] = useState(true);

  function openProject(id: string) {
    const found = projects.find(p => p.id === id);
    if (found) { setDraft(found); setView('workshop'); }
  }

  function newProject() { setDraft(makeBlank()); setView('workshop'); }

  return (
    <AppShell
      active={view}
      isLoading={loading}
      onLoadDone={() => setLoading(false)}
      onSelect={v => { if (v === 'workshop') newProject(); else setView(v as typeof view); }}
      onBack={() => setView(null)}
    >
      <Suspense fallback={null}>
        {view === 'workshop' && <WorkshopView project={draft} onChange={setDraft} onSave={() => upsert(draft)} />}
        {view === 'library'  && <LibraryView projects={projects} onOpen={openProject} onCreate={newProject} onDelete={remove} />}
        {view === 'guide'    && <GuideView />}
        {view === 'history'  && <HistoryView />}
      </Suspense>
    </AppShell>
  );
}

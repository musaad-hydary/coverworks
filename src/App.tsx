import { lazy, Suspense, useEffect, useState } from 'react';
import type { ViewKey, CoverProject } from './types';
import { AppShell } from './components/shell/AppShell';
import { useProjects, makeBlank } from './state/useProjects';
import { useUndoable } from './lib/useUndoable';

const WorkshopView = lazy(() => import('./components/workshop/WorkshopView').then(m => ({ default: m.WorkshopView })));
const LibraryView  = lazy(() => import('./components/library/LibraryView').then(m => ({ default: m.LibraryView })));
const GuideView    = lazy(() => import('./components/reference/ReferenceView').then(m => ({ default: m.GuideView })));
const HistoryView  = lazy(() => import('./components/history/HistoryView').then(m => ({ default: m.HistoryView })));

export default function App() {
  const { projects, upsert, remove } = useProjects();
  const [view, setView] = useState<ViewKey | null>(null);
  const [loading, setLoading] = useState(true);
  const { current: draft, set: setDraft, replace: replaceDraft, undo, redo, canUndo, canRedo } = useUndoable<CoverProject>(makeBlank());

  function openProject(id: string) {
    const found = projects.find(p => p.id === id);
    if (found) { replaceDraft(found); setView('workshop'); }
  }

  function newProject() { replaceDraft(makeBlank()); setView('workshop'); }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (view !== 'workshop') return;
      if (!(e.metaKey || e.ctrlKey)) return;
      if (e.key === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); }
      if (e.key === 'y') { e.preventDefault(); redo(); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view, undo, redo]);

  return (
    <AppShell
      active={view}
      isLoading={loading}
      onLoadDone={() => setLoading(false)}
      onSelect={v => { if (v === 'workshop') newProject(); else setView(v as typeof view); }}
      onBack={() => setView(null)}
    >
      <Suspense fallback={null}>
        {view === 'workshop' && (
          <WorkshopView
            project={draft}
            onChange={setDraft}
            onSave={() => upsert(draft)}
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
        )}
        {view === 'library'  && <LibraryView projects={projects} onOpen={openProject} onCreate={newProject} onDelete={remove} />}
        {view === 'guide'    && <GuideView />}
        {view === 'history'  && <HistoryView />}
      </Suspense>
    </AppShell>
  );
}

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { CLIENTS } from '@/data/clients'
import { useBriefing } from '@/hooks/useBriefing'
import { Sidebar } from '@/components/Sidebar'
import { ClientForm } from '@/components/ClientForm'
import { RespostasView } from '@/components/RespostasView'
import { Button } from '@/components/ui/button'

export default function App() {
  const [activeId, setActiveId] = useState(CLIENTS[0].id)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeView, setActiveView] = useState('form') // 'form' | 'respostas'

  const briefing = useBriefing()
  const activeClient = CLIENTS.find(c => c.id === activeId)
  const activeIdx = CLIENTS.findIndex(c => c.id === activeId)
  const nextClient = CLIENTS[activeIdx + 1] ?? null

  function handleSelect(id) {
    setActiveId(id)
    setSidebarOpen(false)
  }

  if (briefing.loading) {
    return (
      <div className="dark flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <svg className="h-8 w-8 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <span className="text-sm font-medium">Carregando briefings…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="dark flex min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          activeId={activeId}
          onSelect={handleSelect}
          getProgress={briefing.getProgress}
          isCompleted={briefing.isCompleted}
          completedCount={briefing.completedCount}
          activeView={activeView}
          onViewChange={setActiveView}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-50">
            <Sidebar
              activeId={activeId}
              onSelect={handleSelect}
              getProgress={briefing.getProgress}
              isCompleted={briefing.isCompleted}
              completedCount={briefing.completedCount}
              activeView={activeView}
              onViewChange={setActiveView}
            />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 px-4 h-14 border-b border-border bg-background/95 backdrop-blur lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-semibold text-sm flex-1 truncate">
            {activeView === 'respostas' ? 'Respostas' : activeClient?.name}
          </span>
          <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/25 px-2.5 py-1 rounded-full">
            {briefing.completedCount}/{CLIENTS.length}
          </span>
        </header>

        {/* Form scroll area */}
        <main className="flex-1 overflow-y-auto">
          {activeView === 'respostas' ? (
            <RespostasView
              getValue={briefing.getValue}
              getProgress={briefing.getProgress}
              isCompleted={briefing.isCompleted}
              generateBriefingText={briefing.generateBriefingText}
              completedCount={briefing.completedCount}
            />
          ) : (
            activeClient && (
              <ClientForm
                key={activeId}
                client={activeClient}
                getValue={briefing.getValue}
                setValue={briefing.setValue}
                getProgress={briefing.getProgress}
                isCompleted={briefing.isCompleted}
                markComplete={briefing.markComplete}
                generateBriefingText={briefing.generateBriefingText}
                onNext={() => nextClient && setActiveId(nextClient.id)}
                nextClient={nextClient}
              />
            )
          )}
        </main>

      </div>
    </div>
  )
}

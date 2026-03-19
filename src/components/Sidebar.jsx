import { CheckCircle2 } from 'lucide-react'
import { CLIENTS } from '@/data/clients'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

export function Sidebar({ activeId, onSelect, getProgress, isCompleted, completedCount, activeView, onViewChange }) {
  const overallPct = Math.round((completedCount / CLIENTS.length) * 100)

  return (
    <aside className="flex flex-col w-72 shrink-0 border-r border-sidebar-border bg-sidebar h-screen sticky top-0 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-5 border-b border-sidebar-border shrink-0">
        <div className="flex items-center gap-2.5 mb-5">
          <img src="/favicon.svg" alt="Lone Mídia" className="h-7 w-7 shrink-0" />
          <div>
            <div className="text-sm font-bold text-sidebar-foreground leading-none">Lone Mídia</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">Briefing de Passagem</div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[11px] text-muted-foreground">Clientes concluídos</span>
            <span className="text-[11px] font-bold text-sidebar-primary">{completedCount} / {CLIENTS.length}</span>
          </div>
          <Progress value={overallPct} className="h-1.5 bg-muted" />
        </div>
      </div>

      {/* View toggle */}
      <div className="px-3 py-2 border-b border-sidebar-border shrink-0">
        <div className="flex rounded-[var(--radius-md)] bg-muted/30 p-0.5 gap-0.5">
          <button
            onClick={() => onViewChange('form')}
            className={cn(
              'flex-1 text-[12px] font-semibold py-1.5 rounded-[var(--radius-sm)] transition-colors',
              activeView === 'form'
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-muted-foreground hover:text-sidebar-foreground',
            )}
          >
            Briefings
          </button>
          <button
            onClick={() => onViewChange('respostas')}
            className={cn(
              'flex-1 text-[12px] font-semibold py-1.5 rounded-[var(--radius-sm)] transition-colors',
              activeView === 'respostas'
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-muted-foreground hover:text-sidebar-foreground',
            )}
          >
            Respostas
          </button>
        </div>
      </div>

      {/* Client list — só visível na view de briefings */}
      {activeView === 'form' && (
        <ScrollArea className="flex-1">
          <nav className="py-2">
            {CLIENTS.map(client => {
              const { filled, total, pct } = getProgress(client.id)
              const completed = isCompleted(client.id)
              const active = client.id === activeId

              return (
                <button
                  key={client.id}
                  onClick={() => onSelect(client.id)}
                  className={cn(
                    'w-full text-left px-4 py-3 border-l-2 transition-colors',
                    active
                      ? 'border-l-sidebar-primary bg-sidebar-accent/60'
                      : completed
                      ? 'border-l-emerald-500 hover:bg-sidebar-accent/30'
                      : 'border-l-transparent hover:bg-sidebar-accent/30',
                  )}
                >
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className={cn(
                      'text-[13px] font-semibold truncate leading-snug',
                      completed ? 'text-emerald-400' : 'text-sidebar-foreground',
                    )}>
                      {client.name}
                    </span>
                    {completed && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate mb-2">{client.segment}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground shrink-0">{filled}/{total}</span>
                    <Progress
                      value={pct}
                      className="flex-1 h-1"
                      indicatorClassName={completed ? 'bg-emerald-400' : undefined}
                    />
                  </div>
                </button>
              )
            })}
          </nav>
        </ScrollArea>
      )}
    </aside>
  )
}

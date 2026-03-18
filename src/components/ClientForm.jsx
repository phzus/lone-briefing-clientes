import { useState } from 'react'
import { CheckCircle2, ChevronRight, Send } from 'lucide-react'
import { UNIVERSAL_QUESTIONS } from '@/data/clients'
import { CLIENTS } from '@/data/clients'
import { QuestionCard } from '@/components/QuestionCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { BriefingModal } from '@/components/BriefingModal'
import { cn } from '@/lib/utils'

export function ClientForm({ client, getValue, setValue, getProgress, isCompleted, markComplete, generateBriefingText, onNext, nextClient }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [briefingText, setBriefingText] = useState('')

  const { filled, total, pct } = getProgress(client.id)
  const completed = isCompleted(client.id)

  function handleSubmit() {
    markComplete(client.id)
    setBriefingText(generateBriefingText(client))
    setModalOpen(true)
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 pb-24">
      {/* Hero */}
      <div className="mb-8 pb-7 border-b border-border">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground leading-tight">{client.name}</h1>
            <Badge variant="accent" className="mt-2">{client.segment}</Badge>
          </div>
          <div className="text-right min-w-[140px]">
            <p className="text-xs text-muted-foreground mb-1.5">{filled} de {total} perguntas respondidas</p>
            <Progress
              value={pct}
              className="h-1.5 w-36"
              indicatorClassName={completed ? 'bg-emerald-400' : undefined}
            />
          </div>
        </div>

        {completed && (
          <div className="mt-4 flex items-center gap-2 rounded-[var(--radius-md)] border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-400">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            Briefing deste cliente já foi enviado.
          </div>
        )}
      </div>

      {/* Universal questions */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">🌐 Perguntas Universais</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="flex flex-col gap-3">
          {UNIVERSAL_QUESTIONS.map(q => (
            <QuestionCard
              key={q.id}
              question={q}
              clientId={client.id}
              value={getValue(client.id, q.id)}
              onChange={v => setValue(client.id, q.id, v)}
            />
          ))}
        </div>
      </section>

      {/* Specific questions */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">📌 Perguntas Específicas</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="flex flex-col gap-3">
          {client.questions.map(q => (
            <QuestionCard
              key={q.id}
              question={q}
              clientId={client.id}
              value={getValue(client.id, q.id)}
              onChange={v => setValue(client.id, q.id, v)}
            />
          ))}
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-6 border-t border-border">
        <Button onClick={handleSubmit} className="gap-2">
          <Send className="h-4 w-4" />
          Enviar este cliente
        </Button>
        {nextClient && (
          <Button variant="outline" onClick={onNext} className="gap-2">
            Próximo: {nextClient.name}
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      <BriefingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        clientName={client.name}
        segment={client.segment}
        text={briefingText}
      />
    </div>
  )
}

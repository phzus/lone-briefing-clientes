import { useState } from 'react'
import { FileText, CheckCircle2, MessageSquare } from 'lucide-react'
import { CLIENTS, UNIVERSAL_QUESTIONS } from '@/data/clients'
import { BriefingModal } from '@/components/BriefingModal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

function normalizeValue(v) {
  if (Array.isArray(v)) return v.length > 0 ? v.join(', ') : null
  if (v && String(v).trim() !== '') return String(v).trim()
  return null
}

function AnswerRow({ question, value, obsValue }) {
  const display = normalizeValue(value)
  const obs = obsValue && String(obsValue).trim() !== '' ? String(obsValue).trim() : null
  return (
    <div className="py-2.5 border-b border-border last:border-0">
      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
        <span className="text-primary mr-1">{question.num}.</span>
        {question.label}
      </p>
      <p className={cn(
        'text-sm leading-relaxed whitespace-pre-wrap',
        display ? 'text-foreground' : 'text-muted-foreground italic',
      )}>
        {display ?? '(não respondida)'}
      </p>
      {obs && (
        <div className="mt-1.5 flex items-start gap-1.5 text-xs text-amber-400/80">
          <MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span className="whitespace-pre-wrap">{obs}</span>
        </div>
      )}
    </div>
  )
}

function ClientCard({ client, getValue, getProgress, getSegment, isCompleted, generateBriefingText }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [briefingText, setBriefingText] = useState('')
  const { filled, total, pct } = getProgress(client.id)
  const completed = isCompleted(client.id)

  function handleOpenBriefing() {
    setBriefingText(generateBriefingText(client))
    setModalOpen(true)
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-card overflow-hidden">
      {/* Cabeçalho do card */}
      <div className="px-5 py-4 border-b border-border flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-bold text-foreground leading-tight">{client.name}</h2>
            {completed && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="h-3 w-3" />
                Concluído
              </span>
            )}
          </div>
          <Badge variant="accent" className="mt-1.5">{getSegment(client.id)}</Badge>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground mb-1">{filled}/{total} respondidas</p>
            <Progress
              value={pct}
              className="h-1.5 w-24"
              indicatorClassName={completed ? 'bg-emerald-400' : undefined}
            />
          </div>
          <Button size="sm" variant="outline" onClick={handleOpenBriefing} className="gap-1.5 shrink-0">
            <FileText className="h-3.5 w-3.5" />
            Copiar briefing
          </Button>
        </div>
      </div>

      {/* Respostas */}
      <div className="px-5 py-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pt-3 pb-1">
          Perguntas Universais
        </p>
        {UNIVERSAL_QUESTIONS.map(q => (
          <AnswerRow key={q.id} question={q} value={getValue(client.id, q.id)} obsValue={getValue(client.id, q.id + '__obs')} />
        ))}
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pt-4 pb-1">
          Perguntas Específicas
        </p>
        {client.questions.map(q => (
          <AnswerRow key={q.id} question={q} value={getValue(client.id, q.id)} obsValue={getValue(client.id, q.id + '__obs')} />
        ))}
        <div className="h-3" />
      </div>

      <BriefingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        clientName={client.name}
        segment={getSegment(client.id)}
        text={briefingText}
      />
    </div>
  )
}

export function RespostasView({ getValue, getProgress, getSegment, isCompleted, generateBriefingText, completedCount }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 pb-24">
      <div className="mb-8 pb-6 border-b border-border">
        <h1 className="text-2xl font-bold tracking-tight text-foreground leading-tight">Respostas</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Todas as respostas preenchidas — somente leitura.
          <span className="ml-2 font-semibold text-primary">{completedCount}/{CLIENTS.length} concluídos</span>
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {CLIENTS.map(client => (
          <ClientCard
            key={client.id}
            client={client}
            getValue={getValue}
            getProgress={getProgress}
            getSegment={getSegment}
            isCompleted={isCompleted}
            generateBriefingText={generateBriefingText}
          />
        ))}
      </div>
    </div>
  )
}

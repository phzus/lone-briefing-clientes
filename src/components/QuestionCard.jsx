import { useState } from 'react'
import { MessageSquarePlus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'

export function QuestionCard({ question, value, onChange, obsValue, onObsChange }) {
  const [obsOpen, setObsOpen] = useState(!!obsValue)

  // Normaliza: string legada → array de um item, vazio → []
  const arrayValue = Array.isArray(value)
    ? value
    : (value && value.trim() !== '' ? [value] : [])

  const isAnswered = question.type === 'pills'
    ? arrayValue.length > 0
    : (value != null && String(value).trim() !== '')

  function handleObsToggle() {
    if (obsOpen && obsValue) return // não fecha se tiver conteúdo
    setObsOpen(v => !v)
  }

  return (
    <div className={cn(
      'rounded-[var(--radius-lg)] border bg-card p-5 transition-colors',
      isAnswered ? 'border-primary/20' : 'border-border',
    )}>
      <p className="mb-3.5 text-sm font-medium leading-relaxed text-card-foreground">
        <span className="font-bold text-primary mr-1">{question.num}.</span>
        {question.label}
      </p>

      {question.type === 'pills' && (
        <ToggleGroup
          type="multiple"
          value={arrayValue}
          onValueChange={(v) => onChange(v)}
        >
          {question.options.map(opt => (
            <ToggleGroupItem key={opt} value={opt}>
              {opt}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      )}

      {question.type === 'text' && (
        <Input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={question.placeholder}
          className="bg-muted/40"
        />
      )}

      {question.type === 'textarea' && (
        <Textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={question.placeholder}
          rows={4}
          className="bg-muted/40 min-h-[100px]"
        />
      )}

      {/* Observação */}
      <div className="mt-3">
        {!obsOpen ? (
          <button
            onClick={handleObsToggle}
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageSquarePlus className="h-3.5 w-3.5" />
            Adicionar observação
          </button>
        ) : (
          <div className="border-t border-border pt-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
              Observação
            </p>
            <Textarea
              value={obsValue ?? ''}
              onChange={e => onObsChange(e.target.value)}
              placeholder="Deixe uma observação, contexto ou nota para o próximo profissional..."
              rows={2}
              className="bg-muted/20 min-h-[64px] text-xs"
            />
          </div>
        )}
      </div>
    </div>
  )
}

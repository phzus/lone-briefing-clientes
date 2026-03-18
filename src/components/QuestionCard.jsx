import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'

export function QuestionCard({ question, clientId, value, onChange }) {
  const isAnswered = value && value.trim() !== ''

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
          type="single"
          value={value}
          onValueChange={(v) => { if (v) onChange(v) }}
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
    </div>
  )
}

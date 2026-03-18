import { useState, useRef, useEffect } from 'react'
import { Check, Copy } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function BriefingModal({ open, onClose, clientName, segment, text }) {
  const [copied, setCopied] = useState(false)
  const taRef = useRef(null)

  useEffect(() => {
    if (open && taRef.current) {
      setTimeout(() => taRef.current?.select(), 100)
    }
  }, [open])

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }).catch(() => {
      taRef.current?.select()
      document.execCommand('copy')
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose() }}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col gap-0 p-0">
        <DialogHeader className="px-6 py-5 border-b border-border">
          <DialogTitle>Briefing gerado — {clientName}</DialogTitle>
          <DialogDescription>{segment}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden px-6 py-4 flex flex-col gap-2 min-h-0">
          <p className="text-xs text-muted-foreground">
            Copie o texto abaixo e envie ao novo profissional:
          </p>
          <textarea
            ref={taRef}
            readOnly
            value={text}
            className="flex-1 w-full min-h-[300px] rounded-[var(--radius-md)] border border-border bg-muted/40 p-3.5 text-xs font-mono leading-relaxed text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring"
            style={{ fontFamily: 'var(--font-mono)' }}
          />
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border">
          <Button onClick={handleCopy} className="gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copiado!' : 'Copiar texto'}
          </Button>
          <Button variant="outline" onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

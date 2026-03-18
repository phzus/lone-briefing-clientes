import { useState, useCallback, useEffect } from 'react'
import { CLIENTS, UNIVERSAL_QUESTIONS } from '@/data/clients'
import { supabase } from '@/lib/supabase'

const RECORD_ID = 'lone-midia'
const LOCAL_KEY = 'lone_midia_briefing_v3'

function loadLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (!raw) return { formData: {}, completedClients: {} }
    return JSON.parse(raw)
  } catch {
    return { formData: {}, completedClients: {} }
  }
}

function saveLocal(formData, completedClients) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify({ formData, completedClients }))
  } catch {}
}

export function useBriefing() {
  const [formData, setFormData] = useState({})
  const [completedClients, setCompletedClients] = useState({})
  const [loading, setLoading] = useState(true)

  // Load from Supabase on mount, fallback to localStorage
  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from('briefings')
          .select('answers, completed')
          .eq('id', RECORD_ID)
          .maybeSingle()

        if (error) throw error

        if (data) {
          setFormData(data.answers ?? {})
          setCompletedClients(data.completed ?? {})
          saveLocal(data.answers ?? {}, data.completed ?? {})
        } else {
          // Nenhum registro ainda — tenta local
          const local = loadLocal()
          setFormData(local.formData)
          setCompletedClients(local.completedClients)
        }
      } catch {
        // Supabase indisponível — usa localStorage
        const local = loadLocal()
        setFormData(local.formData)
        setCompletedClients(local.completedClients)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  // Debounce: salva no Supabase 1.5s após a última alteração
  useEffect(() => {
    if (loading) return

    saveLocal(formData, completedClients)

    const timer = setTimeout(async () => {
      try {
        await supabase.from('briefings').upsert({
          id: RECORD_ID,
          answers: formData,
          completed: completedClients,
          updated_at: new Date().toISOString(),
        })
      } catch {
        // Falha silenciosa — dados já estão no localStorage
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [formData, completedClients, loading])

  const getValue = useCallback((clientId, fieldId) => {
    return formData[clientId]?.[fieldId] ?? ''
  }, [formData])

  const setValue = useCallback((clientId, fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [clientId]: { ...(prev[clientId] ?? {}), [fieldId]: value },
    }))
  }, [])

  const getProgress = useCallback((clientId) => {
    const client = CLIENTS.find(c => c.id === clientId)
    if (!client) return { filled: 0, total: 0, pct: 0 }
    const all = [...UNIVERSAL_QUESTIONS, ...client.questions]
    const filled = all.filter(q => {
      const v = formData[clientId]?.[q.id]
      return v && v.trim() !== ''
    }).length
    return { filled, total: all.length, pct: Math.round((filled / all.length) * 100) }
  }, [formData])

  const markComplete = useCallback((clientId) => {
    setCompletedClients(prev => ({ ...prev, [clientId]: true }))
  }, [])

  const isCompleted = useCallback((clientId) => {
    return !!completedClients[clientId]
  }, [completedClients])

  const completedCount = Object.keys(completedClients).length

  const generateBriefingText = useCallback((client) => {
    const now = new Date()
    const dateStr = now.toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
    const div = '═'.repeat(52)
    const dash = '─'.repeat(52)
    let text = `${div}\n  BRIEFING DE PASSAGEM — LONE MÍDIA\n${div}\n`
    text += `  Cliente:    ${client.name}\n  Segmento:   ${client.segment}\n  Gerado em:  ${dateStr}\n${div}\n\n`
    text += `📋 PERGUNTAS UNIVERSAIS\n${dash}\n\n`
    UNIVERSAL_QUESTIONS.forEach(q => {
      const v = formData[client.id]?.[q.id] || '(não respondida)'
      text += `${q.num}. ${q.label}\n   → ${v}\n\n`
    })
    text += `\n📌 PERGUNTAS ESPECÍFICAS — ${client.name.toUpperCase()}\n${dash}\n\n`
    client.questions.forEach(q => {
      const v = formData[client.id]?.[q.id] || '(não respondida)'
      text += `${q.num}. ${q.label}\n   → ${v}\n\n`
    })
    text += `${div}\n  Briefing gerado pela plataforma interna Lone Mídia\n${div}`
    return text
  }, [formData])

  return {
    loading,
    getValue, setValue,
    getProgress,
    markComplete, isCompleted,
    completedCount,
    generateBriefingText,
  }
}

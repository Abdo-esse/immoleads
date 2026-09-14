'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, MessageSquare, Loader2, ExternalLink, X, Check, Lightbulb } from 'lucide-react'
import { toast } from 'sonner'
import { sendWhatsAppMessage, getWhatsAppMessages, isWhatsAppConfigured } from '@/lib/actions/whatsapp-api'
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp'
import { WHATSAPP_TEMPLATES, type WhatsAppTemplateKey } from '@/lib/utils/whatsapp'
import { timeAgo } from '@/lib/utils'

interface Props {
  leadId: string
  leadName: string
  leadPhone: string
  propertyTitle?: string
  onClose?: () => void
}

interface Message {
  id: string
  message: string
  template: string | null
  status: string
  created_at: string
  sender: { full_name: string } | null
}

export function WhatsAppChatPanel({ leadId, leadName, leadPhone, propertyTitle, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [apiConfigured, setApiConfigured] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplateKey | ''>('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadData()
  }, [leadId])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  async function loadData() {
    setLoading(true)
    const [msgs, configured] = await Promise.all([
      getWhatsAppMessages(leadId),
      isWhatsAppConfigured(),
    ])
    setMessages(msgs as unknown as Message[])
    setApiConfigured(configured)
    setLoading(false)
  }

  function handleTemplateSelect(key: WhatsAppTemplateKey) {
    setSelectedTemplate(key)
    const tpl = WHATSAPP_TEMPLATES[key]
    if (tpl) {
      const msg = tpl.generate({ leadName, propertyTitle })
      setNewMessage(msg)
    }
  }

  async function handleSend() {
    if (!newMessage.trim()) return

    if (!apiConfigured) {
      // Fallback: open wa.me in new tab
      const url = buildWhatsAppUrl(leadPhone, newMessage)
      window.open(url, '_blank')
      toast.info('Ouvert dans WhatsApp Web (API non configurée)')
      return
    }

    setSending(true)
    const result = await sendWhatsAppMessage(
      leadId,
      leadPhone,
      newMessage,
      selectedTemplate || undefined,
    )

    if (result.success) {
      toast.success('Message envoyé via WhatsApp')
      setNewMessage('')
      setSelectedTemplate('')
      await loadData()
    } else if (result.error === 'FALLBACK') {
      const url = buildWhatsAppUrl(leadPhone, newMessage)
      window.open(url, '_blank')
      toast.info('Ouvert dans WhatsApp Web (API non configurée)')
    } else {
      toast.error(result.error || 'Erreur d\'envoi')
    }
    setSending(false)
  }

  const templateKeys = Object.keys(WHATSAPP_TEMPLATES) as WhatsAppTemplateKey[]

  return (
    <div className="flex flex-col h-full rounded-xl border bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-4 py-3 bg-gradient-to-r from-green-600 to-green-500">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white">
          <MessageSquare className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{leadName}</p>
          <p className="text-xs text-white/70">{leadPhone}</p>
        </div>
        {!apiConfigured && (
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium text-white">
            Mode Redirect
          </span>
        )}
        {onClose && (
          <button onClick={onClose} className="text-white/70 hover:text-white transition">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[400px] scroll-smooth-touch">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Aucun message envoyé</p>
            <p className="text-xs text-muted-foreground mt-1">
              {apiConfigured
                ? 'Les messages seront envoyés via l\'API WhatsApp Business'
                : 'Configurez l\'API WhatsApp dans Settings pour l\'envoi direct'}
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-br-md bg-green-500 px-3.5 py-2 text-white">
                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                <div className="flex items-center justify-end gap-1.5 mt-1">
                  <span className="text-[10px] text-white/60">
                    {msg.sender?.full_name || 'Agent'} • {timeAgo(msg.created_at)}
                  </span>
                  {msg.status === 'sent' && (
                    <Check className="h-3 w-3 text-white/60" />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Template Selector */}
      <div className="border-t px-3 py-2">
        <div className="flex gap-1.5 overflow-x-auto pb-1 scroll-smooth-touch no-select">
          {templateKeys.map((key) => (
            <button
              key={key}
              onClick={() => handleTemplateSelect(key)}
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium transition whitespace-nowrap ${
                selectedTemplate === key
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {WHATSAPP_TEMPLATES[key].label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t p-3">
        <div className="flex items-end gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrire un message..."
            rows={2}
            className="flex-1 resize-none rounded-xl border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <button
            onClick={handleSend}
            disabled={sending || !newMessage.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 transition touch-target"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : apiConfigured ? (
              <Send className="h-4 w-4" />
            ) : (
              <ExternalLink className="h-4 w-4" />
            )}
          </button>
        </div>
        {!apiConfigured && (
          <p className="text-[10px] text-muted-foreground mt-1.5 text-center flex items-center justify-center gap-1">
            <Lightbulb className="h-3 w-3 text-amber-500 shrink-0" /> Configurez l&apos;API WhatsApp dans <strong>Settings → Intégrations</strong> pour l&apos;envoi direct
          </p>
        )}
      </div>
    </div>
  )
}

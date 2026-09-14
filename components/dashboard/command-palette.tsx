'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Loader2, ArrowRight, Clock, Users, Building2, UserCheck } from 'lucide-react'
import { globalSearch, type SearchResult } from '@/lib/actions/search'

const HISTORY_KEY = 'immoleads_search_history'
const MAX_HISTORY = 5

const TYPE_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  lead: { label: 'Leads', icon: Users, color: 'text-blue-500' },
  property: { label: 'Biens', icon: Building2, color: 'text-emerald-500' },
  agent: { label: 'Agents', icon: UserCheck, color: 'text-violet-500' },
}

export function CommandPalette() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [history, setHistory] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load search history
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY)
      if (stored) setHistory(JSON.parse(stored))
    } catch {}
  }, [])

  // Global keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
      setResults([])
      setSelectedIndex(0)
    }
  }, [open])

  // Debounced search
  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const res = await globalSearch(q)
      setResults(res)
      setSelectedIndex(0)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleQueryChange = (value: string) => {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(value), 300)
  }

  // Navigate to result
  const selectResult = (result: SearchResult) => {
    // Add to history
    const newHistory = [query, ...history.filter((h) => h !== query)].slice(0, MAX_HISTORY)
    setHistory(newHistory)
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
    } catch {}

    setOpen(false)
    router.push(result.href)
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = results.length > 0 ? results : []
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && items[selectedIndex]) {
      e.preventDefault()
      selectResult(items[selectedIndex])
    }
  }

  // Group results by type
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.type]) acc[r.type] = []
    acc[r.type].push(r)
    return acc
  }, {})

  // Flatten for index tracking
  let flatIndex = 0

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

      {/* Palette */}
      <div className="relative w-full max-w-lg rounded-2xl border bg-card shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Rechercher un lead, un bien, un agent..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {/* History (when no query) */}
          {query.length < 2 && history.length > 0 && (
            <div className="space-y-1 pb-2">
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Recherches récentes
              </p>
              {history.map((h) => (
                <button
                  key={h}
                  onClick={() => handleQueryChange(h)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
                >
                  <Clock className="h-3.5 w-3.5" />
                  {h}
                </button>
              ))}
            </div>
          )}

          {/* Grouped results */}
          {Object.entries(grouped).map(([type, items]) => {
            const config = TYPE_CONFIG[type]
            return (
              <div key={type} className="pb-2">
                <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  {config && <config.icon className={`h-3 w-3 ${config.color}`} />}
                  {config?.label || type}
                </p>
                {items.map((result) => {
                  const currentIndex = flatIndex++
                  const isSelected = currentIndex === selectedIndex
                  const IconComp = config?.icon || Users
                  return (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => selectResult(result)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                        isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                      }`}
                    >
                      <IconComp className={`h-4 w-4 shrink-0 ${config?.color || 'text-muted-foreground'}`} />
                      <div className="flex-1 text-left">
                        <p className="font-medium">{result.title}</p>
                        <p className="text-[11px] text-muted-foreground">{result.subtitle}</p>
                      </div>
                      {isSelected && <ArrowRight className="h-4 w-4 text-primary shrink-0" />}
                    </button>
                  )
                })}
              </div>
            )
          })}

          {/* Empty state */}
          {query.length >= 2 && !loading && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-sm text-muted-foreground">
              <Search className="h-8 w-8 mb-2 opacity-30" />
              <p>Aucun résultat pour "{query}"</p>
              <p className="text-[10px] mt-1">Essayez un autre terme de recherche</p>
            </div>
          )}

          {/* Initial state */}
          {query.length < 2 && history.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-sm text-muted-foreground">
              <Search className="h-8 w-8 mb-2 opacity-30" />
              <p>Tapez au moins 2 caractères pour rechercher</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t px-4 py-2 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border bg-muted px-1 py-0.5">↑↓</kbd> naviguer
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border bg-muted px-1 py-0.5">Enter</kbd> ouvrir
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="rounded border bg-muted px-1 py-0.5">Ctrl</kbd>
            <kbd className="rounded border bg-muted px-1 py-0.5">K</kbd> rechercher
          </span>
        </div>
      </div>
    </div>
  )
}

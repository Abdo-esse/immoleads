'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, X, Loader2 } from 'lucide-react'
import { importLeadsBatch, type ImportedLeadRow } from '@/lib/actions/leads-import'

interface LeadImportDialogProps {
  open: boolean
  onClose: () => void
}

export function LeadImportDialog({ open, onClose }: LeadImportDialogProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [parsedRows, setParsedRows] = useState<ImportedLeadRow[]>([])
  const [parsingError, setParsingError] = useState<string | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<{
    success: boolean
    count: number
    errors: string[]
  } | null>(null)

  if (!open) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      processFile(selectedFile)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      processFile(droppedFile)
    }
  }

  const processFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setParsingError('Veuillez sélectionner un fichier au format .csv')
      return
    }

    setFile(file)
    setParsingError(null)
    setImportResult(null)

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        parseCsv(text)
      } catch (err: any) {
        setParsingError('Impossible de lire le fichier : ' + (err.message || 'Erreur inconnue'))
      }
    }
    reader.readAsText(file, 'UTF-8')
  }

  const parseCsv = (csvText: string) => {
    // Strip BOM if present
    const cleanText = csvText.replace(/^\uFEFF/, '')
    const lines = cleanText.split(/\r?\n/).filter((l) => l.trim().length > 0)

    if (lines.length < 2) {
      setParsingError('Le fichier CSV doit contenir au moins une ligne d’en-tête et une ligne de données.')
      return
    }

    // Detect delimiter (; or ,)
    const firstLine = lines[0]
    const delimiter = firstLine.includes(';') ? ';' : ','

    // Split headers
    const rawHeaders = firstLine.split(delimiter).map((h) => h.replace(/^["']|["']$/g, '').trim().toLowerCase())

    // Map column indexes
    let nameIdx = -1
    let phoneIdx = -1
    let emailIdx = -1
    let budgetIdx = -1
    let sourceIdx = -1
    let notesIdx = -1

    rawHeaders.forEach((h, idx) => {
      if (['nom', 'name', 'fullname', 'full name', 'client', 'prospect', 'contact'].some((k) => h.includes(k))) {
        if (nameIdx === -1) nameIdx = idx
      } else if (['tel', 'tél', 'phone', 'telephone', 'téléphone', 'mobile', 'gsm', 'numero', 'numéro'].some((k) => h.includes(k))) {
        if (phoneIdx === -1) phoneIdx = idx
      } else if (['mail', 'email', 'e-mail', 'courriel'].some((k) => h.includes(k))) {
        if (emailIdx === -1) emailIdx = idx
      } else if (['budget', 'prix', 'montant', 'price'].some((k) => h.includes(k))) {
        if (budgetIdx === -1) budgetIdx = idx
      } else if (['source', 'canal', 'provenance', 'origine'].some((k) => h.includes(k))) {
        if (sourceIdx === -1) sourceIdx = idx
      } else if (['note', 'notes', 'commentaire', 'commentaires', 'remarque'].some((k) => h.includes(k))) {
        if (notesIdx === -1) notesIdx = idx
      }
    })

    // Fallbacks if not recognized by name
    if (nameIdx === -1 && rawHeaders.length > 0) nameIdx = 0
    if (phoneIdx === -1 && rawHeaders.length > 1) phoneIdx = 1

    const rows: ImportedLeadRow[] = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      // Simple regex split respecting quoted cells
      const cells = line.split(new RegExp(`${delimiter}(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)`)).map((c) =>
        c.replace(/^["']|["']$/g, '').replace(/""/g, '"').trim()
      )

      const name = cells[nameIdx] || ''
      const phone = cells[phoneIdx] || ''
      const email = emailIdx !== -1 ? cells[emailIdx] : undefined
      const rawBudget = budgetIdx !== -1 ? cells[budgetIdx] : ''
      const budget = rawBudget ? parseFloat(rawBudget.replace(/[^0-9.]/g, '')) : undefined
      const source = sourceIdx !== -1 ? cells[sourceIdx] : 'import_csv'
      const notes = notesIdx !== -1 ? cells[notesIdx] : undefined

      if (name && phone) {
        rows.push({
          name,
          phone,
          email: email || undefined,
          budget: !isNaN(budget!) ? budget : undefined,
          source: source || 'import_csv',
          notes: notes || undefined,
        })
      }
    }

    if (rows.length === 0) {
      setParsingError(
        'Aucune ligne valide trouvée. Vérifiez que votre fichier contient bien des colonnes Nom et Téléphone.'
      )
      return
    }

    setParsedRows(rows)
  }

  const handleStartImport = async () => {
    if (parsedRows.length === 0) return

    setIsImporting(true)
    setParsingError(null)

    try {
      const result = await importLeadsBatch(parsedRows)
      setImportResult({
        success: result.success,
        count: result.importedCount,
        errors: result.errors,
      })
      if (result.success) {
        router.refresh()
      }
    } catch (err: any) {
      setParsingError("Une erreur est survenue lors de l'importation : " + err.message)
    } finally {
      setIsImporting(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setParsedRows([])
    setParsingError(null)
    setImportResult(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl border bg-card p-6 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Importer des leads (CSV)</h2>
              <p className="text-xs text-muted-foreground">
                Importez vos prospects depuis un fichier Excel ou CSV en quelques secondes
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              handleReset()
              onClose()
            }}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4">
          {/* Success state */}
          {importResult?.success ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center dark:border-green-900/50 dark:bg-green-950/30">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-base font-semibold text-green-900 dark:text-green-100">
                Importation réussie !
              </h3>
              <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                <strong>{importResult.count}</strong> lead{importResult.count > 1 ? 's ont été ajoutés' : ' a été ajouté'} à votre pipeline avec succès.
              </p>
              <button
                onClick={() => {
                  handleReset()
                  onClose()
                }}
                className="mt-5 rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                Voir les leads
              </button>
            </div>
          ) : (
            <>
              {/* Drop Zone if no file loaded */}
              {!file ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 p-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/30 cursor-pointer"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold">
                    Glissez votre fichier CSV ici, ou <span className="text-primary underline">parcourez vos fichiers</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Colonnes reconnues : Nom, Téléphone, Email, Budget, Source, Commentaires
                  </p>
                </div>
              ) : (
                /* Preview loaded file */
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-3">
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {parsedRows.length} ligne{parsedRows.length > 1 ? 's' : ''} prêtes à être importées
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleReset}
                      className="text-xs font-medium text-destructive hover:underline"
                    >
                      Changer de fichier
                    </button>
                  </div>

                  {/* Preview Table */}
                  {parsedRows.length > 0 && (
                    <div className="rounded-lg border overflow-hidden">
                      <div className="bg-muted px-3 py-2 text-xs font-semibold text-muted-foreground">
                        Aperçu des 5 premières lignes
                      </div>
                      <div className="overflow-x-auto max-h-48">
                        <table className="w-full text-left text-xs">
                          <thead className="border-b bg-card text-muted-foreground">
                            <tr>
                              <th className="p-2.5">Nom</th>
                              <th className="p-2.5">Téléphone</th>
                              <th className="p-2.5">Email</th>
                              <th className="p-2.5">Budget</th>
                              <th className="p-2.5">Source</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {parsedRows.slice(0, 5).map((row, i) => (
                              <tr key={i} className="hover:bg-muted/30">
                                <td className="p-2.5 font-medium">{row.name}</td>
                                <td className="p-2.5 text-muted-foreground">{row.phone}</td>
                                <td className="p-2.5 text-muted-foreground">{row.email || '—'}</td>
                                <td className="p-2.5 text-muted-foreground">{row.budget ? `${row.budget.toLocaleString()} MAD` : '—'}</td>
                                <td className="p-2.5 text-muted-foreground">{row.source}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Error messages */}
              {parsingError && (
                <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>{parsingError}</div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!importResult?.success && (
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              onClick={() => {
                handleReset()
                onClose()
              }}
              disabled={isImporting}
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              onClick={handleStartImport}
              disabled={parsedRows.length === 0 || isImporting}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
            >
              {isImporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Importation en cours...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Importer {parsedRows.length > 0 ? `(${parsedRows.length} leads)` : ''}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

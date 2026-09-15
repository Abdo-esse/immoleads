'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle2, MessageSquare, Building2, User, Phone, MapPin, Sparkles, AlertCircle, Loader2 } from 'lucide-react'
import { submitDemoRequest } from '@/lib/actions/demo-requests'

export function QualificationForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    agencyName: '',
    city: '',
    teamSize: '2–5',
    sources: ['Facebook / Instagram Ads', 'WhatsApp'] as string[],
    monthlyLeads: '20–50',
    mainProblem: 'Les leads se perdent',
  })

  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const teamSizes = ['1', '2–5', '6–10', '10+']
  
  const leadSourceOptions = [
    'Facebook / Instagram Ads',
    'WhatsApp',
    'Site web',
    'Portails immobiliers',
    'Réseaux sociaux',
    'Autre',
  ]

  const monthlyVolumeOptions = ['<20', '20–50', '50–100', '100+']

  const problemOptions = [
    'Les leads se perdent',
    'Manque de suivi',
    'Qualification',
    'Organisation des agents',
    'Planification des visites',
    'Je veux générer plus de leads',
  ]

  const handleSourceToggle = (source: string) => {
    setFormData((prev) => {
      const exists = prev.sources.includes(source)
      return {
        ...prev,
        sources: exists
          ? prev.sources.filter((s) => s !== source)
          : [...prev.sources, source],
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.fullName.trim()) {
      setError('Veuillez indiquer votre nom complet.')
      return
    }

    if (!formData.phone.trim()) {
      setError('Veuillez indiquer votre numéro de téléphone ou WhatsApp.')
      return
    }

    if (!formData.city.trim()) {
      setError('Veuillez indiquer votre ville.')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await submitDemoRequest({
        fullName: formData.fullName,
        phone: formData.phone,
        agencyName: formData.agencyName,
        city: formData.city,
        teamSize: formData.teamSize,
        sources: formData.sources,
        monthlyLeads: formData.monthlyLeads,
        mainProblem: formData.mainProblem,
      })

      if (!res.success) {
        setError(res.error || "Une erreur est survenue lors de l'enregistrement de votre demande.")
        return
      }

      setSubmitted(true)
    } catch (err: any) {
      setError("Impossible d'enregistrer votre demande. Veuillez vérifier votre connexion.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="demo" className="relative py-20 lg:py-28 bg-white dark:bg-[#0D1F2D] border-b border-[#E2E8F0] dark:border-[#193646]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Intro Section: Demo rather than price */}
        <div className="mx-auto max-w-3xl text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#58B52A]/30 bg-[#ECF8E7] dark:bg-[#15351C] text-[#2E7D17] dark:text-[#65C832] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Accompagnement Sur-Mesure
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F2A3D] dark:text-[#F8FAFC] tracking-tight mb-4">
            Découvrez ImmoLeads avec votre propre cas d’utilisation.
          </h2>
          <p className="text-base sm:text-lg text-[#64748B] dark:text-[#A8B6C3]">
            Demandez une démonstration et expliquez-nous comment votre agence gère actuellement ses prospects. Nous préparerons une présentation personnalisée adaptée à vos biens et à votre équipe.
          </p>
        </div>

        {/* Qualification Card Form */}
        <div className="rounded-3xl bg-[#F8FAFC] dark:bg-[#132B3A] p-6 sm:p-10 lg:p-12 border-2 border-[#E2E8F0] dark:border-[#213A49] shadow-xl">
          
          <div className="pb-6 mb-8 border-b border-[#E2E8F0] dark:border-[#213A49]">
            <h3 className="text-2xl font-black text-[#0F2A3D] dark:text-white">
              Parlons de votre agence
            </h3>
            <p className="text-sm text-[#64748B] dark:text-[#A8B6C3] mt-1">
              Remplissez ce formulaire en 1 minute pour calibrer votre démonstration.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 sm:p-12 rounded-2xl bg-[#ECF8E7] dark:bg-[#15351C] border-2 border-[#58B52A] text-center">
              <div className="h-16 w-16 mx-auto rounded-full bg-[#58B52A] text-white flex items-center justify-center mb-4 shadow-md">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <h4 className="text-2xl sm:text-3xl font-bold text-[#15351C] dark:text-white mb-3">
                Votre demande de démonstration a bien été enregistrée !
              </h4>
              <p className="text-sm sm:text-base text-[#2E7D17] dark:text-[#A8B6C3] max-w-lg mx-auto mb-6">
                Merci <span className="font-bold">{formData.fullName}</span>. Notre équipe ATLORYX prépare votre présentation sur-mesure. Un conseiller va vous contacter au <span className="font-bold">{formData.phone}</span> pour convenir d'un créneau adapté à votre agence.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false)
                  setFormData({
                    fullName: '',
                    phone: '',
                    agencyName: '',
                    city: '',
                    teamSize: '2–5',
                    sources: ['Facebook / Instagram Ads', 'WhatsApp'],
                    monthlyLeads: '20–50',
                    mainProblem: 'Les leads se perdent',
                  })
                }}
                className="px-6 py-2.5 rounded-xl bg-white dark:bg-[#0D1F2D] border border-[#58B52A] text-[#15351C] dark:text-white text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Envoyer une autre demande
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-7">
              
              {/* Error alert */}
              {error && (
                <div className="p-3.5 rounded-xl bg-[#FEE2E2] dark:bg-[#3B1719] border border-[#FCA5A5] text-[#B91C1C] dark:text-[#FCA5A5] text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* General inputs: 2x2 grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Full name */}
                <div>
                  <label className="block text-xs font-bold text-[#0F2A3D] dark:text-white uppercase tracking-wider mb-2">
                    Nom complet <span className="text-[#DC3545]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Ex: Youssef Bennani"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full h-11 px-4 pl-10 rounded-xl bg-white dark:bg-[#0D1F2D] border border-[#CBD5E1] dark:border-[#213A49] text-sm text-[#0F2A3D] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#58B52A]"
                    />
                    <User className="absolute left-3.5 top-3.5 h-4 w-4 text-[#94A3B8]" />
                  </div>
                </div>

                {/* WhatsApp Phone */}
                <div>
                  <label className="block text-xs font-bold text-[#0F2A3D] dark:text-white uppercase tracking-wider mb-2">
                    Téléphone / WhatsApp <span className="text-[#DC3545]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="+212 6 XX XX XX XX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full h-11 px-4 pl-10 rounded-xl bg-white dark:bg-[#0D1F2D] border border-[#CBD5E1] dark:border-[#213A49] text-sm text-[#0F2A3D] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#58B52A]"
                    />
                    <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-[#94A3B8]" />
                  </div>
                </div>

                {/* Agency name */}
                <div>
                  <label className="block text-xs font-bold text-[#0F2A3D] dark:text-white uppercase tracking-wider mb-2">
                    Nom de l’agence
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ex: Atlas Immobilier"
                      value={formData.agencyName}
                      onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                      className="w-full h-11 px-4 pl-10 rounded-xl bg-white dark:bg-[#0D1F2D] border border-[#CBD5E1] dark:border-[#213A49] text-sm text-[#0F2A3D] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#58B52A]"
                    />
                    <Building2 className="absolute left-3.5 top-3.5 h-4 w-4 text-[#94A3B8]" />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-bold text-[#0F2A3D] dark:text-white uppercase tracking-wider mb-2">
                    Ville <span className="text-[#DC3545]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Ex: Marrakech, Casablanca, Rabat..."
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full h-11 px-4 pl-10 rounded-xl bg-white dark:bg-[#0D1F2D] border border-[#CBD5E1] dark:border-[#213A49] text-sm text-[#0F2A3D] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#58B52A]"
                    />
                    <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-[#94A3B8]" />
                  </div>
                </div>

              </div>

              {/* Team size selection */}
              <div>
                <label className="block text-xs font-bold text-[#0F2A3D] dark:text-white uppercase tracking-wider mb-2.5">
                  Combien de personnes gèrent vos prospects ?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {teamSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setFormData({ ...formData, teamSize: size })}
                      className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                        formData.teamSize === size
                          ? 'bg-[#58B52A] text-white border-[#58B52A] shadow-xs'
                          : 'bg-white dark:bg-[#0D1F2D] text-[#0F2A3D] dark:text-white border-[#CBD5E1] dark:border-[#213A49] hover:bg-[#F1F5F9]'
                      }`}
                    >
                      {size} {size === '1' ? 'personne' : 'personnes'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lead sources checklist */}
              <div>
                <label className="block text-xs font-bold text-[#0F2A3D] dark:text-white uppercase tracking-wider mb-2.5">
                  D’où viennent principalement vos leads actuellement ?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {leadSourceOptions.map((source) => {
                    const isChecked = formData.sources.includes(source)
                    return (
                      <button
                        key={source}
                        type="button"
                        onClick={() => handleSourceToggle(source)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                          isChecked
                            ? 'bg-[#ECF8E7] dark:bg-[#15351C] border-[#58B52A] text-[#2E7D17] dark:text-[#65C832]'
                            : 'bg-white dark:bg-[#0D1F2D] border-[#CBD5E1] dark:border-[#213A49] text-[#102A3A] dark:text-slate-300 hover:bg-[#F1F5F9]'
                        }`}
                      >
                        <div
                          className={`h-4 w-4 rounded flex items-center justify-center border ${
                            isChecked
                              ? 'bg-[#58B52A] border-[#58B52A] text-white'
                              : 'border-[#94A3B8]'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="h-3.5 w-3.5" />}
                        </div>
                        <span className="truncate">{source}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Monthly Volume Selection */}
              <div>
                <label className="block text-xs font-bold text-[#0F2A3D] dark:text-white uppercase tracking-wider mb-2.5">
                  Combien de leads recevez-vous approximativement par mois ?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {monthlyVolumeOptions.map((vol) => (
                    <button
                      key={vol}
                      type="button"
                      onClick={() => setFormData({ ...formData, monthlyLeads: vol })}
                      className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                        formData.monthlyLeads === vol
                          ? 'bg-[#58B52A] text-white border-[#58B52A] shadow-xs'
                          : 'bg-white dark:bg-[#0D1F2D] text-[#0F2A3D] dark:text-white border-[#CBD5E1] dark:border-[#213A49] hover:bg-[#F1F5F9]'
                      }`}
                    >
                      {vol} leads
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Problem Selection */}
              <div>
                <label className="block text-xs font-bold text-[#0F2A3D] dark:text-white uppercase tracking-wider mb-2.5">
                  Votre principal problème actuellement ?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {problemOptions.map((prob) => (
                    <button
                      key={prob}
                      type="button"
                      onClick={() => setFormData({ ...formData, mainProblem: prob })}
                      className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                        formData.mainProblem === prob
                          ? 'bg-[#0F2A3D] text-white border-[#0F2A3D] shadow-xs'
                          : 'bg-white dark:bg-[#0D1F2D] text-[#102A3A] dark:text-white border-[#CBD5E1] dark:border-[#213A49] hover:bg-[#F1F5F9]'
                      }`}
                    >
                      {prob}
                    </button>
                  ))}
                </div>
              </div>

              {/* Big Green Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 py-4 px-8 rounded-2xl bg-[#58B52A] hover:bg-[#46951F] disabled:opacity-60 disabled:cursor-not-allowed text-white text-base sm:text-lg font-black shadow-xl shadow-[#58B52A]/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Enregistrement de votre demande...</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-5 w-5" />
                      <span>Demander ma démonstration →</span>
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-[#64748B] dark:text-[#A8B6C3] mt-3 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#58B52A]" />
                  <span>Démonstration offerte et sans engagement, réalisée avec vos biens réels.</span>
                </p>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  )
}

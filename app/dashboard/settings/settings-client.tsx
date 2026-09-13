'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  User,
  Building2,
  Users,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  UserPlus,
  Loader2,
  Check,
  X,
  Link2,
} from 'lucide-react'
import {
  updateProfile,
  updateAgencyInfo,
  updateAgentRole,
  addTeamMember,
  type SettingsData,
} from '@/lib/actions/settings'
import { saveWhatsAppConfig } from '@/lib/actions/whatsapp-api'
import { updatePerformanceSettings } from '@/lib/actions/performance'
import { formatPhone } from '@/lib/utils'

export function SettingsClient({ data }: { data: SettingsData }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'profile' | 'agency' | 'team' | 'integrations'>('profile')

  // Profile form
  const [profileName, setProfileName] = useState(data.profile.full_name)
  const [profilePhone, setProfilePhone] = useState(data.profile.phone || '')
  const [savingProfile, setSavingProfile] = useState(false)

  // Agency form
  const [agencyName, setAgencyName] = useState(data.agency?.name || '')
  const [agencyCity, setAgencyCity] = useState(data.agency?.city || '')
  const [agencyPhone, setAgencyPhone] = useState(data.agency?.phone || '')
  const [agencyWhatsApp, setAgencyWhatsApp] = useState(data.agency?.whatsapp_number || '')
  const [agencyEmail, setAgencyEmail] = useState(data.agency?.email || '')
  const [savingAgency, setSavingAgency] = useState(false)

  // Performance settings form
  const [commissionRate, setCommissionRate] = useState(String(data.agency?.commission_rate ?? 2.5))
  const [agentShareVal, setAgentShareVal] = useState(String(data.agency?.agent_share ?? 40))
  const [monthlyLeadGoal, setMonthlyLeadGoal] = useState(String(data.agency?.monthly_lead_goal ?? 0))
  const [monthlyWonGoal, setMonthlyWonGoal] = useState(String(data.agency?.monthly_won_goal ?? 0))
  const [monthlyRevenueGoal, setMonthlyRevenueGoal] = useState(String(data.agency?.monthly_revenue_goal ?? 0))
  const [savingPerf, setSavingPerf] = useState(false)

  // WhatsApp settings
  const [waPhoneId, setWaPhoneId] = useState((data.agency as any)?.wa_phone_id || '')
  const [waAccessToken, setWaAccessToken] = useState((data.agency as any)?.wa_access_token || '')
  const [waBusinessId, setWaBusinessId] = useState((data.agency as any)?.wa_business_id || '')
  const [savingWhatsApp, setSavingWhatsApp] = useState(false)

  // Team invite modal
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteName, setInviteName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [invitePhone, setInvitePhone] = useState('')
  const [inviteRole, setInviteRole] = useState<'admin' | 'agent'>('agent')
  const [inviting, setInviting] = useState(false)

  // Handlers
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profileName.trim()) {
      toast.error('Le nom complet est requis.')
      return
    }
    setSavingProfile(true)
    try {
      const res = await updateProfile({ full_name: profileName, phone: profilePhone })
      if (res.error) toast.error(res.error)
      else {
        toast.success('Profil mis à jour avec succès !')
        router.refresh()
      }
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSavingProfile(false)
    }
  }

  const handleSaveAgency = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agencyName.trim()) {
      toast.error("Le nom de l'agence est requis.")
      return
    }
    setSavingAgency(true)
    try {
      const res = await updateAgencyInfo({
        name: agencyName,
        city: agencyCity,
        phone: agencyPhone,
        whatsapp_number: agencyWhatsApp,
        email: agencyEmail,
      })
      if (res.error) toast.error(res.error)
      else {
        toast.success("Informations de l'agence mises à jour !")
        router.refresh()
      }
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSavingAgency(false)
    }
  }

  const handleRoleChange = async (memberId: string, newRole: 'admin' | 'agent') => {
    try {
      const res = await updateAgentRole(memberId, newRole)
      if (res?.error) toast.error(res.error)
      else {
        toast.success('Rôle mis à jour !')
        router.refresh()
      }
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteName.trim() || !inviteEmail.trim()) {
      toast.error('Le nom et l’email sont requis.')
      return
    }
    setInviting(true)
    try {
      const res = await addTeamMember({
        full_name: inviteName,
        email: inviteEmail,
        phone: invitePhone,
        role: inviteRole,
      })
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Collaborateur ajouté à l’agence !')
        setShowInviteModal(false)
        setInviteName('')
        setInviteEmail('')
        setInvitePhone('')
        setInviteRole('agent')
        router.refresh()
      }
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setInviting(false)
    }
  }

  const handleSaveWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingWhatsApp(true)
    try {
      const res = await saveWhatsAppConfig({
        phoneId: waPhoneId,
        accessToken: waAccessToken,
        businessId: waBusinessId,
      })
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success('Configuration WhatsApp Business API enregistrée avec succès !')
        router.refresh()
      }
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la sauvegarde')
    } finally {
      setSavingWhatsApp(false)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Paramètres & Équipe</h1>
        <p className="text-sm text-muted-foreground">
          Gérez votre profil personnel, les coordonnées de votre agence et les membres de votre équipe.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-muted">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
            activeTab === 'profile'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <User className="h-4 w-4" />
          Mon Profil
        </button>

        <button
          onClick={() => setActiveTab('agency')}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
            activeTab === 'agency'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Building2 className="h-4 w-4" />
          Agence
        </button>

        <button
          onClick={() => setActiveTab('team')}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
            activeTab === 'team'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="h-4 w-4" />
          Équipe ({data.team.length})
        </button>

        <button
          onClick={() => setActiveTab('integrations')}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
            activeTab === 'integrations'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Link2 className="h-4 w-4" />
          Intégrations
        </button>
      </div>

      {/* Tab 1: Mon Profil */}
      {activeTab === 'profile' && (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="max-w-xl">
            <h2 className="text-lg font-bold mb-1">Informations personnelles</h2>
            <p className="text-xs text-muted-foreground mb-6">
              Mettez à jour vos coordonnées visibles par vos clients et collègues.
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="mt-1.5 flex h-10 w-full rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Adresse Email
                </label>
                <input
                  type="email"
                  disabled
                  value={data.profile.email}
                  className="mt-1.5 flex h-10 w-full rounded-lg border bg-muted px-3 text-sm text-muted-foreground cursor-not-allowed"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  L&apos;adresse email sert d&apos;identifiant de connexion et ne peut être modifiée ici.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Numéro de téléphone
                </label>
                <input
                  type="tel"
                  placeholder="ex: 0661234567"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="mt-1.5 flex h-10 w-full rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Rôle
                </label>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {data.profile.role === 'admin' ? 'Administrateur' : 'Agent immobilier'}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-50"
                >
                  {savingProfile ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    'Enregistrer les modifications'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: Agence */}
      {activeTab === 'agency' && (
        <>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="max-w-xl">
            <h2 className="text-lg font-bold mb-1">Coordonnées de l&apos;agence</h2>
            <p className="text-xs text-muted-foreground mb-6">
              Ces informations apparaissent sur vos annonces publiques et vos modèles WhatsApp.
            </p>

            <form onSubmit={handleSaveAgency} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Nom de l&apos;agence
                </label>
                <input
                  type="text"
                  disabled={!data.isAdmin}
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="mt-1.5 flex h-10 w-full rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:bg-muted disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Ville principale
                </label>
                <input
                  type="text"
                  disabled={!data.isAdmin}
                  placeholder="ex: Casablanca, Marrakech, Rabat..."
                  value={agencyCity}
                  onChange={(e) => setAgencyCity(e.target.value)}
                  className="mt-1.5 flex h-10 w-full rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:bg-muted disabled:cursor-not-allowed"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Téléphone fixe / agence
                  </label>
                  <input
                    type="tel"
                    disabled={!data.isAdmin}
                    placeholder="ex: 0522123456"
                    value={agencyPhone}
                    onChange={(e) => setAgencyPhone(e.target.value)}
                    className="mt-1.5 flex h-10 w-full rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:bg-muted disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Numéro WhatsApp officiel
                  </label>
                  <input
                    type="tel"
                    disabled={!data.isAdmin}
                    placeholder="ex: 212669808310"
                    value={agencyWhatsApp}
                    onChange={(e) => setAgencyWhatsApp(e.target.value)}
                    className="mt-1.5 flex h-10 w-full rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:bg-muted disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email de contact général
                </label>
                <input
                  type="email"
                  disabled={!data.isAdmin}
                  placeholder="contact@agence.ma"
                  value={agencyEmail}
                  onChange={(e) => setAgencyEmail(e.target.value)}
                  className="mt-1.5 flex h-10 w-full rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:bg-muted disabled:cursor-not-allowed"
                />
              </div>

              {data.isAdmin ? (
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={savingAgency}
                    className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-50"
                  >
                    {savingAgency ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Mise à jour...
                      </>
                    ) : (
                      "Mettre à jour l'agence"
                    )}
                  </button>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic pt-2">
                  Seuls les administrateurs de l&apos;agence peuvent modifier ces coordonnées.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Performance Settings Section */}
        {data.isAdmin && (
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="max-w-xl">
              <h2 className="text-lg font-bold mb-1">Performance & Commissions</h2>
              <p className="text-xs text-muted-foreground mb-6">
                Configurez les taux de commission et les objectifs mensuels de votre agence.
              </p>

              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  setSavingPerf(true)
                  try {
                    const res = await updatePerformanceSettings({
                      commission_rate: parseFloat(commissionRate) || 2.5,
                      agent_share: parseFloat(agentShareVal) || 40,
                      monthly_lead_goal: parseInt(monthlyLeadGoal) || 0,
                      monthly_won_goal: parseInt(monthlyWonGoal) || 0,
                      monthly_revenue_goal: parseFloat(monthlyRevenueGoal) || 0,
                    })
                    if (res.error) toast.error(res.error)
                    else {
                      toast.success('Paramètres de performance mis à jour !')
                      router.refresh()
                    }
                  } catch (err: any) {
                    toast.error(err.message)
                  } finally {
                    setSavingPerf(false)
                  }
                }}
                className="space-y-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Commission agence (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(e.target.value)}
                      className="mt-1.5 flex h-10 w-full rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">% du prix de vente du bien</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Part agent (%)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      max="100"
                      value={agentShareVal}
                      onChange={(e) => setAgentShareVal(e.target.value)}
                      className="mt-1.5 flex h-10 w-full rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">% de la commission agence reversée à l'agent</p>
                  </div>
                </div>

                <hr className="border-muted" />
                <h3 className="text-sm font-semibold">Objectifs Mensuels</h3>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Leads qualifiés
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={monthlyLeadGoal}
                      onChange={(e) => setMonthlyLeadGoal(e.target.value)}
                      className="mt-1.5 flex h-10 w-full rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Ventes (WON)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={monthlyWonGoal}
                      onChange={(e) => setMonthlyWonGoal(e.target.value)}
                      className="mt-1.5 flex h-10 w-full rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      CA cible (MAD)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={monthlyRevenueGoal}
                      onChange={(e) => setMonthlyRevenueGoal(e.target.value)}
                      className="mt-1.5 flex h-10 w-full rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={savingPerf}
                    className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-50"
                  >
                    {savingPerf ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      'Enregistrer les paramètres'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </>
      )}

      {/* Tab 3: Équipe & Collaborateurs */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Membres de l&apos;équipe</h2>
              <p className="text-xs text-muted-foreground">
                Collaborateurs ayant accès au CRM de votre agence.
              </p>
            </div>
            {data.isAdmin && (
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
              >
                <UserPlus className="h-4 w-4" />
                Ajouter un collaborateur
              </button>
            )}
          </div>

          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-muted/50 text-xs font-semibold text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3">Membre</th>
                    <th className="px-5 py-3">Contact</th>
                    <th className="px-5 py-3">Rôle</th>
                    <th className="px-5 py-3">Date d&apos;arrivée</th>
                    {data.isAdmin && <th className="px-5 py-3 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.team.map((member) => {
                    const isSelf = member.id === data.profile.id
                    return (
                      <tr key={member.id} className="hover:bg-muted/30">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                              {member.full_name
                                .split(' ')
                                .map((w) => w[0])
                                .slice(0, 2)
                                .join('')
                                .toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground flex items-center gap-1.5">
                                {member.full_name}
                                {isSelf && (
                                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                                    Vous
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground">{member.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-3.5 text-xs text-muted-foreground">
                          {member.phone ? formatPhone(member.phone) : '—'}
                        </td>

                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              member.role === 'admin'
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                            }`}
                          >
                            {member.role === 'admin' ? 'Administrateur' : 'Agent'}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 text-xs text-muted-foreground">
                          {new Date(member.created_at).toLocaleDateString('fr-MA', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>

                        {data.isAdmin && (
                          <td className="px-5 py-3.5 text-right">
                            {!isSelf && (
                              <select
                                value={member.role}
                                onChange={(e) =>
                                  handleRoleChange(member.id, e.target.value as 'admin' | 'agent')
                                }
                                className="h-8 rounded-lg border bg-background px-2 text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                              >
                                <option value="agent">Rôle : Agent</option>
                                <option value="admin">Rôle : Admin</option>
                              </select>
                            )}
                          </td>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Invite Team Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl transition-all">
            <div className="flex items-center justify-between pb-4 border-b">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold">Ajouter un collaborateur</h2>
                  <p className="text-xs text-muted-foreground">Créer un accès pour un nouvel agent</p>
                </div>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="py-4 space-y-3.5">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Nom complet *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Youssef Benali"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="mt-1 flex h-9 w-full rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Adresse Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="youssef@agence.ma"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="mt-1 flex h-9 w-full rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Téléphone (optionnel)
                </label>
                <input
                  type="tel"
                  placeholder="06XXXXXXXX"
                  value={invitePhone}
                  onChange={(e) => setInvitePhone(e.target.value)}
                  className="mt-1 flex h-9 w-full rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Rôle
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'admin' | 'agent')}
                  className="mt-1 flex h-9 w-full rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="agent">Agent (accès à ses leads et propriétés)</option>
                  <option value="admin">Administrateur (gestion totale et équipe)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="rounded-lg border px-4 py-2 text-xs font-medium hover:bg-accent"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-50"
                >
                  {inviting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Création...
                    </>
                  ) : (
                    'Créer le compte'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 4: Integrations */}
      {activeTab === 'integrations' && (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="max-w-xl">
            <h2 className="text-lg font-bold mb-1">WhatsApp Business API</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Configurez l&apos;API WhatsApp Business Cloud pour envoyer des messages directement depuis ImmoLeads.
            </p>

            <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 p-4 mb-6">
              <p className="text-xs text-amber-700 dark:text-amber-400">
                <strong>Prérequis :</strong> Créez un compte Meta Business, configurez l&apos;API WhatsApp Business Cloud,
                et obtenez vos identifiants sur{' '}
                <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="underline">developers.facebook.com</a>
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSaveWhatsApp}>
              <div>
                <label className="text-sm font-medium">Phone Number ID</label>
                <input
                  name="wa_phone_id"
                  value={waPhoneId}
                  onChange={(e) => setWaPhoneId(e.target.value)}
                  placeholder="ex: 104829381920394"
                  className="mt-1 flex h-10 w-full rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <p className="text-xs text-muted-foreground mt-1">Identifiant numérique de votre numéro WhatsApp Business Cloud.</p>
              </div>

              <div>
                <label className="text-sm font-medium">System User Access Token</label>
                <input
                  name="wa_access_token"
                  type="password"
                  value={waAccessToken}
                  onChange={(e) => setWaAccessToken(e.target.value)}
                  placeholder="ex: EAAOx4B..."
                  className="mt-1 flex h-10 w-full rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <p className="text-xs text-muted-foreground mt-1">Jeton d&apos;accès permanent Meta (System User Token).</p>
              </div>

              <div>
                <label className="text-sm font-medium">WhatsApp Business Account ID (WABA ID)</label>
                <input
                  name="wa_business_id"
                  value={waBusinessId}
                  onChange={(e) => setWaBusinessId(e.target.value)}
                  placeholder="ex: 1829304918239"
                  className="mt-1 flex h-10 w-full rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingWhatsApp}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition"
                >
                  {savingWhatsApp ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sauvegarde en cours...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Enregistrer la configuration
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

import type { Metadata } from 'next'
import { HeroSection } from '@/components/landing/hero-section'
import { ProblemSection } from '@/components/landing/problem-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { ProductShowcaseSection } from '@/components/landing/product-showcase-section'
import { FollowUpSection } from '@/components/landing/follow-up-section'
import { BeforeAfterSection } from '@/components/landing/before-after-section'
import { FeaturesGridSection } from '@/components/landing/features-grid-section'
import { TargetAudienceSection } from '@/components/landing/target-audience-section'
import { AtloryxValueSection } from '@/components/landing/atloryx-value-section'
import { QualificationForm } from '@/components/landing/qualification-form'
import { FinalCtaSection } from '@/components/landing/final-cta-section'

export const metadata: Metadata = {
  title: 'ATLORYX ImmoLeads — Du clic à la visite | Solution CRM & Qualification Immobilière',
  description:
    'Transformez vos prospects immobiliers en visites organisées. ImmoLeads centralise vos leads, facilite leur qualification WhatsApp et aide votre équipe à suivre chaque opportunité jusqu’à la visite.',
  openGraph: {
    title: 'ATLORYX ImmoLeads — Du clic à la visite',
    description:
      'Solution PropTech conçue pour les agences immobilières au Maroc. Centralisez vos leads, automatisez vos relances et planifiez davantage de visites.',
    images: ['/images/designe.png'],
  },
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero — Comprendre l'offre en 3 secondes (Laptop & Phone Mockup) */}
      <HeroSection />

      {/* 2. Le Problème — WhatsApp seul n'est pas un système commercial */}
      <ProblemSection />

      {/* 3. Comment ça marche — Du clic à la visite en 6 étapes */}
      <HowItWorksSection />

      {/* 4. Montrer le produit — Tout ce dont votre équipe a besoin (Fond Navy + Dashboard central) */}
      <ProductShowcaseSection />

      {/* 5. Le Différenciateur Clé — Follow-up & Relances intelligentes */}
      <FollowUpSection />

      {/* 6. Avant / Après ImmoLeads — Du chaos au processus structuré */}
      <BeforeAfterSection />

      {/* 7. Fonctionnalités Complètes (Grille 3x2 + ruban) */}
      <FeaturesGridSection />

      {/* 8. À qui s'adresse ImmoLeads ? (Agences, Agents, Promoteurs) */}
      <TargetAudienceSection />

      {/* 9. Valeur Ajoutée ATLORYX — Bien plus qu'un simple CRM */}
      <AtloryxValueSection />

      {/* 10 & 11. Démo & Formulaire de qualification commerciale */}
      <QualificationForm />

      {/* 12. CTA Final — Vos prochains leads vont arriver */}
      <FinalCtaSection />
    </div>
  )
}

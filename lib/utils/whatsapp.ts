/**
 * WhatsApp message templates and URL generator for Moroccan Real Estate CRM.
 */

export interface WhatsAppTemplateContext {
  leadName: string
  agentName?: string
  agencyName?: string
  propertyTitle?: string
  propertyCity?: string
  visitDate?: string
  visitTime?: string
}

export type WhatsAppTemplateKey =
  | 'first_contact'
  | 'property_info'
  | 'visit_confirmation'
  | 'visit_reminder'
  | 'post_visit_followup'

export const WHATSAPP_TEMPLATES: Record<
  WhatsAppTemplateKey,
  { label: string; description: string; generate: (ctx: WhatsAppTemplateContext) => string }
> = {
  first_contact: {
    label: 'Premier contact',
    description: 'Présentation de l’agence suite à une demande générale',
    generate: (ctx) =>
      `Bonjour ${ctx.leadName},\n\nJe suis ${ctx.agentName || 'votre conseiller'} de l'agence ${ctx.agencyName || 'ImmoLeads'}.\n\nJ'ai bien reçu votre demande concernant un projet immobilier. Quand seriez-vous disponible pour un court échange afin de mieux cerner vos critères de recherche ?\n\nBien cordialement.`,
  },
  property_info: {
    label: 'Information sur un bien',
    description: 'Réponse détaillée suite à un intérêt pour une propriété',
    generate: (ctx) =>
      `Bonjour ${ctx.leadName},\n\nSuite à votre intérêt pour notre bien "${ctx.propertyTitle || 'notre propriété'}" situé à ${ctx.propertyCity || 'Maroc'}, je suis à votre entière disposition pour vous transmettre la fiche technique et les photos complémentaires.\n\nSouhaitez-vous organiser une visite cette semaine ?\n\n${ctx.agentName || 'Votre conseiller'} - ${ctx.agencyName || 'ImmoLeads'}`,
  },
  visit_confirmation: {
    label: 'Confirmation de visite',
    description: 'Confirmation de la date et l’heure de la visite',
    generate: (ctx) =>
      `Bonjour ${ctx.leadName},\n\nNous vous confirmons votre visite pour "${ctx.propertyTitle || 'le bien'}" le ${ctx.visitDate || 'date convenue'} à ${ctx.visitTime || 'heure convenue'}.\n\nJe serai présent sur place pour vous accueillir. En cas d'empêchement, merci de me prévenir à l'avance.\n\nÀ très bientôt !`,
  },
  visit_reminder: {
    label: 'Rappel de visite (J-1)',
    description: 'Rappel la veille de la visite',
    generate: (ctx) =>
      `Bonjour ${ctx.leadName},\n\nPetit rappel amical pour notre visite prévue demain à ${ctx.visitTime || 'l\'heure convenue'} concernant "${ctx.propertyTitle || 'le bien'}".\n\nN'hésitez pas si vous avez besoin de précisions sur l'itinéraire.\n\nBonne journée !`,
  },
  post_visit_followup: {
    label: 'Suivi après visite',
    description: 'Demande de retour suite à une visite effectuée',
    generate: (ctx) =>
      `Bonjour ${ctx.leadName},\n\nJ'espère que vous allez bien. Suite à notre visite d'aujourd'hui pour "${ctx.propertyTitle || 'le bien'}", qu'en avez-vous pensé ?\n\nLe bien correspond-il à vos attentes, ou souhaitez-vous que nous explorions d'autres opportunités de notre portefeuille ?\n\nRestant à votre écoute.`,
  },
}

/**
 * Normalizes Moroccan phone number to international format (212XXXXXXXXX).
 */
export function formatWhatsAppPhone(phone: string): string {
  let cleaned = phone.replace(/[\s\-\+\(\)]/g, '')

  // 06XXXXXXXX or 07XXXXXXXX -> 2126XXXXXXXX
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = '212' + cleaned.substring(1)
  } else if (cleaned.startsWith('+212')) {
    cleaned = cleaned.substring(1)
  } else if (!cleaned.startsWith('212') && cleaned.length === 9) {
    cleaned = '212' + cleaned
  }

  return cleaned
}

/**
 * Builds direct WhatsApp URL with prefilled encoded message.
 */
export function buildWhatsAppUrl(phone: string, message: string): string {
  const formattedPhone = formatWhatsAppPhone(phone)
  const encodedText = encodeURIComponent(message)
  return `https://wa.me/${formattedPhone}?text=${encodedText}`
}

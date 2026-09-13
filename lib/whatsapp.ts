/**
 * Build a WhatsApp click-to-chat URL with a pre-filled message.
 *
 * @param agencyPhone  — Agency WhatsApp number (digits only, e.g. "212600000000")
 * @param message      — Pre-filled message text
 * @returns            — Full wa.me URL
 */
export function buildWhatsAppUrl(agencyPhone: string, message: string): string {
  const cleanPhone = agencyPhone.replace(/\D/g, '')
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
}

/**
 * Build a pre-filled WhatsApp message for a property inquiry.
 *
 * @param propertyTitle  — e.g. "Appartement T3 - Guéliz, Marrakech"
 * @param budgetMin      — Minimum budget in DH
 * @param budgetMax      — Maximum budget in DH
 */
export function buildPropertyMessage(
  propertyTitle: string,
  budgetMin?: number | null,
  budgetMax?: number | null
): string {
  const budgetLine =
    budgetMin && budgetMax
      ? `\nالميزانية: ${formatDH(budgetMin)} - ${formatDH(budgetMax)} DH`
      : ''

  return `سلام، أنا مهتم بهذا العقار:\n${propertyTitle}${budgetLine}\nبغيت معلومات أكثر ونحدد زيارة.`
}

/**
 * Build a WhatsApp message for CRM outreach (agent → lead).
 *
 * @param leadName      — Lead's name
 * @param propertyTitle — Property title (if any)
 */
export function buildCRMOutreachMessage(
  leadName: string,
  propertyTitle?: string | null
): string {
  const propertyLine = propertyTitle ? `\nبخصوص: ${propertyTitle}` : ''
  return `سلام ${leadName}،${propertyLine}\nكنتواصل معاك بخصوص طلبك العقاري. واش عندك وقت نهضرو؟`
}

/** Format a number as Moroccan Dirham (e.g. 1,200,000) */
function formatDH(amount: number): string {
  return new Intl.NumberFormat('fr-MA').format(amount)
}

/**
 * Utility formatters and security sanitizers for SITTA UT
 */

export function formatRupiah(amount) {
  const num = Number(amount) || 0
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num)
}

export function formatBuah(qty) {
  const num = Number(qty) || 0
  return `${num} buah`
}

export function formatTanggal(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) {
    // If already formatted like "25 Agustus 2025"
    return String(dateStr)
  }
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

/**
 * Sanitizes HTML to prevent XSS attacks while preserving basic text formatting
 * Allowed tags: <em>, <strong>, <b>, <i>, <u>
 */
export function sanitizeHtml(rawHtml) {
  if (!rawHtml || typeof rawHtml !== 'string') return ''

  // 1. Remove dangerous tags and their contents completely
  let clean = rawHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')

  // 2. Remove all inline event handlers (onerror, onload, onclick, etc.) and javascript: links
  clean = clean.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
  clean = clean.replace(/on\w+\s*=\s*[^\s>]+/gi, '')
  clean = clean.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, '')

  // 3. Allow only safe tags (em, strong, b, i, u, span) without dangerous attributes
  // Replace disallowed tags with escaped equivalents
  const allowedTags = /^(em|strong|b|i|u|span|\/em|\/strong|\/b|\/i|\/u|\/span)$/i
  clean = clean.replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (match, tagName) => {
    if (allowedTags.test(tagName)) {
      // For allowed tags, strip any lingering dangerous attributes
      return match.replace(/\s(on\w+|src|href|style)="[^"]*"/gi, '')
    }
    // Escape unknown or disallowed tags
    return match.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  })

  return clean
}

export function useFormatters() {
  return {
    formatRupiah,
    formatBuah,
    formatTanggal,
    sanitizeHtml,
  }
}

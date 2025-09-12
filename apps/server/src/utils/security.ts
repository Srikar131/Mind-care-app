import sanitizeHtml from 'sanitize-html'

const sanitizeOptions = {
  allowedTags: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  allowedAttributes: {},
  allowedSchemes: ['http', 'https', 'mailto'],
}

export function sanitizeContent(content: string): string {
  return sanitizeHtml(content, sanitizeOptions)
}

export function stripHtml(content: string): string {
  return sanitizeHtml(content, { allowedTags: [], allowedAttributes: {} })
}

// Crisis keywords that should trigger alerts
const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'want to die', 'hurt myself',
  'self harm', 'cutting', 'overdose', 'jump off', 'hanging myself',
  'no reason to live', 'better off dead', 'worthless', 'hopeless',
  'can\'t go on', 'end it all', 'pills', 'razor blade'
]

export function detectCrisisContent(content: string): boolean {
  const lowerContent = content.toLowerCase()
  return CRISIS_KEYWORDS.some(keyword => lowerContent.includes(keyword))
}

// PII patterns to redact before sending to AI
const PII_PATTERNS = [
  // Phone numbers
  /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
  // Email addresses
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  // Social Security Numbers
  /\b\d{3}-\d{2}-\d{4}\b/g,
  // Credit card numbers (basic pattern)
  /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
]

export function redactPII(content: string): string {
  let redacted = content
  PII_PATTERNS.forEach(pattern => {
    redacted = redacted.replace(pattern, '[REDACTED]')
  })
  return redacted
}
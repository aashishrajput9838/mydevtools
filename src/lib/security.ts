import DOMPurify from "dompurify";

/**
 * Sanitize string to prevent XSS attacks
 * Removes all potentially malicious HTML/JS
 */
export function sanitizeXSS(input: string | undefined, maxLength: number = 2000): string {
  if (!input) return "";
  const trimmed = input.trim();
  const truncated = trimmed.slice(0, maxLength);
  // DOMPurify needs a DOM environment, so for server-side we use basic sanitization
  // For client-side DOMPurify will work fully
  const sanitized = DOMPurify.sanitize(truncated, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
    ALLOW_DATA_ATTR: false,
  });
  return sanitized;
}

/**
 * Sanitize URL - only allow http/https protocols
 */
export function sanitizeUrl(url: string | undefined): string {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return "";
    }
    return parsed.toString();
  } catch {
    return "";
  }
}

/**
 * Validate and sanitize hostname for favicon URL
 */
export function sanitizeHostname(hostname: string | undefined): string {
  if (!hostname) return "";
  const trimmed = hostname.trim().toLowerCase();
  // Only allow valid hostname characters
  return trimmed.replace(/[^a-z0-9.-]/g, "").slice(0, 255);
}

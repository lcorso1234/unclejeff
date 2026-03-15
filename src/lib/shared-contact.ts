export type SharedContactPayload = {
  email: string;
  fullName?: string;
  phone: string;
};

const MAX_FIELD_LENGTH = 120;

function base64UrlToBase64(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4;
  return `${normalized}${padding === 0 ? "" : "=".repeat(4 - padding)}`;
}

function sanitizeField(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, MAX_FIELD_LENGTH) : "";
}

function sanitizePhone(value: string) {
  return value.replace(/[^\d+().\-\s]/g, "").slice(0, 32);
}

function sanitizeEmail(value: string) {
  return value.replace(/\s+/g, "").slice(0, MAX_FIELD_LENGTH).toLowerCase();
}

export function decodeSharedContactPayload(token: string): SharedContactPayload | null {
  try {
    const json = Buffer.from(base64UrlToBase64(token), "base64").toString("utf8");
    const parsed = JSON.parse(json) as Record<string, unknown>;
    const email = sanitizeEmail(sanitizeField(parsed.email));
    const phone = sanitizePhone(sanitizeField(parsed.phone));
    const fullName = sanitizeField(parsed.fullName);

    if (!email || !phone) {
      return null;
    }

    return {
      email,
      fullName,
      phone,
    };
  } catch {
    return null;
  }
}

export function deriveSharedContactName(payload: SharedContactPayload) {
  if (payload.fullName?.trim()) {
    return payload.fullName.trim();
  }

  const localPart = payload.email.split("@")[0]?.replace(/[._-]+/g, " ").trim();
  if (localPart) {
    return localPart.replace(/\b\w/g, (character) => character.toUpperCase());
  }

  return "Shared Contact";
}

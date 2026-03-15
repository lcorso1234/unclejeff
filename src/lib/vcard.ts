export type ContactCard = {
  email?: string;
  filename: string;
  note?: string;
  organization?: string;
  photoBase64?: string;
  photoType?: string;
  phone?: string;
  title?: string;
  fullName: string;
  lastName?: string;
  firstName?: string;
};

function escapeVCardValue(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

function stripPhoneFormatting(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function foldVCardLine(line: string) {
  const maxLength = 75;

  if (line.length <= maxLength) {
    return line;
  }

  const folded: string[] = [];
  let index = 0;

  while (index < line.length) {
    const chunk = line.slice(index, index + maxLength);
    folded.push(index === 0 ? chunk : ` ${chunk}`);
    index += maxLength;
  }

  return folded.join("\r\n");
}

function splitName(fullName: string) {
  const trimmed = fullName.trim();
  if (!trimmed) {
    return { firstName: "", lastName: "" };
  }

  const parts = trimmed.split(/\s+/);
  const firstName = parts[0] ?? "";
  const lastName = parts.slice(1).join(" ");
  return { firstName, lastName };
}

export function buildVCard(card: ContactCard) {
  const normalizedName = card.fullName.trim() || "Shared Contact";
  const split = splitName(normalizedName);
  const firstName = card.firstName?.trim() || split.firstName;
  const lastName = card.lastName?.trim() || split.lastName;
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "PRODID:-//unclejeff//Contact Share//EN",
    `N:${escapeVCardValue(lastName)};${escapeVCardValue(firstName)};;;`,
    `FN:${escapeVCardValue(normalizedName)}`,
  ];

  if (card.organization?.trim()) {
    lines.push(`ORG:${escapeVCardValue(card.organization.trim())}`);
  }

  if (card.title?.trim()) {
    lines.push(`TITLE:${escapeVCardValue(card.title.trim())}`);
  }

  if (card.phone?.trim()) {
    lines.push(`TEL;TYPE=CELL,VOICE:${escapeVCardValue(stripPhoneFormatting(card.phone))}`);
  }

  if (card.email?.trim()) {
    lines.push(`EMAIL;TYPE=INTERNET:${escapeVCardValue(card.email.trim())}`);
  }

  if (card.photoBase64?.trim()) {
    lines.push(
      `PHOTO;ENCODING=b;TYPE=${(card.photoType || "JPEG").trim()}:${card.photoBase64.trim()}`,
    );
  }

  if (card.note?.trim()) {
    lines.push(`NOTE:${escapeVCardValue(card.note.trim())}`);
  }

  lines.push("END:VCARD");
  return lines.map(foldVCardLine).join("\r\n");
}

export function createVCardResponse(card: ContactCard) {
  const body = buildVCard(card);

  return new Response(body, {
    headers: {
      "Content-Disposition": `attachment; filename="${card.filename}"`,
      "Content-Type": "text/vcard; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

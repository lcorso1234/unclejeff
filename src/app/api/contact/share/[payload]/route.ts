import { decodeSharedContactPayload, deriveSharedContactName } from "@/lib/shared-contact";
import { createVCardResponse } from "@/lib/vcard";

type RouteContext = {
  params: Promise<{
    payload: string;
  }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { payload } = await context.params;
  const sharedContact = decodeSharedContactPayload(payload);

  if (!sharedContact) {
    return new Response("Invalid contact payload.", { status: 400 });
  }

  const fullName = deriveSharedContactName(sharedContact);
  const filename = `${fullName.replace(/[^a-z0-9]+/gi, "_") || "Shared_Contact"}.vcf`;

  return createVCardResponse({
    filename,
    fullName,
    email: sharedContact.email,
    phone: sharedContact.phone,
    note: "Shared through Jeff Bartosz's digital business card.",
  });
}
